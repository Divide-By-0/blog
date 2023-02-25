---
title: "How Quantum Computers affect Cryptography"
date: 2023-02-16T22:12:03.284Z
type: posts
draft: false
slug: "quantumcrypto"
category: "30 min read"
tags: ["crypto", "zk", "quantum"]
description: "It's really hard to understand how exactly quantum computing affects cryptography, what that timeline is, and how to think about it from a cryptographers perspective. This post hopes to give a mathematically-inclined middle ground of understanding."
---

# Thinking about Quantum x Blockchains

Note: This hasn't been reviewed by an expert, and is just from me skimming through papers. There is likely some error here in my very simplified mental models. However, I think this model is a good middle ground between the oversimplified layman-oriented quantum news articles, and the hyper academic quantum computing papers that are hard for a cryptographer to parse. Leave thoughts/comments/corrections on [the hackmd draft of this post](https://hackmd.io/vXWmu5QsSOGVSz9N03LXuQ)! This is also a mirror of this [zkresearch post](https://zkresear.ch/t/how-quantum-computers-affect-zk-and-blockchains-how-to-quantum-proof-ethereum/59).

## What are the powers of a quantum adversary?

- There are a couple key algorithms here, including Shors and Grovers. The main thing that they can do is **prime factorize and take discrete log**. They cannot help undo hashes (as far as we know).
- Specifically, given a public key, they can derive the private key. This is what leads breaking back-secrecy of any detereministic function of a secret key, such as any [zk ecdsa nullifier scheme](https://blog.aayushg.com/posts/nullifier).

## What happens to blockchains?

- For Bitcoin (and Ethereum), addresses need to have at least one public signature for people to know the public key that corresponds to their address (usually `address = keccak_hash(pk)[0:40]`). Bitcoin is secure, because UTXOs can simply act as one-time-use accounts, and spend all the money -- even if someone can derive the secret key, they will not be able to spend past UTXOs.
- Ethereum can easily transition to a secure keypair set because you can merely have all accounts sign the public key of their new account and submit it to, say, a migration smart contract, which will then hardfork to move everyones Eth to the more secure keypair set. Smart contracts do not have public keys, only addresses (recall that even a quantum computer cannot undo that hash), so funds are safu.

## What parts of zero knowledge exactly are broken?

- tl;dr almost nothing.
- There is a key distinction between statistical and computational zero knowledge (and perfect zk, but that's impractical) -- statistical zero knowledge means that no infinite compute verifier can distinguish between distributions, computational means that no polynomial verifier can distinguish between distributions.
- groth16 (and most proof systems we know in production right now) are perfect zk: [paper](https://eprint.iacr.org/2016/260.pdf), a subset of statistically zk proof systems. This means that even a quantum adversary with access to several past proofs, cannot break past zero knowledge or uncover your secret information.
- However, because they can take discrete log, they can derive the toxic waste from just the public signals of any trusted setup ceremony. Thus, they can fake any ZK-SNARK -- we expect that any current verifier deployed on-chain would have time to migrate to a quantum-resistant proof system prior to this scheme being live. - Similarly, they can derive the discrete logs of the signals used to make IPA commitments hiding, and thus break hiding on IPA commitments. STARKs are still secure though, since they rely on hashing.
- In fact, this can be generalized -- the reason quantum breaks soundness but not secrecy is that there is a fundamental tradeoff here with zk vs soundness of proofs: this fairly short [paper](https://www.cs.cmu.edu/~goyal/ConSZK.pdf) proves you can either have statistical zero knowledge or statistical soundness, but not both. In practice, almost all of our proof systems opt for perfect zk and computational soundness, so quantum computers can fake proofs but past secrets are still secret.

## What is going on with annealing vs qubit computers, the different quantum computing paradigms?

- [NOTE: this point is not completely correct and needs to be rewritten] There are two major quantum computing paradigms: quantum annealing (analog superposition across all of the qubits, which slowly 'anneals' to an approximate solution), and pure quantum computers (have superposition across only quickly-changing discrete gates, but can thus calculate across all the qubits and have intermediate error correction). It's a lot easier to get impressive-seeming qubit counts like 5000 on quantum annealing computers (DWAVE for instance), but they require far more bits for the same task, are usually less efficient, and cannot be error corrected as easily for hard tasks (no strong theoretical results even exist yet as of 2022).
- Pure quantum computers are the ones where you've heard excitement over recently factored numbers like 15 and 35, and these have huge problems with noise (and some think an existential upper bound on the number of qubits due to the noise).

## What do different algorithms like factorization, discrete log, or un-hashing look like on quantum computers?

- Annealing bounds:
  - Quantum annealing can minimize funnctions. For instance, to solve prime factorization, they minimize `(n - pq)` over the bits of n, p, and q: this ends up taking about $$ \frac14 \log^2(n)$$ qubits to prime factorize n: [2018 paper](https://arxiv.org/pdf/1804.02733.pdf).
  - Discrete log to factorize n (with log(n) bits), from a [2021 paper](https://link.springer.com/chapter/10.1007/978-3-030-89432-0_8) shows about $$ 2\log^2(n)$$ qubits needed on annealing based systems, although they ran into practical connectivity issues past n = 6 bits.
  - In fact, it's likely that bigger discrete log is impossible: this [2013 paper](https://arxiv.org/pdf/1307.5893.pdf) shows that the Hamiltonian makes it very hard to convert physical qubits to logical qubits.
- Quantum computer bounds:
  - On actual quantum computers, the bound for simple prime field discrete log is around $$ 3n + 0.002n \log n$$ where n is the number of bits (n=256 for us): [2021 paper](https://arxiv.org/pdf/1905.09749.pdf) -- without considering noise overhead. With noise, they calculate that n = 2048 bit discete log will take 20 million physical qubits.
  - Newer algorithms have shown that elliptic curve discrete log on a curve like secp256k1 is a bit harder, closer to $$ 9n$$ : [2017 paper](https://eprint.iacr.org/2017/598). Past bounds closer to $$ 6n$$ don't explicitly describe how to do arithmetic on elliptic curves and merely provided a lower bound [2008 paper](https://arxiv.org/pdf/quant-ph/0301141.pdf).
  - Again, these are numbers for signal qubits without noise, and noise qubits add several orders of magnitude more qubits than this, so perhaps these initial estimations are not even relevant -- perhaps one should even omit the constant factors with asymptotic notation here to better communicate that.
- Intuitively, why is a hash function hard for any quantum computer? If you write a hash function as a polynomial in the bits of the input, the resulting function has a degree that is far too high for a quantum adversary to reverse. Specifically, root finding on standard quantum computers takes $$ O(n \log(n))$$ time on $$ \log (n)$$ qubits, where n is the degree of the polynomial, [2015 paper](https://arxiv.org/pdf/1510.04452.pdf). While the qubit count may be within imagination, this time is absolutely infeasible (degrees of hash functions expressed as polynomials look like $$ 2^{16000}$$ ). Of course, future specific quantum algorithms might provide some improvement, but this seems like a reasonable first guess.

<!-- ## Is there promising research that would massively improve these estimates in the next n years?
- Unclear. There is work that tries to measure the qubit as it is collapsing, there is always work on better and smaller algorithms, and IBM is constantly pumping out interesting improvements. -->

## What is a reasonable timeline to expect ECDSA on secp256k1 to be broken?

- It seems that expert consensus varies from 2050-never (if the theoretical noise problem is never overcome). Some professors I've spoken to seem to think 2100 is the fastest possible point, and it may take longer to get there because of the valley of death of applications between a few dozen qubits and a few hundred thousand. There is utility on the small end for theoreticians, and utility on the high end for cryptography, but very little intermediate use for qubit counts in the middle, and thus makes ROI for funding much worse.
- IBM has been surprisingly accurate on [it's timeline](https://research.ibm.com/blog/ibm-quantum-roadmap-2025) for qubit computers -- again, these are signal + noise qubits, so the actual signal qubit count is substantially less than the number you see, though the extent to which this is the case depends on the specific algorithm.

## Quantum Resistant Ethereum Keypairs

- So far, I've only seen solutions on ethresearch to quantum proof Ethereum via new keypair types. However, I think there's a more robust solution to migrate Ethereum than hardforking to a quantum resistant keypair -- this would break every single wallet and piece of key-related infra. I think there's a way to quantum-proof Ethereum on the existing ECDSA on secp256k1. The reason it's not currently quantum proof is that after sending a tx, your public key is revealed (i.e. the hash preimage of your address), so you can take the discrete log efficiently with a quantum computer and get someone's secret key. If there was a way to send txs that didn't reveal the public key, this may allow existing keypairs to remain quantum secure.
- A post-quantum keypairs could keep their public key hidden, and only make their addresses public. Then, they just send all of their tx's via a zk proof of knowing a valid signature that corresponds to their address, and that would authorize the transfer, so no one would ever even know their public key! With account abstraction-type solutions, this type of thing could even be possible as soon as that is available on any L2 or L1. It wouldn't work on accounts that have already sent any tx's today (since those reveal public keys), but they could easily send all their assets to a new keypair, and vow to not reveal their public key in those cases. It would quantum proof Ethereum in the long term as well (similarly to how unused utxos in btc are safe right now).
- You'd have to make this ECDSA proof inside ZK-SNARKs super fast to generate and verify, for instance via hyperoptimized efficient ECDSA proofs [like this one](https://personaelabs.org/posts/efficient-ecdsa-1/).
- One issue is that smart contracts need to be special-cased, since we know the pre-image of the address via create2. One easy solution is to hard-code that once a contract has been made by create/create2, transactions that utilize their secret key are disallowed (i.e. no signatures or eoa-style txs will be validated).
- Perhaps, for future smart contracts, if we don't want to special case them, we could standardize around a new opcode (say create3, or create2 with an optional arg), that, say, just swaps the last bit in the create2 output. This keeps the address determination deterministic, but does not reveal the pre-image of the hash.

This is a very rapidly changing field, so these results will likely update year after year.

[Account](https://crypto.stackexchange.com/users/101665/john-targaryen?tab=activity) with stack overflow questions/comments.
