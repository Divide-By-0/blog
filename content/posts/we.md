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
---

Thanks to Sora Suegami, Vivek Bhupatiraju, Gavin Uberti, Yi Sun, Jonathan Wang, Flynn, and Florent for thoughts on witness encryption.

Witness encryption is a pretty underrated idea in cryptography that hasn't been extensively explored or applied (especially in blockchain) yet. Here are some "gradients" of witness encryption:
- Witness ecnryption over NP. This has been proposed many times, but each paper introduces a novel mathematical theorem/assumption along with it.
- Witness encryption over a signature. Encrypting to someone who has a BLS signature (it's kind of a bootstrapped PKI based on pre-images of hashes, where you can just "give" anyone an easy and intuitive "encryption key" that you can also decrypt from, which could even be their raw ECDSA key). This exists!
- Witness encryption over equality. Socialist millionaire's problem solves this.


However, it's important to note that all witness encryption algorithms, including the one implemented by Guberti (and the paper it's based off of), are susceptible to the zeroing attack. This vulnerability is the reason why multilinear maps do not exist.

As of mid-2023, there is no known algorithm for witness encryption that is cryptographically secure. Several papers have proposed such algorithms, but each introduces a novel and unproven mathematical assumption. One exception is the Witness Encryption (WE) from general indistinguishability obfuscation (iO), as discussed in a 2020 paper. However, this approach is highly inefficient, with several gigabytes of overhead per bit.

Interestingly, there is no specific existing code or paper for a zeroing attack on the specific curve parameters that Guberti's WE implementation uses. We have consulted with two professors who have developed such attacks, and both believe it is likely feasible on those curves as well, but not worth their time to implement. This could be a fun direction and way to get to understand some of these schemes and attacks!

One potential strategy to incentivize the breaking of that curve is to lock up funds in a scheme secured by it. This could also be applied to other WE papers, incentivizing the breaking of each of the novel mathematical assumptions. However, we've found that small monetary incentives are not sufficient to motivate math PhD students and professors to shift their research focus -- regardless, its a cool novel way to incentivize mathematical research.

The paper from Protocol Labs, which discusses WE from functional commitments ([paper](https://eprint.iacr.org/2022/1510), [code](https://github.com/vicsn/witness-encryption-functional-commitment)), is promising if you relax the "all NP problems" requirement. However, functional commitments are not very powerful, and most schemes that could be easily functionally committed to can be solved more easily via the socialist millionaire problem.

A more open problem is whether more complex functions can be incorporated into the functional commitment. This is an approachable direction that I would recommend exploring. I hear rumors about WE from IPA but haven't seen anything concrete about it yet.

Some papers don't even try -- [this one](https://eprint.iacr.org/2023/635.pdf) technically "works", but they introduce a multi-party computation (MPC) assumption, which in my opinion, undermines the whole idea. If you trust someone (MPC network) to decrypt, you might as well trust them with the data and verification too. Furthermore, the "honest majority" assumption means you have no idea if the committee cheated and read the data itself, making schemes like this questionable at best.