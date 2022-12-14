---
title: "ZK Email"
date: 2022-12-12T22:12:03.284Z
authors: ["yush_g, sampriti"]
type: posts
draft: false
slug: "zkemail"
category: "15 mins read"
tags: ["crypto"]
description: "A cool way to do trustless email subset verification on chain, and what that unlocks"
---

[TOC]

# Summary

Lack of trustless web2 and web3 integration is one of the leading reasons that blockchains feel siloed from the rest of the world -- there is currently no way of trustlessly interoperating with the exabytes of existing information online, built up over decades by millions of users, that plug into every system that we use every day.

The oracle problem is exactly this -- there is no way to trustlessly ingest off-chain identities, stock prices, or physical actions onto web3, meaning that we have to trust intermediaries like Chainlink to do an API request for us to get that data. This fundamentally undercuts the premise of decentralization, if individual organizations can control and change all the data ingestion for blockchains at will.

At Personae Labs, we are [working in public](https://github.com/zk-email-verify/zk-email-verify) to build out this primitive (along with working with folks from PSE for a next-gen version in Halo2 along with adaptations to JWTs). We think the most trustless method so far for web2-web3 integration is proof of email, due to the preponderance of existing signatures that can be verified on chain. We simultaneously are spinning off this work from 0xPARC into a fresh research group called the Signed Data Group within Personae Labs, in order to further this line of research. If problems like these excite you, reach out to [me](https://twitter.com/yush_g) or [@personae_labs](https://twitter.com/personae_labs) to build with us! If you have questions on this as you read it, feel free to open a Github issue on the website repo, or reply, and we will do our best to clarify.

# What it means to have trustlessly verified identity on chain

One way to verify that some data actually came from some source, is to verify a signature produced by the source via their private keys. Verifying this signature with their public keys lets us ensure that the data actually came from this source. These signatures are not obvious[^1] -- in this work, we hammer down on emails, and have discovered that an algorithm called DKIM (used for email signatures) is a perfect fit for us to verify off chain information. Specifically, every email you receive is signed by the sending domain, so if we can just verify that signature on chain, we are golden! Unfortunately, there are 3 substantial roadblocks to naively doing this:

1. <code>Calldata is too expensive. Verifying it on-chain will be too gas expensive due to the sheer size of the data (calldata is 16 gas per byte, so even 50 kB of data is unacceptably expensive). This problem is not solved by L2s or sidechains (especially pre-danksharding): no matter what, you pay the cost of calldata to be posted on the L1. </code>

2.<code>You want controllable privacy. These signatures can contain a substantial amount of personal information you don't want to reveal. For instance, you should not have to give your email address, if all you want to reveal is your Twitter username. This is not solved by ZK-EVMs, since (as of writing) no production ZK EVMs make use of private data, though it's on the long-term roadmap of some.</code>

3.<code>The algorithms are too expensive. The complexity of the signature verification algorithm itself is gas-intensive, as you are doing huge field exponentiations in Solidity, in a different field than Ethereum. Unlike the other problems, this can be mitigated by being on an L2, or L2/L3 built for proof verification.</code>

How do we solve all of these? Enter zero knowledge proofs and proof of email.

# ZK Proof of Email Construction Explained

Zero knowledge proofs let you prove that you know some information without revealing it. They have two key properties that we lean on in this construction: constant time + space verification cost on-chain (this helps us compress information similar to tricks that ZK-EVMs use, and compress calldata via strategic hashing) and being able to selectively hide and reveal whatever data you want, as you can choose to make public whatever subset of the computation you wish to.
The next few sections will be technical -- if you're just interested in using this technology, skip to the end of the Regex section!

## DKIM

To understand how zero knowledge proofs can help us verify email signatures, we have to fully understand the algorithm first. Luckily, the core algorithm fits on one line:

rsa_sign(sha256(from:<>, to:<>, subject:<>, <body hash>,...), @mit.edu key)

Every email you've received post 2017 likely has this signature on it. A user y just needs to provide any email header from e.g. x@mit.edu to y@mit.edu. The verifier can fetch mit.edu's public key (found on it's DNS TXT records at something like publickey.mailserver.mit.edu), and then verify the signature.

Here's the fascinating part -- if we do this in ZK, we can design applications so that no one except you, not even the mailserver or keystroke tracker, can determine who it is (our proof generation scripts + website can be run 100% client side).

## ZK Circuit

Now that we have this signature, all we need to do is run the traditional signature verification inside a ZK-SNARK! Here is what that looks like:

ZK Proof Public:

- sender domain and receiver domain

- the RSA modulus

- the masked message (can be domains, or part of message)

ZK Proof Private:

- the dkim signature from the mail server

- the length of the pre-hashed message data

- the raw message data

ZK Circuit Checks:

- sha256 and RSA both verify

- the message is well structured via regex

- the chosen regex state matches the mask provided

Contract Checks:

- sender domain == receiver domain

- claimed RSA key == DNS-fetched/cached RSA key

Note that in the current iteration, each application needs its own regex string, which will need its own verifier function. This makes sense, as you want Twitter verification to have a different flow from company domain verification.

# Technical innovations

In order to verify these emails efficiently in ZK, you have to ensure that 1) it works on all emails, up to some reasonable length, and 2) it is not possible to hack the system to fudge properties of the email. For these two to be possible, we had to engineer two new circuit types -- arbitrary length SHA256, and regex in circom.

## Arbitrary length SHA256 hashing

In order to verify all message lengths with the same verifier circuit, it needs to work on all possible email lengths. So we edited the circomlib SHA256 circuit to make it work on all messages up to any max length, and will open source that with a PR to circomlib soon.

On top of that, the email can be so long that the circuit might be infeasibly long (all the HTML tags are also part of the signed body, and alone can add 8 million constraints!). With a tip from @viv_boop, we realized that if you want to prove a value near the end of the email, you can pass a partial preimage of the hash function and only run the last few hashing blocks inside the ZK-SNARK. This works because you need to know the full pre-image to be able to calculate any partial hash. This trick actually works for any sponge-based or Merkle-Damgard based hash function, and can make knowledge of hash preimage verification faster everywhere!

## Regex (Deterministic Finite Automata) in ZK

What is stopping someone from stuffing in their own fields into, say, the subject of an email -- say like they send the subject as "subject: to: aayushg@mit.edu" -- how do we stop our masking parser from getting confused about the real to address?

So, inside the ZK SNARK, we have to parse the fields the exact same way that an email client would -- luckily, \r\n is used as a standard separation character between fields, and efforts to spoof it will result in that text being escaped (i.e. user typed \r\n will appear as \\r\\n), so this combined with text matching is an effective check for email field validity.

In order to do arbitrary regex checks inside of circom, the most efficient method is to auto-generate circom code on the fly. The way that regex works is it uses a deterministic finite automata: a DAG-based data structure that updates the regex "state" associated with each character in the string, by traversing the right edge of the DFA at each character transition. If the DFA ends on a success state, then you know the regex matched. To extract the specific text that matched a regex, you can just isolate a specific DFA state and mask the entire string to only reveal that value. We thusly implemented a short Python program that converts an arbitrary regex into a DFA, and then represents that DFA via gate operations in circom code.

The way this transition to circom constraints occurs is via elementary gates: at each character in order, we compare the current character and the previous character's state, and through a series of AND and multi-OR gates, can deduce what the current state should be. We then import this modular constraint into the relevant circuit -- this means that we have to know the structure of the regex prior to deriving the zkey (although the specific characters being matched can be edited on-the-fly).

# This sounds too good to be true... what are all of the hidden assumptions?

When we say "trustless", we should clarify where exactly the trust assumptions lie, because there are a few. Here's why we have to trust them, and why we think that's ok (and note that we are not a trusted party):

### 1. `The DNS Public Key`

We have to fetch the DNS keys from the DNS records, which may rotate as frequently as every 6 months-2 years. Currently, we include those in plaintext in the contracts and they can be verified with visual inspection, but in the future we hope to trustlessly verify these with DNSSEC as websites opt into this more secure framework.

### 2. `The Sending Mailserver`

The sending mailserver can forge any fake message they want, as they own the private key. However, an adversary with such a key can also send any email they want from anyone in that domain, and so in order for email to be trustworthy, we think that there are sufficient checks and balances to ideally avoid this. In addition, the sending mailserver can change their email formats at will and break any existing zk regex for parsing it, temporarily disabling the zk-email verification and requiring recompilation of the zkey for the system to adjust to the new regex.

### 3. `The Receiving Mailserver`

This server can read all of your mail in plaintext as well as the header, and so someone with keys to the receiver mailserver can also send real proofs for anyone in the domain (for instance, Gmail can read all of your mail). Luckily, anyone can use the S/MIME standard to combat this -- until wider adoption, we hope that mailservers don't abuse this power (you already trust that your mailserver is not reading your email or spoofing mail from you, so largely we already assume this).

Note that if there is a nullifier on the message (Twitter handle, body hash, etc), then these mailservers will also be able to de-anonymize people on chain -- since this again requires them breaching your trust to read your email, we expect existing privacy legislation to be a temporary preventative mechanism until email encryption is more widespread (like Skiff).

# How Serverless ZK Twitter Verification Works

The MVP that Sampriti, I, and lermchair are working on is at https://zkemail.xyz, which allows any user to run the Twitter username verification circuit (although right now there are bugs). You simply send a password reset email to yourself, and download the headers ("Download original email" in Gmail), then paste the contents of the email into the frontend. You can wait for the token to expire if you are worried about us taking it, or use an old reset email -- the thing we are looking for is any on-demand email from Twitter with your username, not the password reset string. Then, you click generate: this creates a ZK proof that verifies the email signature and ensures that only the user's chosen Ethereum address can use this proof to verify email ownership.

So what exactly going on in this ZK circuit? Well, like every other email, we verify that the RSA signature in the DKIM holds when we hash your headers together. Specifically, the header check we verify is that the escaped "from:" email is in fact `@twitter.com`. To avoid people stuffing fields with fake information, we check the `\r\n` before `from` in the header: this cannot be stuffed or faked, since the email client would always escape the user text as `\\r\\n`.

Then, we check the body: this is a second, nested hash in the header. We save a ton of constraints by just regex-matching the string that precedes someone's Twitter username, then extracting the regex state that corresponds to a username. We make just that username public, and verify the hash holds by calculating the last 3 cycles of the Merkle-Damgard hash function, from the username match point onwards. There is no user-generated text of more than 15 characters in this area, so we know that the last such match must be from Twitter itself.

We also need to prevent [malleability](https://zips.z.cash/protocol/protocol.pdf), or the ability for someone external to view your proof, change some parameters, and generate another, unique proof that verifies. We do that by forcing the user to embed their Ethereum address in the proof, as described in [this post](https://www.geometryresearch.xyz/notebook/groth16-malleability) -- anyone stealing the proof would then just verify the same statement (that some Ethereum address owns some Twitter account).

Then, the data gets sent to a smart contract to verify the signature. Why do we need a smart contract at all? Because DNS spoofing is too easy. Because most websites (Twitter included) do not use DNSSEC, there is no signature on the DNS response received -- this makes it very easy to man-in-the-middle the DNS request and give back the wrong public key. If we outsourced verification to anything except an immutable data store, its possible that they may decieved by a fake proof. But how do we get this data into the smart contract? It's hard coded in. People can analyze it by eye and verify themselves that the public key listed in the code matches the DNS record that they can view online or fetch from their computer.

As that smart contract gains legitimacy and public acceptance, people can verify that the DNS record is in fact accurate, and if it's ever wrong, fork to the correct address: we expect community consensus to land on the correct key over time . If we attempted to replicate the gaurantees of DNSSEC, by finding a way to issue our own signatures, the holder of the private key of the signature issuing would be a trusted failure point in the entire system. If we outsourced to the client themselves or a server, we open up an additional requirement on the DNS record not being spoofed at the moment in time that the client is verifying the proof. We can enable upgradability upon a switching of the public key through any number of decentralized governance methods, or by lobbying Twitter to enable DNSSEC.

# What will you build, anon?

- People with at least $1M in their Chase bank account

- People who verifiably made a degen call option on robinhood

- People with 10M Twitter followers

- Proving you're a top fan of an artist (via Spotify Wrapped email)

- A decentralized oracle for off chain data, putting price feeds on-chain

- Anonymous Edward Snowden leaks (proving an email from the NSA was sent without revealing who you are)

- ZK Glassdoor / ZK Blind: this requires ZK-JWTs, an easy adaptation on top of our code

We are leading a new research group called the Signed Data Group within Personae Labs, in order to further each such application of this tech. We think that there are many signatures and emails like this hidden all over the internet, and we want to harness their power to bring all of web2 onto web3 without oracles. Reach out to [Personae](personaelabs.org) if you want to build with us, we would love to talk with anyone excited about this tech and support any builders with the resources to build this tech in public.

<!-- Footnotes themselves at the bottom. -->

## Footnotes

[^1] TLS-Notary

You might think that all data online must be signed already, or else how would we trust that a website is who they say they are? Unfortunately, this is not the case -- HTTPS/TLS, the standard used to encrypt all web traffic, surprisingly does not have a signing feature because it uses symmetric encryption instead (aka there are no private keys). This means that any server data we pull from these sessions can be forged by any client (they have the same keys). TLS-Notary attempts to solve some of these problems, but requires users to open a website not as themselves, but as one shareholder in a MPC protocol with a decentralized network of verifiers, who will ensure that the client is not forging messages. The compute cost and complexity of this solution (not to mention the non-collusion assumption on the MPC) make us yearn for a more elegant solution, one that is practical today on-chain.
