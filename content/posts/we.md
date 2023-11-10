---
title: "What is going on with witness encryption?"
date: 2022-11-24T22:12:03.284Z
type: posts
draft: false
slug: "we"
category: "5 min read"
tags: ["recs"]
description: "Witness encryption is a fairly new cryptographic idea, sort of the flip side of zero knowledge. What is the state of research here, how does it work, and what can we do with it?"
aliases:
  - /posts/we
  - /we
  - /posts/witnessencryption
  - /witnessencryption
---

Thanks to Sora Suegami, Vivek Bhupatiraju, Gavin Uberti, Yi Sun, Jonathan Wang, Flynn, and Florent for thoughts on witness encryption. Updated as of 11/9/2023.

Witness encryption is a pretty underrated idea in cryptography that hasn't been extensively explored or applied (especially in blockchain) yet. Here are some "gradients" of witness encryption:
- Witness ecnryption over NP. This has been proposed many times, but each paper introduces a novel mathematical theorem/assumption along with it (which is super sketchy since no one knows it this is sound) or has been broken, more information below.
- Witness encryption over a signature. Encrypting to someone who has a BLS signature (it's kind of a bootstrapped PKI based on pre-images of hashes, where you can just "give" anyone an easy and intuitive "encryption key" that you can also decrypt from, which could even be their raw ECDSA key). This exists!
- Witness encryption over equality. Socialist millionaire's problem solves this.

However, it's important to note that all witness encryption algorithms over NP, including the one implemented by Guberti (and the paper it's based off of), are susceptible to the zeroing attack. This vulnerability is the reason why multilinear maps do not exist.

As of mid-2023, there is no known algorithm for witness encryption that is cryptographically secure. Several papers have proposed such algorithms, but each introduces a novel and unproven mathematical assumption. One exception is the Witness Encryption (WE) from general indistinguishability obfuscation (iO), as discussed in a 2020 paper. However, this approach is highly inefficient, with several gigabytes of overhead per bit.

Interestingly, there is no specific existing code or paper for a zeroing attack on the specific curve parameters that Guberti's WE implementation uses. We have consulted with two professors who have developed such attacks, and both believe it is likely feasible on those curves as well, but not worth their time to implement. This could be a fun direction and way to get to understand some of these schemes and attacks!

One potential strategy to incentivize the breaking of that curve (or any other witness encryption assumption) is to lock up funds in a scheme secured by it. This could also be applied to other WE papers, incentivizing the breaking of each of the novel mathematical assumptions. Talking to a few folks indicates that small monetary incentives are not sufficient to motivate math PhD students and professors to shift their research focus, but I still think it's a cool way to incentivize mathematical research.

If you relax the "all NP problems" requirement, this paper from Protocol Labs discusses WE from functional commitments ([paper](https://eprint.iacr.org/2022/1510), [code](https://github.com/vicsn/witness-encryption-functional-commitment)), and is quite promising. It uses Lipmaa and Pavlyk’s functional commitment scheme -- it's unclear to me how general or efficient these functional commitments really are; they require a bilinear pairing scheme at least so might actually be quite interoperable with zk proofs. Geometry has a great short writeup about how other different functional commitment schemes can in fact handle arbitrary circuits (https://geometry.xyz/notebook/functional-commitments-zk-under-a-different-lens). If you can further relax the succinctness requirement (i.e. don't require linearity), then you might be able to expand the number of admissible functional commitment schemes e.g. 4.2 in this paper could work as well: (https://eprint.iacr.org/2021/1423.pdf) i.e. via garbled circuits and oblivious transfer. I think it's possible to get a r1cs-based proof working in one of these schemes, and I think is the most promising next step.

A more open problem is whether more complex functions can be incorporated into the functional commitment. This is an approachable direction that I would recommend exploring. I hear rumors about WE from IPA but haven't seen anything concrete about it yet.

A number of papers "fake" witness encryption by introducing multi-party computation (MPC) networks as assumptions -- [this one](https://eprint.iacr.org/2023/635.pdf) technically "works", but they as usual such a non-collusion,honest majority system undermines the whole idea. If you trust someone (MPC network) to decrypt, you might as well trust them with the data and verification too. Furthermore, the "honest majority" assumption means you have no idea if the committee cheated and read the data itself, making schemes like this questionable at best (even if the zk proof verification happens on-chain).

A number of other papers combine witness encryption with IBE (identity based encryption). These also seem to defeat the purpose, as you have to know everyone's identity commitments before creating the witness encryption (correct me if I'm wrong).

One interesting project idea is to build a trustless tinder type matching with this. First, everyone commits to, say, 5 people they are most interested in. Those 5 people should get only notified if they also commit to that person as one of their chosen 5 as well. So, after everyone commits, those commitments are used in the FC-WE scheme that everyone then runs, to publish a message only to their 5 folks only if they also had valid commitments (i.e. with them in it, while keeping it anonymous, which doesn't seem possible to me with vanilla zk proofs). Finally, in the reveal stage, everyone attempts to read every message and can only end up reading the ones that work for them.

I can't imagine how to do this with any other tech including FHE, ZK, or on chain logic -- although socialist millionaire problem makes this possible (as the query function is just equality), WE also makes it possible and it seems like a fun early proof of concept.
