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

ZK is the perfect antidote to these -- you can verify off-chain real world cryptography from the source, not need to trust any third parties, and customize your level of anonymity. Verifying signatures is the best way to do this, [as Andrew explains](https://www.andrewclu.com/sign-everything).

# Oauth Scopes

When our data is managed by a central party (i.e. Github, Google), we are all intimately familiar with the 'OAuth Scopes' concept -- whenever anyone requests access to your data, you have to manually grant them access to each thing that they want. But when we have all of our data in one packet signed by a single source, such scopes are usually not as well defined -- instead of having the confidence (["trust experience"](https://stark.mirror.xyz/rkLEVz9p4r3ouusD-WCkWP_iVZYkZ0K7TFkzeRfiXCU)) that some trusted entity is protecting your data to potentially untrusted sites, in the current world, those oauth scopes are delineated by the untrusted party themselves -- and we are forced to trust that that app does as it says.

It would be ideal if self-sovereign data was held in a way that you could authorize specific scopes to your data, so you only have to trust your 'wallet' to act honestly, which would protect you against untrusted applications. We've seen a hint of this with existing wallets, where users need to give access to specific ERC20s or NFTs to those applications, but I think the next version of this is far more broad.

Imagine that your email wallet holds your assets, and apps can request arbitrarily programmable scopes via responding to emails. For instance, the ability to spend 5 USDC once and then your CORN forever, but only to the Catan smart contract. Or the ability to sell your NFTs on Opensea automatically, but maybe only when some Uniswap pool has been doing well.

This is only the first step. Imagine if your "wallet" holds not only your assets, but also your private data. Then you can say for instance, only give access to my passport country to this app, and the country I last bought a flight to from my inbox -- so the only thing the app can do is generate a nullifier that you came from some country.