---
title: "What is going on with witness encryption?"
date: 2023-11-24T22:12:03.284Z
type: posts
draft: false
slug: "we"
category: "5 min read"
tags: ["crypto"]
description: "Witness encryption is a fairly new cryptographic idea, sort of the flip side of zero knowledge. What is the state of research here, how does it work, and what can we do with it?"
aliases:
  - /posts/we
  - /we
  - /posts/witnessencryption
  - /witnessencryption
---

*Thanks to Sora Suegami, Vivek Bhupatiraju, Gavin Uberti, Yi Sun, Jonathan Wang, Flynn, and Florent for thoughts on witness encryption. Originally written in Q4 2022.*

Witness encryption is a pretty underrated idea in cryptography that hasn't been extensively explored or applied (especially in blockchain contexts) yet. Witness encryption is the idea that you can encrypt not to a person or public/private key pair, but to anyone with *any witness* (aka satisfying statement) that satisfies some constraint. This can be people with a certain signature, or possibly even a certain ZK proof! This is powerful -- this means I could be able to send a message i.e. all people who ever tap my [jubmoji card](https://vivs.wiki/Jubmoji) in the future could see, or who ever [get a confirmation email](https://zk.email) from a certain party, or anyone who sends some transaction on the EVM (via a storage proof). The most powerful thing is that this can happen noninteractively -- meaning you can post this "witness encrypted" data on i.e. a blockchain, as well as the kind of data that can be used to unlock it.

Here are some "gradients" of witness encryption, by power:

- **Witness encryption over NP:** This would let us witness encrypt to ZK proofs (i.e. to 'witnesses' that satisfy some arbitrary constraints). Potential solutions have been proposed many times, but each paper introduces a novel mathematical theorem/assumption along with it (which is super sketchy since no one knows it this is sound) or has been broken, more information below. It does give us a concrete direction for interesting mathematical research though -- more research on any of the assumptions could advance the field!
- **Witness encryption over a KZG commitment:** Encrypting to someone who has a satisfying *opening* of a KZG commitment known by the encrypter. You'd think this is enough for KZG opening proofs to solve for ZK proofs as well, but that's not the case since you have to know the full commitment ahead of time, not just the verification function. This [exists from standard assumptions](https://eprint.iacr.org/2024/264), [has open source implementations](https://github.com/cursive-team/trinity-v0/tree/main/laconic), and gives you low-overhead OT schemes (but not much more from what we can tell so far).
- **Witness encryption over a signature:** Encrypting to someone who has a BLS signature (it's kind of a bootstrapped PKI based on pre-images of hashes, where you can just "give" anyone an easy and intuitive "encryption key" that you can also decrypt from, which could even be their raw ECDSA key). This exists and is much more simple than the above schemes, using pairings!
- **Witness encryption over equality:** Encrypt to anyone else who can guess the specific number known to the encrypter. This number is probably ideally at least 128 bits so that you can't brute force. A construction called the Socialist Millionaire's Problem actually solves this, so this concretely exists from standard assumptions.

However, it's important to note that all witness encryption algorithms over NP, including the one implemented by Guberti (and [the 2013 Garg paper](https://eprint.iacr.org/2013/258.pdf) it's based off of), are susceptible to the zeroing attack. This vulnerability is the reason why multilinear maps do not exist.

As of mid-2023, there is no known algorithm for witness encryption that is cryptographically secure. Several papers have proposed such algorithms, but each introduces a novel and unproven mathematical assumption. We know it's theoretically possible because it's possible to construct Witness Encryption (WE) from general indistinguishability obfuscation (iO), as discussed in the landmark 2020 construction from standard assumptions. However, this approach is highly inefficient, with several gigabytes of overhead per bit.

## How does it work?

Imagine someone defined some proof, let's say a [ZK Email](https://zk.email) proof that you got an email invite to a party. Now, anyone invited to the party can create such a proof. For an example, let's say that the co-host wants to share the door code with all invitees now and into the future, but doesn't have the exact up to date list of invitees, and they want it to apply to everyone who ever gets an email invite in the future too. So, they witness encrypt the door code to this "proof".

Now, if we had witness encryption to ZK proofs, anyone who has any valid proof can decrypt the door code. What's the intuitive, non-mathematical way to think about this? Their satisfying witness neatly fits some sort of puzzle, for which only having a satisfying set of numbers (i.e. a proof or witness) can neatly zero out all the levels of hiding. The 'hiding levels' were applied by the the witness encryption process, wherein the structure of the proof is applied on top of the data to be encrypted.

## Building a Technical Intuition

I worked with Nathan last summer on some demos and writeups, and he produced this excellent [writeup](https://hackmd.io/@novus677/ryouyz810) that builds up a technical intuition for BLS witness encryption -- it's very well written and I recommend reading it as the next step.

I might edit this post at a later point to explain how the old, broken schemes for NP witness encryption with multilinear maps worked -- there's a great repo implementing them [here](https://github.com/guberti/witness-encryption-demos), for which solving the sudoku and decrypting still have $4 of prize money to claim (and breaking the witness encryption scheme has $20 left to claim, which seems doable by the zeroing attack).

## Trinity

You can build KZG witness encryption by exploiting pairings not to differently from expanding the BLS witness encrcyption scheme. Turns out you can use KZG witness encryption to build laconic OT, which lets you do private database lookups faster and with less round trips than normal OT. This lets you do fast and noninteractive (or minimal interaction) 2PC, like how [Trinity implements it here](https://github.com/cursive-team/trinity-v0).

## Open Directions

If you relax the "all NP problems" requirement, this paper from Protocol Labs discusses WE from functional commitments ([paper](https://eprint.iacr.org/2022/1510), [code](https://github.com/vicsn/witness-encryption-functional-commitment)), and is quite promising. It uses Lipmaa and Pavlyk’s functional commitment scheme -- it's unclear to me how general or efficient these functional commitments really are, since you need the commitments ahead of time to witness encrypt to valid openings. 

They require a bilinear pairing scheme at least so might actually be quite interoperable with zk proofs. Geometry has a great short writeup about how other different functional commitment schemes can in fact handle arbitrary circuits (https://geometry.xyz/notebook/functional-commitments-zk-under-a-different-lens). If you can further relax the succinctness requirement (i.e. don't require linearity), then you might be able to expand the number of admissible functional commitment schemes e.g. 4.2 in this paper could work as well: (https://eprint.iacr.org/2021/1423.pdf) i.e. via garbled circuits and oblivious transfer. I think it's possible to get a r1cs-based proof working in one of these schemes, and I think is the most promising next step. You still have to commit to some values ahead of time, so it's broadly unclear how useful these functional commitments are.

However, one interesting project idea is to build a trustless tinder type matching with this. Edit: This has been built [open-source](https://github.com/novus677/witness-encrypt-tinder) by Nathan [demo](https://oblivious-site.onrender.com)!

First, everyone commits to, say, 5 people they are most interested in. Those 5 people should get only notified if they also commit to that person as one of their chosen 5 as well. So, after everyone commits, those commitments are used in the FC-WE scheme that everyone then runs, to publish a message only to their 5 folks only if they also had valid commitments (i.e. with them in it, while keeping it anonymous, which doesn't seem possible to me with vanilla zk proofs). Finally, in the reveal stage, everyone attempts to read every message and can only end up reading the ones that work for them.

I can't imagine how to do this with any other tech including FHE, ZK, or on chain logic. However, you can do this with the socialist millionaire construction makes the tinder example possible (as the query function is just equality). However, WE also makes it possible and it seems like a fun early proof of concept, and you might be able to extend it in ways that the socialist millionaire construction doesn't support.

A more open problem is whether more complex functions can be incorporated into the functional commitment. This is an approachable direction that I would recommend exploring. I hear rumors about WE from IPA but haven't seen anything concrete about it yet.

## Interesting Directions

Here's a smattering of other directions I think would be good to explore:

- It would also be great to get a sense of if pseudo-randomness
for smooth projective hash functions (the novel assumption introed in this paper) in the presence of proofs is true without relying on the generic group model to unlock this WE scheme over Groth Sahai proofs https://eprint.iacr.org/2015/1073.pdf. 
- It would be cool to have a blog post or paper also describing a zeroing attack on the original MLM proposed in https://eprint.iacr.org/2013/258.pdf and implemented by Gavin Uberti, which we are confident can be broken but don’t have exact parameters for yet.
  - There is no specific existing code or paper for a zeroing attack on the specific curve parameters that Guberti's WE implementation uses. We have consulted with two professors who have developed such attacks, and both believe it is likely feasible on those curves as well, but not worth their time to implement. This could be a fun direction and way to get to understand some of these schemes and attacks!
  - Gavin's [implementation incentivizes](https://github.com/guberti/witness-encryption-demos?tab=readme-ov-file#prize-public-keys) the breaking of that curve (or any other witness encryption assumption) by locking up about $20 in a wallet whose private key is witness encrypted by it. This could also be applied to other WE papers, incentivizing the breaking of each of the novel mathematical assumptions. Talking to a few folks indicates that small monetary incentives are not sufficient to motivate math PhD students and professors to shift their research focus, but I still think it's a cool way to incentivize mathematical research.
- The evasive LWE assumption was introduced by https://eprint.iacr.org/2022/1140 and unlocks witness encryption with LWE, but we do not know any proof of it yet.
  - I think it would still be compelling to implement this! Evasive LWE has appeared in a few paper since then and may be a decent new candidate assumption.
- I want someone to create large, 100K+ bounties for breaking novel cryptographic assumptions -- this could justify a math student to actually work on that for a year.
- There's super crazy shit you can cook up like [Octopus](https://ethresear.ch/t/octopus-contract-and-its-applications/17844), where combining witness encryption with one-time programs, FHE, and garbled circuits to get private smart contracts.

## IBE is not Witness Encryption

A number of papers "fake" witness encryption by introducing multi-party computation (MPC) networks as assumptions -- [this one](https://eprint.iacr.org/2023/635.pdf) technically "works", but they as usual such a non-collusion, honest majority system undermines the whole idea. If you trust someone (MPC network) to decrypt, you might as well trust them with the data and verification too. Furthermore, the "honest majority" assumption means you have no idea if the committee cheated and read the data itself, making schemes like this questionable at best (even if the zk proof verification happens on-chain).

A number of other papers combine witness encryption with IBE (identity based encryption). These also seem to mostly defeat the purpose, as you have to know everyone's identity commitments before creating the witness encryption.
