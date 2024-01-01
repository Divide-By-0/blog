---
title: "Attestations to Provenance: The Sliding Scale of Off-chain Data Guarantees"
date: 2023-11-20T22:12:03.284Z
type: posts
draft: true
slug: "provenance"
category: "30 min read"
tags: ["zk", "crypto"]
description: "A survey of ways get data on-chain, their trust assumptions, why signatures are essential, and the mental model of attestations and provenance."
aliases:
  - /posts/provenance
  - /provenance
  - /posts/provenantdata
  - /provenantdata
  - /posts/attestations
  - /attestations
math: true
---

Verifying off-chain data on-chain is usually fraught with problems; either 1) you verify data from the source, but then need to bootstrap a new network of people or cold-start a new opt-in system, or 2) you verify data from a third party attester, but then need to trust that third party, or 3) you verify real world cryptography on-chain, but in the process leak all of your anonymity.

ZK is the perfect antidote to these -- you can verify off-chain real world cryptography from the source, not need to trust any third parties, and customize your level of anonymity. Verifying signatures is the  
