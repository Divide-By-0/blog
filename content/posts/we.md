---
title: "What is going on with witness encryption?"
date: 2022-11-24T22:12:03.284Z
type: posts
draft: true
slug: "we"
category: "5 min read"
tags: ["recs"]
description: "Witness encryption is a fairly new cryptographic idea, sort of the flip side of zero knowledge. What is the state of research here, how does it work, and what can we do with it?"
---

Underrated and interesting ideas in cryptography that haven't been extensively explored or applied (especially in blockchain) yet:
- Progress on the conjectures posed in witness encryption applications
- Encrypting to someone who has a BLS signature (it's kind of a bootstrapped PKI based on pre-images of hashes, where you can just "give" anyone an easy and intuitive "encryption key" that you can also decrypt from, which could even be their raw ECDSA key)
- Socialist millionaire's problem

Cryptography notes:
- https://dev.risczero.com/bonsai/
    - Pretty interesting way to link off-chain computation to on-chain calls. Could expand precompiles.