---
title: "ZK Email"
date: 2022-12-12T22:12:03.284Z
authors: ["yush_g", "sora", "sampriti"]
draft: false
type: posts
slug: "zkemail"
category: "30 min read"
tags: ["crypto", "zk"]
description: "How to verify data provenance via zk proofs of redacted emails, and what that unlocks"
aliases:
  - /posts/zkemail
  - /zkemail
recommended: true
toc: true
---

The lack of verifiablity of data is going to really matter in an age where AI can generate infinite amount of personal identity verification documents, fake text records, and receipts. The only way to understand provenance is via digital signatures from the source -- in most cases though, no such signature exists. As a result, people often default to using attestations i.e. third parties that attest to having verified the data. While we haven't seen major risks yet, embedding society's trust in these centralized systems carry existential risks -- third parties cannot trust past verifications they've done, can't trust that they haven't been captured by malicious third parties, and result in the provenance of truth relying on a select set of small entities.

However, on the flip side of such attestations (third parties attesting to verifications) lies provenant data: self-attesting data that can be verified anywhere, without any additional protocol acting as a verifying third party. If you can edit the parameters of this provenant data such that you only expose specific data while hiding other data, you can make that provenant data programmably private.

It seems a bit like a pipe dream, but it turns out that we already have a distributed private/public key system that's used billions of times a day to verify provenance already -- email. It may not be obvious, but each email comes with a spam prevention measure called DKIM that digitally signs the email -- I'll go into detail about how it works later in this post. We also have technology to redact information and verify the correctness of subsets of data -- zero knowledge proofs. By combining these, we can build a system to verify *any* receipt or data that goes through your email, in a way that protects your privacy and only reveals what is needed to third parties.

We've spent the last few years bringing research to production for this, with our project [ZK Email](https://zk.email). Our repositories are MIT-licensed and [open source](https://github.com/zkemail/), and has a robust set of [npm packages](https://www.npmjs.com/search?q=%40zk-email) that provide an easy SDK for the circuits, contracts, SDK, and frontend.

We've seen applications already like [zkp2p](https://zkp2p.xyz) use this for mainnet-ready Venmo to USDC bridges, [emailwallet](https://emailwallet.org) use this for sending funds via email, and [nozee](https://nozee.xyz) use this for pseudonymous social media with verified email domains, along with several others mentioned on [zk.email](https://zk.email) and that you can try yourself on [registry.zk.email](https://registry.zk.email). We think that these libraries will lead to an ecosystem of applications that help start to attack the verifiability problem: there are applications in onramps and offramps, whistleblowing, account recovery, KYC, data privacy and ownership, asset ownership, researcher donations, peer to peer payments, and almost every piece of data that aspires to interpret or affect the reality outside its own bubble.

## Trustlessly verified identity

In general, a good way to verify that some data actually came from its purported source is to verify, using the source's public key, a signature produced with the source's private key. How can we use this as an oracle? Well, a huge amount of web2 data flows through email, and conveniently, almost all emails are signed by the sending domain using an algorithm called DKIM.

The core DKIM algorithm fits on one line:

```
rsa_sign(sha256(from:..., to:..., subject:..., <body hash>,...), private key)
```

Every email you've received after 2017 likely has this signature on it. So if you wanted to prove you'd received an email from someone at MIT, you'd just post an email header from someperson@mit.edu to you@yourdomain.com. Then an on-chain verifier can fetch mit.edu's public key (found on its DNS TXT records) and use the key to verify the signature.

Because the header contains a hash of the body of the email, you can also prove what the email says. So for instance, you could verify on-chain that you own a particular Twitter account by posting the DKIM signature from a Twitter verification email you received.

## Problems with a naive implementation

Unfortunately, there are a couple of problems with the approach of using standard public-key cryptography on-chain for this application, via a Solidity DKIM verifier for instance.

1. Calldata is too expensive. Verifying it on-chain will cost too much gas due to the sheer size of the input (calldata is 16 gas per byte, so even 50 kB of data is unacceptably expensive). This problem is not solved by L2s or sidechains (especially pre-danksharding): no matter what, you pay the cost of (compressed) calldata to be posted on the L1, which can get quite large especially with message bodies.

2. You want controllable privacy. For instance, you shouldn't have to give your email address if all you want to reveal is your Twitter username; you shouldn't have to provide the entire body of the email if you just want to prove that it contains a particular string. This is not solved by ZK-EVMs, since (as of this writing) no production ZK-EVMs make use of private data, although it's on the long-term roadmap of some.

3. Verification is too expensive. The complexity of the signature verification algorithm itself is gas-intensive because it entails huge field exponentiations in Solidity, in a different field than Ethereum. (Unlike the other two problems, however, this can be mitigated by an L2 where execution gas is cheap.)

How do we solve all of these? Enter zero-knowledge proofs.

## ZK Proof of Email Construction

Zero-knowledge proofs let you prove that you know some information in your email without revealing it. They have two key properties that we rely on here:

1. Constant time and space verification cost (so that we can make the calldata much smaller; we don't have to post the whole email, just the small part we want to make public, e.g. a Twitter username).
2. Controllable privacy: the ability to make some inputs to the computation public and others private.

Here's the fascinating part -- if we do this in ZK, we can design applications so that no one, not even the mailserver or a keystroke tracker, can identify you as the email recipient, since you can keep your proof inputs private and our proof generation scripts and website can be run 100% client-side.

The next few sections will be technical -- if you're just interested in using this technology, skip to the "How Serverless ZK Twitter Verification Works" section.

### ZK Circuit

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

Note that with circom, each application needs its own regex string, which will need its own verifier function. However, with our audit-in-progress halo2 SDK built atop Axiom V2's OSS code, we can actually create a universal verifier that allows anyone to select their chosen regex DFA as an input to the circuit.

## Technical innovations

A couple of properties we need to ensure are that 1) zk-email works on all emails, up to some reasonable length, and 2) it's impossible to hack the system to fudge properties of the email. For these two to be possible, we had to engineer two new circuit types in Circom and halo2: arbitrary-length SHA256 and regex.

### Arbitrary length SHA256 hashing

In order to verify all messages with the same verifier circuit, the circuit needs to work on all possible email lengths. So we edited the circomlib SHA256 circuit to make it work on all messages up to any max length. We'll open-source that with a PR to circomlib soon.

Even if we can generate a circuit, the email can be so long that the circuit might be infeasibly large (all the HTML tags are also part of the signed body, and alone can add 8 million constraints!). With a tip from Vivek, we realized that if you want to prove a value near the end of the email, you don't have to do the entire hash computation in the ZK-SNARK. The way sponge-based and Merkle-Damgard based hash functions work is that the preimage string gets split into blocks which get hashed successively, each combined with the result of the last. So you can hash all the blocks up to the one you need _outside_ the snark, and then only run the last few hashing blocks inside the snark. What you're proving is not "I have a string that hashes to this value", but rather, "I have a substring that I can combine with the partially computed hash to yield the correct final hash value." This trick works for any sponge or Merkle-Damgard hash function, and can make knowledge of hash preimage verification faster everywhere!

### Regex with Deterministic Finite Automata

A naive way to confirm that you received a message sent to, say, aayushg@mit.edu would be to check the email header for the string "to: aayushg@mit.edu". But then someone else could fake a valid proof by setting the subject line to "subject: to: aayushg@mit.edu". So inside the ZK-SNARK, we have to parse the fields the exact same way that an email client would -- in particular, \r\n is used as a standard separation character between fields, and efforts to spoof it will result in that text being escaped (i.e., if the user types \r\n, it will appear as \\\\r\\\\n), so this combined with text matching is an effective check for email field validity.

But, do we *really* need regex? One can imagine a simpler substring search that matches "\r\nsubject:", then reveals the next n characters, then matches ";\r\n" again at the end of the match. This would work for extracting single fields, but does NOT work (unless you have very messy workarounds) for the from field. We elaborate in the footnotes[^5].

In order to do arbitrary regex checks inside of Circom, the most efficient method is to auto-generate Circom code on the fly. There are new approaches such as [Reef](https://eprint.iacr.org/2023/1886.pdf), but those are not possible to use in the current DKIM setting[^4]. The way regex works is it uses a deterministic finite automaton: a DAG-based data structure consisting of nodes, corresponding to states, and edges, corresponding to each possible character that could come next. Any string input to a regex represents a traversal of the graph, where each successive character tells you which edge to follow. If the DFA ends on a success state, then you know the regex matched. To extract the specific text that matched a regex, you can just isolate a specific DFA state and mask the entire string to only reveal that value. We implemented a short Python program that converts an arbitrary regex into a DFA and then represents that DFA with gate operations in Circom code. Note that we can support all UTF-8 characters.

The way this transition to circom constraints occurs is via elementary gates: at each step, we compare the current character and the current state, and through a series of AND and multi-OR gates, can deduce what the next state should be. We then import this modular constraint into the relevant circuit -- this means that we have to know the structure of the regex prior to deriving the zkey (although the specific characters being matched can be edited on the fly). You can see a deeper dive into ZK DFAs at [Katat's blog](https://katat.me/blog/ZK+Regex), and try out the regex-to-DFA converter and code generator yourself at [zkregex.com](https://zkregex.com). There are a number of optimizations left, and we encourage people building production apps to add additional string-match constraints for constant regions outside the regex to further constrain the email in case it changes.

## Why this is relevant for blockchains

Trustless integration with web2 is one of the leading reasons that blockchains feel siloed from the rest of the world -- there's currently no way of trustlessly interoperating with the exabytes of existing information online, built up over decades by millions of users, that plug into every system we use every day. The resulting isolation of blockchains leads to fully contained apps and ecosystems: a great fit for DeFi or gaming, but a terrible fit for prosocial applications trying to weave themselves into our daily lives.

One of the main causes of this divide is the oracle problem: there's no trustless way to ingest off-chain identities, stock prices, or physical actions onto web3, meaning that we have to trust intermediaries like Chainlink, secure enclaves, tls-notary MPC networks [^1], or http proxies to do an API request for us to get that data. Giving these centralized organizations control over all data ingestion for blockchains fundamentally undercuts the premise of decentralization.

However, on the flip side of such attestations (third parties attesting to verifications) lies provenant data: self-attesting data that can be verified on-chain without any additional protocol acting as a verifying third party. If you can edit the parameters of this provenant data such that you only expose specific parts, you can make that provenant data programmably private. **Programmable provenance** is the holy grail of web2-web3 integration, and it's what zk-email enables.

## Trust assumptions

When we say "trustless", we mean that there's no need to trust any centralized attester for some off-chain fact because we can prove it from the source using zk-email. zk-email itself isn't considered a trusted party either -- in other words, there's no centralized oracle or closed-source code that we'd have to trust to verify the information correctly. But, inherent to any web2 verification, you have to be careful about the specific third parties that are involved.

### 1. The DNS Public Key

We have to fetch the DNS keys from the DNS records, which may rotate as frequently as every six months to two years. Currently we include these in plaintext in the contracts, and they can be verified by inspection, but in the future we hope to trustlessly verify the DNS keys with [DNSSEC](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions) to verify the chain of signatures, giving DNS records better provenance with this more secure framework. Because most websites (Twitter included) don't currently use DNSSEC, there is no signature on the DNS response received, which makes it possible for an adversary to man-in-the-middle the DNS request and give back the wrong public key. Hard-coding the public keys into the contracts instead works at the start (and is what our currently deployed contracts do), but after a few months when keys update, you need some way to mitigate further DNS spoofing risk. Verification on-chain is needed for global consensus over the DNS key state, but there are a few details that are important to get right.

#### Censorship Resistance 

It turns out you can still get censorship resistance -- no matter what, it shouldn't be possible for someone to stop you from making proofs. To that end, the only way to invalidate a previously valid key is by posting it's private key in plain text. What??! It turns out that a few select mailservers rotate via leaking their old private key to avoid provenance (we haven't actually found any in practice, but in theory some papers have recommended it). So old keys remain valid forever, even as key rotatons are happening. New keys are only finalized if no further proofs are made with the old key and all proofs are instead made with the same new key. If there's a disputed new key, then the community can turn to a n-of-m system to resolve it. Until DNSSEC is more widely adopted, we expect to rely on a combination of decentralized governance methods to arbitrate disputed keys on-chain [^2].

#### Decentralized Governance

We expect that a 4-of-5 system of eigenlayer validator attestations, TLS notary on a https DNS server, a diverse set of secure enclaves, and a diverse multisig is a good enough goal until we convince the servers to use DNSSEC. While any one of these is imperfect on its own, an adversary needing to break every single one of them is implausible (and if they do, it's easy to verify the system is being compromised, and then fork to a non-compromised system). We can enable the contract to be upgraded to reflect a changed public key through a combination of decentralized governance methods and fraud proofs.

You might ask, if DNS is unverified, what does ZK Email add atop normal attestations? The answer is that a one-time attestation to a public value (the DNS key) can verify 6 months of private attestations (each individual email) for everyone in the world. It's substantially easier to come to consensus (and if not, voice and exit) for a single public value, and censorship resistance either way gives strong gaurantees in any case.

#### Self-owned Registries

If users don't trust the DNS system, they can also self host their own registry. Since our interface allows DKIM registries self-maintained by your own ECDSA keypair, an organization can rotate keys for an entire group (i.e. a protocol for their community) and remove all trust assumptions on our systems. 

For users attesting to their own emails (like in the email wallet), you can also self-custody your own DNS key rotation without having a keypair (idea by [Oren](https://twitter.com/orenyomtov/)). You send a private email to a second email address that you own, attesting that you own the first email address. Then, after the key rotates, you send another ZK-SNARK proving you previously had access to your email under the old DNS key, and want to rotate it to the new one that you've fetched from your own machine. Unfortunately, it requires users having two email addresses, since self-emails aren't signed. 

### 2. The Sending Mailserver

As the holder of the domain's private key, the sending mailserver can forge any message it wants. But trusting your mailserver is a core trust assumption of email in general, in that you trust, say, Gmail or your university or your company not to send people fake messages from you signed with their DKIM. A more innocuous issue that's probably more likely to arise is that the sending mailserver might change the format of its emails, which would temporarily disable zk-email verification until a new regex is written and a corresponding zkey compiled to handle the new format.

### 3. The Receiving Mailserver

This server can read the plaintext and headers of all the emails you receive, and so someone with keys to the receiver mailserver can also generate valid zk-email proofs for anyone in the domain (for instance, Gmail can read all of your mail, so someone at Google could post a proof generated using an email sent to you). If the sender and receiver encrypt and decrypt messages using the [S/MIME](https://en.wikipedia.org/wiki/S/MIME) standard, this issue can be circumvented, but until that becomes more widely adopted, we rely on the assumption that mailservers won't abuse this power, for the same reasons as (2): you already trust that Google won't, say, steal your verification codes for your bank account and social medias.

#### Anonymity

If you're using zk-email for semi-anonymity (to prove that you're some member of a set, without revealing which member), note that if you post a message on-chain containing a nullifier derived from the email, like a body hash, then the receiving mailserver will be able to associate you with your nullifier, which would link your on-chain message to your identity. For this reason, there's a fundamental tradeoff between being undoxxable to your mailserver and being able to prove the uniqueness of your pseudonymous identity. If you're using an application that uses nullifiers and you're worried about your mailserver reading your mail and de-anonymizing you, you should use an encrypted email provides like Skiff or Protonmail to ensure privacy. We expect existing expectations (i.e. your email provider doesn't snoop through your email) and privacy legislation to be a temporary preventative mechanism until encrypted email providers are more widely adopted, but it shouldn't be relied on for anonymity-critical applications.

Note that it is impossible to do proofs of bodies of mails sent to Protonmail (just headers are fine, though) because they mangle the delimiters by [adding a random 128 bit hex value](https://github.com/ProtonMail/mimemessage.js/blob/d822999942ba10d504b9d0214314ff508517009f/lib/Entity.js#L175). You can see that they [decrypt with a fixed random string](https://github.com/ProtonMail/protoncore_ios/blob/38bda3e7b171049eba3ac57917d1c20bb733e8a5/libraries/Features/Sources/MailSending%2BBuilder.swift#L283) as well. Unfortunately, the best we can recommend is a self-hosted version of Skiff pre-acquisition instead.

However, note that if you use the email wallet SDK to do anonymous transactions, you can have users put encrypted values in their email subjects, keeping content private from the email provider itself (and delay an acceptable amount for the mail server to not be able to cross-correlate).

## How Serverless ZK Twitter Verification Works

Sampriti, I, and [Lermchair](https://twitter.com/lermchair)'s first demo was https://twitter.zk.email, which allows any user to run a Twitter username verification circuit on-chain. You send a password reset email to yourself (soon, normal feed update emails will work too), download the headers ("Download original email" in Gmail), then paste the contents of the email into the frontend. You can wait for the token to expire if you're worried about us taking it, or use an old reset email -- the thing we're looking for is just any on-demand email from Twitter with your username, so the particular password reset string doesn't matter. Next, you click generate: this creates a ZK proof that verifies the email signature and ensures that only the Ethereum address you specify can use this proof to verify email ownership -- more details at the footnote [^3].

We also need to deal with [malleability](https://zips.z.cash/protocol/protocol.pdf): there are ways for someone else who views your proof to change some parameters and generate another unique proof that verifies. We do this by requiring the user to embed their Ethereum address in the proof, as described in [this post](https://www.geometry.xyz/notebook/groth16-malleability) -- that way, we don't actually have to prevent anyone from generating new proofs, since if they did, they would still just be asserting that _your_ Ethereum address owns your Twitter account. Note that --O2 in circom still removes this constraint, so we still need to constrain it via squaring.

Finally, the data gets sent to a smart contract to verify the signature. Recall that we need a smart contract in order to ensure the integrity of the DNS keys.

## Client-Side Privacy

To maximize user privacy, we'd ideally like to generate proofs on the client side so users don't have to send the contents of their emails to an external server. But there are two other properties that trade off against privacy: speed and compression. We'd like to be able to generate proofs fast, and make them small enough to efficiently verify on-chain -- for privacy and data ownership, we want to do as much of the proving locally as is practical. Different users value these properties to different degrees, so our solution is to offer both slower, private clientside options and fast, less private serverside options.

We expect the most privacy-conscious users and applications to utilize client-side proving. But, to maximize user-friendliness, we can default to a permissionless network of relayers (including self-hosted ones) that generate proofs on the user's behalf. In this case, you have to trust your relayer, but in exchange you get speed: since the circom circuits range from one million constraints without body verification to 3-8+ million with body verification, these proofs can take minutes and several CPUs on a user's browser. The same proving on 128-core machines can take less than five seconds. Halo2 proofs of the same circuit in the browser take only 15 seconds but produce proofs that are more expensive to verify on chain, so we are currently innovating on efficient server-side aggregation techniques to drive down the cost.

We can also utilize recursive halo2 proofs to reduce the burden on the client without giving up compression or privacy. We do this by generating a fast but uncompressed proof on the client side, so that the plaintext message doesn't have to leave the client, and then sending that proof to a generic halo2 aggregation machine (or a permissionless network of them) that recursively compresses that proof on a 64+ core computer in a matter of seconds; the result is a proof that's small enough to be verified on-chain efficiently but still costs less than cents per proof and preserves the privacy of the email. This is enabled by the PSE [snark-verifier](https://github.com/privacy-scaling-explorations/snark-verifier) library, and we use Axiom's variant for speed improvements and a universal verifier. We expect the initial proof to take around 15 seconds to generate on a user's computer and the compression to take around ~1 minute on the server. If you're excited to help us optimize the circuits (circom or halo2), or the prover efficiency, we have lots of grants available!

## What we built

[Sampriti](https://github.com/sampritipanda/) and [I](https://twitter.com/yush_g) built the first MVP of zk-email in 2022, which has since been taken to production by Yush, [Sora](https://twitter.com/SoraSue77), Saleel, Rasul, Wataru, Aditya, Shreyas, Rute, Dimitri, and Shubham. We've had invaluable help from folks like the [ZKP2P team](https://twitter.com/zkp2p), [Vivek](https://twitter.com/viv_boop), Jason Morton, and Yi Sun, and have been lucky to have early support from [0xPARC](https://0xparc.org) and Gubsheep, and ongoing support till 2024 from EF PSE. 

We built a [halo2 SDK and circuits](https://github.com/zkemail/halo2-zk-email) to allow efficient, private client-side proofs, [noir circuits](https://github.com/zkemail/zkemail.nr) for even faster client side proofs, and a [registry](https://registry.zk.email) for non-ZK people to define new kinds of proofs in just 5 minutes. Everything is MIT-licensed and open for people to use. In addition, we open sourced [relayer infrastructure](https://github.com/zkemail/email-wallet/tree/main/packages/relayer) for people to run their own email servers with fast serverside proof generation using groth16 and modal (less than 5 seconds and under a cent/proof on an autoscaled spot machine).

## What will you build?

We've shipped audited circom V1 SDKs (primarily for server-side proofs), audit-in-progress halo2 SDKs (primarily for client-side proofs), and [email wallet SDK](https://github.com/zkemail/email-wallet-sdk/) (primarily for proofs about sent emails). You can find them linked on our site [zk.email](https://zk.email). We have a massive list of project ideas on our [Github README](https://github.com/zkemail/#coreinfrastructure-ideas), a few of which are here:

- **Decentralized, Noncustodial Bridges**: Enabled the tech behind a [ZKP2P, a peer to peer Venmo to USDC bridge](https://zkp2p.xyz), now live on L2s.

- **Proof of Email Domain**: Collaborated with [Nozee](https://github.com/sehyunc/nozee) (with [Sehyun](https://github.com/sehyunc), [Kaylee](https://github.com/kayleegeorge), and [Emma](https://github.com/emmaguo13)) to adapt this to JWTs and make the first [email-address-based anonymous message board](https://nozee.xyz) that only reveals your email domain.

- **ZK Regex**: Made a [zk-regex library](https://github.com/zkemail/zk-regex) for both circom and halo2, and made [UI with Javier](https://zkregex.com) for easy circuit generation. We are also working with folks from [Privacy & Scaling Explorations](https://github.com/privacy-scaling-explorations/) to optimize, generalize, and improve the library.

- **Anonymous KYC**: Anyone re-use past KYC confirmation emails to KYC anywhere else. If you want better privacy, you can also prove you passed KYC checks from multiple sources -- for instance, Coinbase and Airbnb. If your nullifier is both email signatures hashed together, Coinbase and Airbnb would have to collude in order to break your anonymity. Generalizing this construction gives us the ability to generate MPC-style assumptions over any set of email senders and/or companies now, even without their permission! You can also integrate KYC into your application via importing an existing Solidity contract, instead of setting up any of your own KYC infrastructure. Collaboration with 0xPARC SRP (Anka and Nathan). This was [built](https://anonkyc.com/) and open sourced!

- **Email Wallet**: Made [email wallet](https://emailwallet.org), live on Arbitrum for ProgCrypto and most of November, that lets you send assets via sending emails. Try out the demo!

Here are a few more applications you could make using zk-email:

- **Identity Claims**: Prove you have at least a million dollars in their Chase bank account, or bought a degen call option on Robinhood, or have at least ten million Twitter followers, or are a Spotify Top Fan of some artist. Prove membership in arbitrary anonymity sets.

- **Price Oracles**: A decentralized oracle for price feeds: prove you received an email from Nasdaq telling you a certain price for a stock, instead of trusting centralized providers like Chainlink.

- **Whistleblowing**: Edward Snowden-style whistleblowing or leaks, without revealing your real identity. Prove you can receive email at an address associated with a particular government organization, like the NSA.

- **ZK Glassdoor/Blind**: Prove you work at a particular company and so can provide firsthand information on what it's like to work there.

- **On-chain Legal Documents**: base-64 decode the attachments on a confirmation email from DocuSign to prove you signed a legal document with certain properties: a tax return for a given amount, or a proof of residence in a given city, or a term sheet from a VC. You can use these proofs to add credibility to your anonymous speech.

We have several crazy applications in the works as well -- we'd love to collaborate with builders to build them out. If problems like these excite you and you care about open source public goods, ask in [our Telegram](https://t.me/zkemail) or privately reach out to [us](https://twitter.com/yush_g) to build with us! We have a massive project list on [our organization readme](https://github.com/zkemail). If you have questions on this as you read it, feel free to open a [Github issue](https://github.com/zkemail/zk-email-verify/issues) on the website repo, or reply, and we will do our best to clarify.

There are lots of interesting constructions you can experiment with, like putting addresses and hashes inside of emails as verification codes (though don't forget the information leakage of unencrypted email). At the same time, there are lots of gotchas -- bcc's aren't signed, so you can't prove that you were the only recipient of an email; the "to" email field isn't signed in Hotmail; timestamps aren't signed by Outlook, and some email providers have quirks that are technically allowed by the DKIM RFC but will break most parsers. If you have an idea for a new construction, we recommend you run it by us so we can help you verify your security assumptions. We have completed one audit by Secbit Labs on the dependencies, and one audit by PSE security on the library itself for production use, and fixed all the issues.

With initial support from 0xPARC and the Ethereum Foundation's Privacy & Scaling Explorations group, [Sora](https://github.com/SoraSuegami/) and I are leading a new research group called ZK Email in order to further the applications of trustless web2-web3 integrations with initial support from 0xPARC and EF PSE. There are signatures and emails like this hidden all over the internet, and we want to harness their power to bring all of web2 onto web3 without centralized oracles. Reach out if you want to build with us or collaborate on ways to expand the use of signed data on-chain -- we would love to talk with anyone excited about this tech and support them with the resources to build on it in public.

## Security

Given the widespread prevalence of spoofed emails and spam, it's natural to ask if this system can be completely broken or spoofed. Due to DKIM being the primary authentication method and not SMTP or other non-cryptographic methods, we believe our method is robust to the vast majority of exploits on traditional email infrastructure.

### SMTP Smuggling

For instance, SMTP smuggling is a [new attack](https://sec-consult.com/blog/detail/smtp-smuggling-spoofing-e-mails-worldwide/) as recently as 2023. While they can spoof SPF/SMTP from those domains, they cannot forge a DKIM signature from the sender's email address [even if spoofed via smtp smuggling], so zk email is secure.

More technically, their method primarily changes SPF/SMTP checks. Their example (Figure 5) of breaking DKIM happens by changing the s= and d= field in the dkim signature as well, meaning they are NOT verifying with the sender's email domain (i.e. the part after the @ in the from field), which is what we check in ZK email. Note that all of their examples that pass DMARC have DKIM disabled, meaning you wouldn't be able to even make ZK email proofs of them. The only mailservers that even receive such bad emails without DKIM verification are Fastmail, Runbox, Postfix, Sendgrid, and Cisco Email Gateway - very few people use those clients [and even if they did receive the email, the DKIM would be bad and not usable in a ZK email proof]. Broadly most exploits cannot forge DKIM from the senders email, which is what we verify in ZK email.

### SpamChannel MailChannel Spoofing

This [DEFCON 31 talk](https://www.youtube.com/watch?v=NwnT15q_PS8) discussed how you can spoof over 2 million domains via MailChannels' garbage security practices. This attack depends on exploiting poor configs in ARC, SPF, and DMARC, in order to disable DKIM checking, and thus get fake emails into an inbox. Since ZK email only verifies DKIM, it is secure against this attack. Since Gmail now only accepts DKIM-passing emails, Gmail inboxes are also robust to this attack now.

### Footnotes

[^1]: **TLS-Notary**<br/>
You might think that all data online must be signed already, or else how would we trust that a website is who they say they are? Unfortunately, this is not the case -- HTTPS/TLS, the standard used to encrypt all web traffic, surprisingly lacks a signing feature because it uses symmetric encryption instead (meaning there are no private keys). This means that any server data we pull from these sessions can be forged by any client (the client and the server share the same key). TLS-Notary attempts to solve some of these problems, but requires users to communicate with websites not as themselves, but as individual shareholders in a multiparty computation protocol with a decentralized network of verifiers, who will ensure that the client is not forging messages. The compute cost and complexity of this solution (not to mention the non-collusion assumption on the MPC) make us yearn for a more elegant solution, one that is practical today on-chain. The worst part about non-collusion assumptions is that we have no idea if the parties colluded -- they can do that entirely off-line and out-of-system.

[^2]: **DKIM Key Rotation**<br/>
How do we handle the oracle problem of getting rotating DKIM keys on-chain? For the few sites using DNSSEC, we can verify that directly. Unfortunately, only about 200 in the Alexa top 100K sites use DNSSEC. This is because DNSSEC has caused [hundreds of outages](https://ianix.com/pub/dnssec-outages.html) including for whole TLDs, causing [many](https://www.mattb.nz/w/2023/06/02/calling-time-on-dnssec/) [folks](https://sockpuppet.org/blog/2015/01/15/against-dnssec/) to [not recommend usage](https://ripe86.ripe.net/presentations/51-2023-05-23-dnssec.pdf) [due to](http://sockpuppet.org/stuff/dnssec-qa.html) risk of misconfiguration and [1024-bit RSA root keys](https://www.imperialviolet.org/2015/01/17/notdane.html). I do think that there are improvements to be made to the standard here without resorting to DANE (DNS over TLS), so ZK Email will be going to the IETF meeting in Vancouver in July 2024 to discuss them.<br/>
For ones not using DNSSEC, we currently let the user have more control over their DKIM key if they want to -- we call this the [User Overrideable DKIM Registry](https://github.com/zkemail/zk-email-verify/blob/main/packages/contracts/UserOverrideableDKIMRegistry.sol), available in ZK Email SDK 6.1.3+. The logic behind this is that all users have some on chain user ID -- usually their wallet address. For instance, wallets that have proven ownership of a certain venmo ID on [zkp2p](https://zkp2p.xyz), or smart contracts that have proven ownership of an email with [email wallet](https://emailwallet.org). These users can set the DKIM registry such that any after any DKIM key rotation for their chosen domains, further queries to that domain's keys with their assosciated user ID must have a signature from their designated 'override key' approving the rotation. This key can be an ECDSA key or any 1271-compatible smart contract signature. Thus, someone who gains access to maliciously rotate any DKIM key will immediately be stopped from stealing funds from users with such settings. Users can also delegate that power to others i.e. their wallet provider or an influential social figure that they trust. We expect that many apps will set this to a user's passkey or [ephemeral key](https://zkemail.gitbook.io/zk-email/login-with-zk-email-oauth-api), such that the interface is as simple as asking them to tap their fingerprint to confirm the DNS query locally every 6-12 months. This will stop malicious users from stealing funds, but if users don't approve key rotations, then their funds are frozen. How do we handle rotating to the new correct key if a user detects a malicious rotation? In our next release, we will let 'override keys' change the set of oracles used to relay the key on-chain: this means that the key doesn't have unilateral control over the DKIM key for that user, but can avoid consensus failures over the DKIM key by letting the user choose the correct key to trust. <br/>
For key rotations for users who have not set an override, we will add more precautions in future versions as well. These include a fraud proving mechanism where if someone claims the key changed, anyone who makes a email with a later timestamp with the old key can kill that proposal. If the secret key was leaked when the key rotated (as is recommended by the newest DKIM standards though no one does it currently), anyone who submits a raw private key can get a bounty and disable that public key (on the other hand, this also allows organizations to opt-out of zk-email, so we will consider whether or not this is worth implementing). <br/>
Additional oracles that we can use in addition to the current delegated multisig include community-nominated representatives, oracles like Uma/Chainlink, the developers of the protocol, key ecosystem protocols using zk email, and past users who have historically submitted honest proofs. We are starting with a delegated multisig for the beta release. We are open to more ways to handle key rotation on-chain!<br/>


[^3]: **Twitter ZK Circuit**<br/>
So what exactly is going on in this ZK circuit? Well, as with every other email, we verify that the RSA signature in the DKIM holds. We verify that the escaped "from:" email is in fact `@twitter.com`. And we check the `\r\n` before `from` in the header to make sure no one's trying to stuff a fake `from` address in another field like the subject line.<br/>
Then, we check the body hash nested inside the hashed header. We save a ton of constraints by only regex-matching the string that precedes a Twitter username -- `email was meant for @` -- and then extracting the last match. (There is no user-generated text of more than 15 characters within this mask, so we know that the last match must be from Twitter itself.) We make just that username public, and verify that the hash holds by calculating the last three cycles of the Merkle-Damgard hash function, from the username match point onwards.

[^4]: **Reef and other ZK Regex Approaches**<br/>
Reef in general is a great piece of research, and it's exciting to see more people think about zk regex approaches. While we were looking forwards to adopting advances such as Reef, upon closer examination Reef is unfortunately not useful in the DKIM setting.<br/>
The primary reason is that 'before Reef can be used, the document D needs to be committed with a polynomial commitment for multilinear polynomials that allows Reef’s NP checker to cheaply read arbitrary entries in D' (page 2). Unfortunately, the existing use of DKIM uses SHA256 of the commitment, so you cannot use their commitment scheme in practice for existing emails without incurring a large overhead to prove commitment equivalence.<br/>
A secondary reason is that it leverages recursion via using Nova directly, but other computations such as RSA are very inefficient or impossible within Nova without newer Nova innovations such as Cyclefold, which have overheads that in practice negate the benefit of using non-recursive circom. I am open to seeing future implementations improve this speed, but the current tooling is not faster for end-to-end email verification in ZK in practice. Skipping automata rely on Nova to skip all sections of form `.+` but not `[^a]+`, but all our existing email regexes require the latter style of constraint i.e. in the format `[^;]+;` to reveal all characters upto the semicolon. It may be useful however, when a regex match occurs entirely in the middle of a regex i.e. there are characters after the semicolon in our above example -- again however, this relies on a Nova-style proof system which is hard to combine with the rest of zk email, especially with non-IVC friendly expensive wrong field math i.e. for RSA plus a 20M+ constraint recursive proof to post on-chain.<br/>
We have lookup-based regex code in Halo2 that performs much better than our Circom code, but was left out of their benchmarking -- however they are correct that many more improvements such as hybrid tables can be made to such lookup arguments -- because in practice regex matching with lookups is not a bottleneck, and efficient extraction becomes a larger bottleneck.

[^5]: **Why you need a regex for the from: field**<br/>
The main reason we need this is because of the diverse formatting of the from: field. According to the DKIM RFC (and reproduced fully in practice), the from field comes in 5 flavors:<br/><br/>
from: "User Set Name" &lt;test@gmail.com&gt;;<br/>
from: User Set Name &lt;test@gmail.com&gt;;<br/>
from: &lt;test@gmail.com&gt;;<br/>
from: "&lt;faketest@test.com&gt;" &lt;test@gmail.com&gt;;<br/>
from: "&lt; faketest@test.com&gt;" &lt;test@gmail.com&gt;;<br/>
from: "test@gmail.com";<br/>
from: test@gmail.com;<br/><br/>
I couldn't find any concrete examples of the last 2 after checking a couple of emails, but they are in spec and I can imagine that it would pass your incoming spam filter. The first 3 are common and you can reproduce the fourth/fifth pattern via mail.ru. At this point, you might be able to see where we are going with this. We would need 7 different string match patterns for each suffix and prefix, and then to assert additionally certain character values to ensure that the user was not trying to be clever with escaped quotes or < signs in their name. You're effectively special casing a few concrete paths through a regex DFA, and the special-cased code would become exceedingly hard to maintain and verify.<br/>
Another good question we get sometimes is, how can you possibly parse body HTML with a regular expression, if HTML is explicitly a non-regular expression (i.e. can contain recursive structure)? The answer is that we expect message body parsing to be roughly constant between emails -- you can imagine that two payment confirmation emails effectively differ in a handful of characters, and the rest are held constant. So unless you are parsing highly customized HTML, most HTML can be modelled as a series of constant substrings with variable strings in between them -- which can be parsed by a regex.
