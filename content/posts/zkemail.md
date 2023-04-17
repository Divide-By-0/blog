---
title: "ZK Email"
date: 2022-12-12T22:12:03.284Z
authors: ["yush_g, sampriti"]
type: posts
draft: false
slug: "zkemail"
category: "30 min read"
tags: ["crypto", "zk"]
description: "A cool way to do server-free, mostly-trustless email subset verification on chain, and what that unlocks"
---

<!-- [TOC] -->



The lack of trustless integration between web2 and web3 is one of the leading reasons that blockchains feel siloed from the rest of the world -- there's currently no way of trustlessly interoperating with the exabytes of existing information online, built up over decades by millions of users, that plug into every system that we use every day.

This is the oracle problem: there's no trustless way to ingest off-chain identities, stock prices, or physical actions onto web3, meaning that we have to trust intermediaries like Chainlink to do an API request for us to get that data. And giving centralized organizations control over all data ingestion for blockchains fundamentally undercuts the premise of decentralization.

[Sampriti](https://github.com/sampritipanda/), [Vivek](https://twitter.com/viv_boop) and I are building a trustless alternative web2-web3 integration primitive: zk-email. Our repository is [open source](https://github.com/zk-email-verify/zk-email-verify/).


# Trustlessly verified identity on chain

In general, a good way to verify that some data actually came from its purported source is to verify, using the source's public key, a signature produced with the source's private key. How can we use this as an oracle? Well, a huge amount of web2 data flows through email, and conveniently, almost all emails are signed by the sending domain using an algorithm called DKIM.


The core DKIM algorithm fits on one line:

```
rsa_sign(sha256(from:<>, to:<>, subject:<>, <body hash>,...), private key)
```

Every email you've received after 2017 likely has this signature on it. So if you wanted to prove you'd received an email from someone at MIT, you'd just post an email header from someperson@mit.edu to you@yourdomain.com. Then an on-chain verifier can fetch mit.edu's public key (found on its DNS TXT records) and use the key to verify the signature.

Because the header contains a hash of the body of the email, you can also prove what the email says. So for instance, you could verify on-chain that you own a particular Twitter account by posting the DKIM signature from a Twitter verification email you received.

    
# Problems with a naive implementation
    
Unfortunately, there are a couple of problems with the approach of using standard public-key cryptography on-chain for this application.

1. Calldata is too expensive. Verifying it on-chain will cost too much gas due to the sheer size of the input (calldata is 16 gas per byte, so even 50 kB of data is unacceptably expensive). This problem is not solved by L2s or sidechains (especially pre-danksharding): no matter what, you pay the cost of calldata to be posted on the L1.

2. You want controllable privacy. For instance, you shouldn't have to give your email address if all you want to reveal is your Twitter username; you shouldn't have to provide the entire body of the email if you just want to prove that it contains a particular string. This is not solved by ZK-EVMs, since (as of this writing) no production ZK-EVMs make use of private data, although it's on the long-term roadmap of some.

3. Verification is too expensive. The complexity of the signature verification algorithm itself is gas-intensive because it entails huge field exponentiations in Solidity, in a different field than Ethereum. (Unlike the other problems, however, this can be mitigated by an L2 built for proof verification.)

How do we solve all of these? Enter zero-knowledge proofs.

# ZK Proof of Email Construction

Zero-knowledge proofs let you prove that you know some information without revealing it. They have two key properties that we rely on here:
1. Constant time and space verification cost (this helps us compress information similar to tricks that ZK-EVMs use, and compress calldata via strategic hashing)
2. Controllable privacy: the ability to make some inputs to the computation public and others private.

The next few sections will be technical -- if you're just interested in using this technology, skip to the end of the Regex section.


Here's the fascinating part -- if we do this in ZK, we can design applications so that no one, not even the mailserver or keystroke tracker, can identify you as the email recipient, since you can keep your proof inputs private and our proof generation scripts and website can be run 100% clientside.

## ZK Circuit

We're going to do basically the same signature verification from before, but inside a ZK-SNARK and using regular expressions. Here's what that looks like:

Public Inputs to ZK Proof:

- the sender domain
- the RSA modulus
- the masked message

Private Inputs to ZK Proof:

- the DKIM signature from the mailserver
- the length of the raw (unhashed) message data (so we can fix the max size of the circuit)
- the raw message data

ZK Circuit Checks:

- sha256 and RSA both verify
- the message is structured as a valid DKIM-signed email (we use regex to confirm that it has the right signature structure and headers)
- the chosen regex state matches the mask provided

Contract Checks:

- RSA public key claimed to belong to sender == RSA public key fetched from DNS or cached

Note that in the current iteration, each application needs its own regex string, which will need its own verifier function.

# Technical innovations

A couple of properties we need to ensure are that 1) zk-email works on all emails, up to some reasonable length, and 2) it's impossible to hack the system to fudge properties of the email. For these two to be possible, we had to engineer two new circuit types in Circom: arbitrary-length SHA256 and regex.

## Arbitrary length SHA256 hashing

In order to verify all messages with the same verifier circuit, the circuit needs to work on all possible email lengths. So we edited the circomlib SHA256 circuit to make it work on all messages up to any max length. We'll open-source that with a PR to circomlib soon.

Even if we can generate a circuit, the email can be so long that the circuit might be infeasibly large (all the HTML tags are also part of the signed body, and alone can add 8 million constraints!). With a tip from Vivek, we realized that if you want to prove a value near the end of the email, you don't have to do the entire hash computation in the ZK-SNARK. The way sponge-based and Merkle-Damgard based hash functions work is that the preimage string gets split into blocks which get hashed successively, each combined with the result of the last. So you can hash all the blocks up to the one you need *outside* the snark, and then only run the last few hashing blocks inside the snark. What you're proving is not "I have a string that hashes to this value", but rather, "I have a substring that I can combine with the partially computed hash to yield the correct final hash value." This trick works for any sponge or Merkle-Damgard hash function, and can make knowledge of hash preimage verification faster everywhere!

## Regex with Deterministic Finite Automata

A naive way to confirm that you received a message sent to, say, aayushg@mit.edu would be to check the email header for the string "to: aayushg@mit.edu". But then someone else could fake a valid proof by setting the subject line to "subject: to: aayushg@mit.edu". So inside the zkSNARK, we have to parse the fields the exact same way that an email client would -- in particular, \r\n is used as a standard separation character between fields, and efforts to spoof it will result in that text being escaped (i.e., if the user types \r\n, it will appear as \\r\\n), so this combined with text matching is an effective check for email field validity.

In order to do arbitrary regex checks inside of Circom, the most efficient method is to auto-generate Circom code on the fly. The way regex works is it uses a deterministic finite automaton: a DAG-based data structure consisting of nodes, corresponding to states, and edges, corresponding to each possible character that could come next. Any string input to a regex represents a traversal of the graph, where each successive character tells you which edge to follow. If the DFA ends on a success state, then you know the regex matched. To extract the specific text that matched a regex, you can just isolate a specific DFA state and mask the entire string to only reveal that value. We implemented a short Python program that converts an arbitrary regex into a DFA and then represents that DFA with gate operations in Circom code.

The way this transition to Circom constraints occurs is via elementary gates: at each step, we compare the current character and the current state, and through a series of AND and multi-OR gates, can deduce what the next state should be. We then import this modular constraint into the relevant circuit -- this means that we have to know the structure of the regex prior to deriving the zkey (although the specific characters being matched can be edited on-the-fly).

# Trust assumptions

When we say "trustless", we mean that there's no need to trust the claimer of some off-chain fact because we can prove it using zk-email. zk-email itself isn't considered a trusted party either -- in other words, there's no centralized oracle or closed-source code that we'd have to trust to verify the information correctly. But there are a few third parties we still do have to trust.

### 1. The DNS Public Key

We have to fetch the DNS keys from the DNS records, which may rotate as frequently as every six months to two years. Currently we include these in plaintext in the contracts, and they can be verified by inspection, but in the future we hope to trustlessly verify the DNS keys with [DNSSEC](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions) as websites opt into this more secure framework. Because most websites (Twitter included) don't currently use DNSSEC, there is no signature on the DNS response received, which makes it easy for an adversary to man-in-the-middle the DNS request and give back the wrong public key. Hard-coding the public keys into the contracts instead isn't an ideal solution, but it at least mitigates the DNS spoofing risk. This is why we need to do the verification on-chain, since it allows us to put the DNS keys in an immutable data store.

As a contract gains legitimacy and public acceptance, people can verify that the DNS record is in fact accurate, and if it’s ever wrong, fork to the correct record: we expect community consensus to land on the correct key over time. If we attempted to replicate the guarantees of DNSSEC by finding a way to issue our own signatures, the holder of the private key of the signature issuing would still be a single failure point. If we outsourced to the client or a server, we'd still have to somehow ensure that the DNS record wasn't being spoofed at the moment the client was verifying the proof. We can enable upgradability upon a switching of the public key through any number of decentralized governance methods, or by lobbying Twitter to enable DNSSEC.

### 2. The Sending Mailserver

As the holder of the domain's private key, the sending mailserver can forge any  message it wants. But trusting your mailserver is a core trust assumption of email in general, in that you trust, say, Gmail or your university or your company not to send people fake messages from you signed with their DKIM. A more innocuous issue that's probably more likely to arise is that the sending mailserver might change the format of its emails, which would temporarily disable zk-email verification until a new regex is written and a corresponding zkey compiled to handle the new format.

### 3. The Receiving Mailserver

This server can read the plaintext and headers of all the emails you receive, and so someone with keys to the receiver mailserver can also generate valid zk-email proofs for anyone in the domain (for instance, Gmail can read all of your mail, so someone at Google could post a proof generated using an email sent to you). If the sender and receiver encrypt and decrypt messages using the [S/MIME](https://en.wikipedia.org/wiki/S/MIME) standard, this issue can be circumvented, but until that becomes more widely adopted, we rely on the assumption that mailservers won't abuse this power, for the same reasons as (2): you already trust that Google won't, say, steal your verification codes.

If you're using zk-email for semi-anonymity (to prove that you're some member of a set, without revealing which member), note that if you post a message on-chain containing a nullifier derived from the email, like a body hash, then the receiving mailserver will be able to associate you with your nullifier, which would link your on-chain message to your identity -- since this again requires them breaching your trust to read your email, we expect existing privacy legislation to be a temporary preventative mechanism until encrypted email like [Skiff](https://skiff.com/) is more widespread.

# How Serverless ZK Twitter Verification Works

Sampriti, [lermchair](https://twitter.com/lermchair), and I are working on an MVP, https://zkemail.xyz, that allows any user to run the Twitter username verification circuit (although right now it's prone to bugs if you change anything, so keep that in mind if you want to play around with adapting it). You send a password reset email to yourself, download the headers ("Download original email" in Gmail), then paste the contents of the email into the frontend. You can wait for the token to expire if you're worried about us taking it, or use an old reset email -- the thing we're looking for is just any on-demand email from Twitter with your username, so the particular password reset string doesn't matter. Next, you click generate: this creates a ZK proof that verifies the email signature and ensures that only your chosen Ethereum address can use this proof to verify email ownership.

So what exactly is going on in this ZK circuit? Well, as with every other email, we verify that the RSA signature in the DKIM holds. We verify that the escaped "from:" email is in fact `@twitter.com`. And we check the `\r\n` before `from` in the header to make sure no one's trying to stuff a fake `from` address in another field like the subject line.

Then, we check the body hash nested inside the hashed header. We save a ton of constraints by only regex-matching the string that precedes a Twitter username -- `email was meant for ` -- and then extracting the last match. (There is no user-generated text of more than 15 characters within this mask, so we know that the last match must be from Twitter itself.) We make just that username public, and verify that the hash holds by calculating the last three cycles of the Merkle-Damgard hash function, from the username match point onwards.

We also need to deal with [malleability](https://zips.z.cash/protocol/protocol.pdf): the ability for someone else to view your proof, change some parameters, and generate another unique proof that verifies. We do this by requiring the user to embed their Ethereum address in the proof, as described in [this post](https://www.geometryresearch.xyz/notebook/groth16-malleability) -- that way, we don't actually have to prevent anyone from generating new proofs, since if they did, they would still just be asserting that *your* Ethereum address owns your Twitter account.

Finally, the data gets sent to a smart contract to verify the signature. Recall that we need a smart contract in order to ensure the integrity of the DNS keys.


# What will you build, anon?
Here are a few applications you could make using zk-email:

- Anonymity sets: people with at least a million dollars in their Chase bank account, or who verifiably bought a degen call option on Robinhood, or who have at least ten million Twitter followers, or who are Spotify Top Fans of an artist

- A decentralized oracle for price feeds: you prove you received an email from Nasdaq telling you a certain price for a stock

- Edward Snowden-style whistleblowing or leaks: prove you can receive email at an address associated with a particular government organization, like the NSA

- ZK Glassdoor or Blind: prove you work at a particular company

- Decentralized anonymous KYC: you prove you've passed KYC checks from e.g. Coinbase or Airbnb
    

So far, in addition to creating zk-email, we've
- collaborated with [Nozee](https://github.com/sehyunc/nozee) (consisting of [Sehyun](https://github.com/sehyunc), [Kaylee](https://github.com/kayleegeorge), and [Emma](https://github.com/emmaguo13)) to adapt this to JWTs and make the first [email-address-based anonymous message board](nozee.xyz)

- isolated the regex into an independent Circom library and CLI tool, [zk-regex](https://github.com/zk-email-verify/zk-regex/), and are working with folks from [Privacy & Scaling Explorations](https://github.com/privacy-scaling-explorations/) for a next-gen version in Halo2, along with various theoretical cryptography and circuit improvements to make the circuits lightning fast.

We have several crazy applications in the works as well. If problems like these excite you, reach out to [me](https://twitter.com/yush_g) to build with us! If you have questions on this as you read it, feel free to open a [Github issue](https://github.com/zk-email-verify/zk-email-verify/issues) on the website repo, or reply, and we will do our best to clarify.

[Sora](https://github.com/SoraSuegami/) and I are leading a new research group within 0xPARC called the Signed Data Group in order to further applications of trustless web2-web3 integrations. There are signatures and emails like this hidden all over the internet, and we want to harness their power to bring all of web2 onto web3 without centralized oracles. Reach out if you want to build with us -- we would love to talk with anyone excited about this tech and support them with the resources to build on it in public.

<!-- Footnotes themselves at the bottom. -->

## Footnotes

[^1] TLS-Notary

You might think that all data online must be signed already, or else how would we trust that a website is who they say they are? Unfortunately, this is not the case -- HTTPS/TLS, the standard used to encrypt all web traffic, surprisingly lacks a signing feature because it uses symmetric encryption instead (meaning there are no private keys). This means that any server data we pull from these sessions can be forged by any client (the client and the server share the same key). TLS-Notary attempts to solve some of these problems, but requires users to communicate with websites not as themselves, but as individual shareholders in a multiparty computation protocol with a decentralized network of verifiers, who will ensure that the client is not forging messages. The compute cost and complexity of this solution (not to mention the non-collusion assumption on the MPC) make us yearn for a more elegant solution, one that is practical today on-chain.
