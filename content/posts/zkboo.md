---
title: "Understand Zero Knowledge Proofs From Scratch in 20 Minutes"
date: 2024-11-21T02:12:03.284Z
authors: ["yush_g"]
type: posts
draft: true
slug: "zkboo"
category: "30 min read"
tags: ["crypto", "zk"]
description: "With just basic polynomial knowledge, construct a novel ZK scheme in 30 minutes and fully understand it."
aliases:
  - /posts/zklearn
  - /zklearn
  - /posts/learnzk
  - /learnzk
  - /zkboo
math: true
---

*Thanks to Sora Suegami for his explanations, Ying Tong and Geometry for introducing the scheme to me, and Vivek for his help on understanding. Thanks to Steven Fay, Florent, Hudzah, Alicia, and all the people who asked great questions to help me refine my explanation. Thanks to CASEY and XXXXXXXX for reviewing this post!*.

It's quite frustrating to me that zero knowledge proofs are considered moon math or esoteric -- you don't need elliptic curves or pairings for all schemes, only the more practical schemes like Groth16 or PLONK. I think zkboo (and it's successor, zkboogie) have been criminally underrated in zk education -- it's so simple that a few undergrads invented it, and it only requires polynomials and modular arithmetic to understand.

Here is a 20 minute whiteboard explanation I gave of the scheme *UPLOAD AND ADD LINK TO YOUTUBE HERE*. If you get to the end, I didn't fully answer the last question asked, but I clear that up in the last section of this post *ADD LINK TO PLACE*.

Here's my roadmap: I'll describe a simple set of equations that we want to prove in zero knowledge, show you a simple interactive scheme to just prove the additions, extend this scheme to also prove multiplications, then finally show you how to make it noninteractive. I'll focus on intuition and the minimal scaffolding you need to implement it yourself in Rust, but if you want the full academic treatment, then you should read Geometry's post or the original paper **ADD LINKS**.

## Basic Scaffolding

## Addition in Zero Knowledge

## Multiplication in Zero Knowledge

## Making it Noninteractive