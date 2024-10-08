---
title: "PLUME: Unique Pseudonymity with Ethereum"
date: 2022-12-01T02:12:03.284Z
authors: ["yush_g"]
type: posts
draft: false
slug: "nullifier"
category: "30 min read"
tags: ["crypto", "zk"]
description: "A signature scheme that enables zk applications with nullifiers on Ethereum addresses, like zk voting, zk airdrops, zk message boards, and zk proof of solvency."
aliases:
  - /posts/plume
  - /posts/nullifier
  - /plume
math: true
toc: true
---

Thanks to Kobi Gurkan, Wei Jie Koh, Vivek Bhupatiraju, Remco, Wei Dai, Nalin, gubsheep, ludens, Blaine Bublitz, Prof. Kalai, Prof. Vaikuntanathan, Prof. Boneh, Richard Liu, Piotr Roslaniec, Lily Jordan, Oren Yomtov, and Riad Wahby [and probably tons of other folks I'm missing, please dm me if I did!] for making this work possible :)

View our progress, technical issues, and grant opportunities on [our Github](https://github.com/plume-sig/zk-nullifier-sig).

## Why do we want PLUMEs?

The proliferation of advances in [zkSNARK](https://ethereum.org/en/zero-knowledge-proofs/) applications has created a useful new [privacy](https://vitalik.eth.limo/general/2022/06/15/using_snarks.html) primitive: a user can prove statements _about_ their identity without revealing their full identity. If you can provide a zkSNARK demonstrating that you know the secret key for an account that is a leaf of the Merkle tree of Bored Ape owners, then you can prove that you own a Bored Ape without telling anyone who you are. Or you could prove that you're part of the group "liquidity providers on Uniswap in the last 24 hours", or maybe even one day that you're part of the group "people with a mutation in the XYZ gene".

Why would you want to prove that you're part of a group? For one thing, you might want to talk with the rest of the group on a forum that's anonymous but also only open to verified members. One application, [heyanon](https://www.heyanon.xyz/), uses ZK verification to anonymously tweet on behalf of members of groups – for instance, victims of the DAO hack. You could expand this into a full-blown semi-anonymous message board, where a user verifies their eligibility by sending a valid zkSNARK with each message proving that they have a valid signature. But it's hard to moderate a forum without consistent identities: you'd need some way of requiring each anonymous account to link all its actions together, so you could track its reputation or ban it if you had to. There are many other applications that require a single pseudonymous identity per user to prevent duplicate actions; for example, claiming an airdrop or voting.

In short, PLUMEs unlock these applications that weren't possible before:

- Anonymous proof of solvency, so exchanges can't share accounts
- Moderation on anonymous message boards of Ethereum addresses
- ZK voting on groups of Ethereum addresses
- ZK airdrops to Ethereum accounts

## One address, one nullifier

Let's say we want to do an [zero-knowledge airdrop](https://github.com/stealthdrop/stealthdrop): I publish a set of addresses whose owners should be allowed to claim the airdrop, but I want to let those owners anonymously receive the airdrop from burner accounts. If you own one of those addresses, you make a new anonymous account and use it to send me a ZK proof that there's some address on the list whose secret key you control (for example, a proof that you can generate a valid signature with the secret key). But what if you then make _another_ new account and send me a new proof to try and claim a second airdrop? I don't know which of the original addresses the proof corresponds to, because it's anonymous, so how do I stop you from claiming arbitrarily many airdrops?

I'd want to require you to submit some kind of public commitment that you're only using your claim once. This kind of unique public identifier is called a “nullifier” because after it's published, it nullifies an address’s ability to perform an action again. From a more general lens of identity, you can think of these as a pen-name, or your PLUME: a Pseudonymously Linked Unique Message Entity.

There are many more uses for these "PLUMEs". Anonymous message boards will need anonymous banning or "upvotes" to curate good content and a healthy community, which requires a consistent anonymous pen-name. [Proof of Solvency](https://vitalik.eth.limo/general/2022/11/19/proof_of_solvency.html) [solutions](https://github.com/summa-dev/circuits-circom) need an anonymous way to ensure that two exchanges cannot share addresses to fake solvency: there needs to be a way to uniquely attest to an address in a way that keeps it private, but no other exchange can also claim that address.

## Some possible nullifier schemes

Let’s consider a few ways we could try to make a nullifier.

### 1. hash(public key)

What if you just post a hash of your public key? This looks promising: your account only has one public key, so you can't post again, and no two accounts have the same public key. But there are only so many on-chain addresses, so an adversary could brute-force compute all the hashes to link the nullifier back to you.

### 2. hash(secret key)

How about if you hash your secret key instead, then? That can't be brute-forced. But what if you want to join a semi-anonymous forum, and then later on you want to receive an anonymous airdrop of a DAO's governance token? You'd be stuck with a single global nullifier, so you could only do one of these things.

### 3. hash(message, secret key)

Let's add in a message: that way, each app can have one canonical message to identify it. This seems pretty good: there's no way to reverse-engineer the nullifier via the secret key; it's lightweight and computable in a hardware wallet, and it's unique for each account and application. But there's a problem: proving the validity of this nullifier would require access to the secret key, and sending a secret key anywhere outside of a secure enclave, like a hardware wallet, compromises security, especially if the user copy-pastes it as plaintext. It’s dangerous for the secret key to leave the enclave, but the elliptic curve pairing functions required for proving zkSNARKS are too complex to be computed in current hardware wallets, so we want the verifier to be able to verify the proof without even having to access the secret key. All computations that do require access to the secret key should be very lightweight so they can be run on a hardware wallet if necessary.

### 4. Deterministic ECDSA signature

What if you sign a message with your secret key, and the signature is your nullifier? That was the initial idea for [stealthdrop nullifiers](https://github.com/stealthdrop/stealthdrop). It's promising because you don't have to provide your secret key anywhere – you just generate the signature yourself. One catch is that this requires what's called a “deterministic signature scheme” -- if you generate a signature that includes some nondeterministic randomness, then the nullifier wouldn't be unique, because you could have a different nullifier for each possible value of the random part. Fortunately, ECDSA, the signature scheme used by Ethereum, is deterministic: the randomness is deterministically derived from the secret key (like `hash[secret key]`, or [in practice](https://github.com/ethereum/go-ethereum/blob/d8ff53dfb8a516f47db37dbc7fd7ad18a1e8a125/crypto/secp256k1/libsecp256k1/src/secp256k1.c#L308)`hash[secret key, m]`). So if you can deterministically sign some app-specific message, you might guess that `hash[sign(message, sk)]` would be an effective nullifier. Unfortunately, this doesn't quite work: to _verify_ the randomness, the zkSNARK would still need to access the secret key. And if we don't commit to a particular piece of randomness, an adversary could generate around $2^{256}$ valid ECDSA signatures (and thus nullifiers) per message. For that reason, normal Ethereum signatures don’t work as a unique anonymous identifier.

### 5. Verifiable random functions/unique signatures

It turns out there’s some literature on verifiable random functions (VRFs) that have essentially the same properties that we want, but these constructions don’t work out of the box with ECDSA. Most of these functions use pairing-friendly curves, but ECDSA uses the secp256k1 elliptic curve. You could imagine a different world where Ethereum used pairing-friendly curves instead, but in that case, it would probably also be using a deterministic signature scheme like BLS, so we wouldn't need a VRF in the first place.

## Properties of a good nullifier

Let's summarize the properties we've determined we need from our nullifier. It should be:

### 1. Unique

Users shouldn't be able to generate multiple nullifiers; otherwise, they could double-spend or double-claim.

### 2. Deterministic

Signature schemes generally incorporate randomness; if the nullifier were computed using randomness generated in a nondeterministic way, then it would be impossible to generate a single uniquely valid nullifier.

### 3. Verifiable with only the public key

The verifier should be able to verify the proof without having to access the secret key, to preserve the security of the secret key.

At this point, you might ask: isn't this a solved problem? Don't [zcash](https://z.cash) and [tornado.cash](https://github.com/tornadocash/tornado-core) get along just fine without more complex nullifiers? Yes – but this is because they make another tradeoff: they allow interactivity. So as a user, you could just hash a secret random string when you first sign up, and then use that hash as a nullifier from then on (this is more or less what tornado.cash uses for withdrawal claims). But interactivity causes a few problems. First, it adds overhead: you need an extra signup phase where people commit to their secret to create a big enough anonymity set, before any anonymous actions happen. Second, the anonymity set is limited to the set of people who have already signed a message: for instance, on tornado.cash, the only people who would withdraw are those who have already deposited, so the first user can only withdraw once several others have deposited to preserve plausible deniability. In this case, anonymity is limited by shaky assumptions, like that other people have interacted with the platform between your deposits and your withdraws, which has already been used to [break anonymity](https://www.tutela.xyz/). And third, Tornado has to reveal your nullifier in plaintext in-browser in order to generate the proof that you know it, allowing Chrome and malicious extensions to access it. It would be better if only the owner of the secret key's wallet could access that information.

Noninteractivity enables new use cases for ZK systems because it allows a large anonymity set from the start. If your ZK proof can verify set membership in the Merkle tree, the validity of the signed message, and the unique nullifier, then the anonymity set is always the full set of all eligible users, and no interaction is required. Compare this to an interactive nullifier such as Tornado’s, where the Merkle tree has to be updated whenever a user joins the anonymity set.

So we'll add this as a fourth property to our list:

### 4. Non-interactive

The user shouldn't have to take any additional actions other than generating a single nullifier.

## PLUME: A promising new standard

With these criteria in mind, let’s try to combine the intuition around simple hash-based functions with our desire for unique signatures. What if a function like $\text{hash}[\text{message, }pk]^{sk}$, easy enough to calculate in a hardware wallet’s secure enclave, were possible to verify with only the public key? This is the key insight we can use to construct our nullifier, by deriving such a verification scheme and using this value as a signature.

Consider a signature that has two parts: a deterministic part based on a message and secret key (like $\text{hash(message)}^{sk} \mod p$), and a non-deterministic part that allows this calculation to be verified. Then we could use the deterministic part as a nullifier and use both the deterministic and nondeterministic parts to verify that it is a valid signature using only the public key.

![good_nullifier_6](../../media/good_nullifier_6.png)

Here’s an example of such an algorithm. Proposed by Kobi and 0xPARC, it’s known as a DDH-VRF (decisional Diffie–Hellman verifiable random function) -- a combination of the [Goh-Jarecki](https://crypto.stanford.edu/~eujin/papers/zkpsig/index.html) EDL signature scheme and [Chaum-Pederson](https://link.springer.com/content/pdf/10.1007/3-540-48071-4_7.pdf) proofs of discrete log equality, inspired by BLS signatures. I’ve color-coded the equivalent numbers so you can check the math.

Here, $\text{hash}$ is a function that hashes directly to the curve, outputting a pair $(x, y)$ instead of a scalar; $\text{hash2}$ is a traditional hash function like SHA-256 or Poseidon. This construction assumes the [discrete log problem](https://en.wikipedia.org/wiki/Discrete_logarithm) is hard; this is known as the decisional Diffie-Hellman assumption (DDH), hence the name. I use exponential notation here so you can apply your usual intuitions about the discrete log, but these exponentiations are actually implemented as elliptic curve multiplications.

![math](../../media/nullifier_math.png)

<!-- Note that this LaTeX is pretty poorly formatted -->

<!-- Private to everyone except the secure enclave chip:<br />
$sk$<br />
$r$<br /><br />
Public to world, calculated inside secure enclave:<br />
$hash[m, pk]^{sk}$ <-- public nullifier<br /><br />
Private input in ZK-SNARK (private to world, public to wallet/user):<br />
$c = hash2(g, pk, hash[m, pk], hash[m, pk]^{sk}, gr, hash[m, pk]^r)$<br />
$pk = g^{sk}$<br />
$s = r + sk * c$ <-- can be public<br />
$g^r$ [optional output]<br />
$hash[m, pk]^r$ [optional output]<br /><br />
Verifier checks in SNARK (calculated locally, private to world):<br />
$g^{[r + sk*c]} / (g^{sk})^c = g^r$<br />
$hash[m, g^{sk}][r + sk * c] / (hash[m, pk]^{sk})^{c} = hash[m, pk]^r$<br />
$c = hash2(g, g^{sk}, hash[m, g^{sk}], hash[m, pk]^{sk}, g^r, hash[m, pk]^r)$<br />
the set inclusion check of the public key -->

Note that in practice, we omit the last two optional private signals and skip the first two verifier checks because the two optional outputs can be calculated from the rest and the hash output check will still pass and verify them all. Also, for wallets that separate the secure element with the secret key from the general computation chip, we usually do the hashing and calculations outside the secure element, and only use the secure element to call the function that multiplies our provided generator points by the secret key (again, the multiplication is represented by exponentiation here).

Although you don't have to understand all of the math, I’ll attempt to explain the intuition. $c$ functions kind of like a [Fiat-Shamir hash](https://en.wikipedia.org/wiki/Fiat%E2%80%93Shamir_heuristic) for proof of knowledge of the secret key. Since it is almost impossible to reverse-engineer a desired hash function output, we can “order” some of the calculations. If we are feeding numbers into the hash function and getting $c$ out, then we can be almost certain that the inputs to the hash function were calculated before $c$, which in turn must have been calculated before calculating any function with $c$ as an input. Thus, $c$ must have been calculated prior to $r + sk * c$. If $c$ was calculated first, we must have precommitted to a specific $g^r$ and thus $r$, since $g^r$ was an input to the hash function that gave us $c$. If we're committed to a particular $r$ by this ordering logic, and we've given a zkSNARK proving that we computed $c$ correctly, then we must have known the secret key in order to have been able to calculate $r + sk * c$.

Conveniently, the verification check doesn't require the secret key anywhere, just the public key $g^{sk}$. This makes it possible to do the proof in a wallet or an extension -- you give your public key to the wallet or extension or whatever is generating the proof, but your secret key never has to leave its enclave.

Importantly, the public nullifier looks like random noise to everyone else, and even knowing the full set of possible public keys leaves you with no way to figure out whether the nullifier came from any particular public key.

Even if the wallet gets breached and all the private signals are leaked, only the public key gets revealed, not the secret key. So the leak would deanonymize the user but still wouldn't allow anyone to steal their funds. (We have a formal proof of this in [our paper](https://aayushg.com/thesis.pdf)!) This is also promising because hardware wallet secure enclaves only need to to exponents of the secret key, and wallets in general only need to be able to compute hashes, not entire ZK proofs. Even if wallets had the compute power to generate ZK proofs, most ZK frameworks have yet to be formally verified, and state-of-the-art implementations are changing every year.

**In summary, we achieve unique pseudonymity via PLUMEs, by deploying verifiably deterministic signatures on ECDSA within wallets. Users can then derive unlinked application-specific nullifiers. Users can also anonymously prove set membership in any set of Ethereum or Bitcoin wallets, via ZK proofs that can be verified efficiently.**

## New use cases enabled

Let's say we've implemented this PLUME system: what can we do now with unique but anonymous identities?

ZK airdrops become easy: we just check that you're in the Merkle tree of allowed users in ZK, and then require that you submit a nullifier to prevent you from claiming the airdrop a second time.

Message boards can have persistent anonymous identity, meaning you can post under the same nullifier three times, and everyone will know that all your posts came from the same person, and that the author of the posts is a member of the group eligible to post to the forum, but no one will know that the author is you. Another huge unlock is moderation -- anonymous accounts can get banned, and anonymous accounts can accrue persistent reputation.

We can build anonymous sybil-resistant apps like voting, where we need to ensure people haven’t double-voted (ideally, we'd also use [MACI](https://privacy-scaling-explorations.github.io/maci/) to prevent bribery by making receipts impossible). This can be done with the nullifier scheme we've just walked through, where the airdropper publishes a list of eligible addresses, and then if you own one of those addresses, you make a burner account to vote from, proving anonymously that you control an eligible address that hasn't already voted. (One wrinkle is that for on-chain applications that require gas, including some voting systems, the burner account won't necessarily have funds with which to pay the gas yet; in these cases, we can maintain anonymity by having users send their proofs to relayers, who front the gas to post the proof on-chain and then get paid off by the election contract.)

I think that wallets that adopt this standard will enable their users to interact with the next generation of ZK applications first. I’m bullish on a future where this is a standard as commonplace as ECDSA signing within every secure enclave.


### Why is ZK voting even interesting?

ZK voting is interesting since it enables fine-grained accountability. Voting is another interesting place where pseudonymity unlocks new functionality, and is intricately linked to both blockchains and zero knowledge (i.e. via semaphore or PLUME). In the current partisan system, representatives who don't vote along party lines are ostracized and booted from their own role in the community. A strategy of honesty is often self-defeating, and we see this tribalism play out in the highest levels of the government. On the other extreme, a completely anonymous system with no accountability means that people can selfishly vote for the option that personally benefits them the most, and the lack of accountability introduces a whole host of unwanted tragedies of the commons.

I claim there's a middle ground. Imagine a voting system in the senate in which senators could prove that they were one of the say 10 senators from their region, and they voted a specific way. Or if they can prove that they are a Republican, and voted a specific way. Forcing only partial identity reveals keeps partial accountability (voters can know which general set of people to replace), but allows them to vote against party lines or state lines when needed (i.e. republicans who wanted to impeach Trump could express that without targeted retribution). You could even express arbitrarily complex votes like, "I vote no except in the case that 1/2 of other Democrats say yes, in which case I vote yes". I haven't seen this sort of voting experimented with in practice, and would be curious to see such systems in low-stakes tests (videogames, local orgs) to see if this actually improves governance outcomes.

In order to test such systems with good anonymity, some of the best organizations to start with are Ethereum native: autonomous worlds and DAOs both run on Ethereum accounts, and being able to bootstrap private voting directly from their existing accounts is a really interesting primitive. PLUMEs let you ensure someone isn't voting twice. In addition, it's agnostic to proof systems: a zk proof of their vote itself can allow time-locked voting if you add a VDF, or encrypted voting where a centralized attester sees and collects all votes, or an even more complex system if desired.

### How exactly would one use PLUME to create a private voting system?

The key difference between PLUME and Semaphore lies in the "set" of people one is anonymous in. In Semaphore, the "set" of people is those who sign up. For each new group you want to define, anonymous signaling requires everyone to opt into the system.

However, in PLUME, the "set" of people is anyone who can prove any predicate about account activity on Ethereum. For instance, a PLUME proof can be paired with an axiom proof of having traded 10 ETH on Uniswap, or that you have the NFT of all NFT holders, or even all people who have ever transacted on Ethereum (if you so desired a 400M person anonymity set). This means that even if none of those people have ever opted in or heard of this system, the full anonymity of all people in that set is ensured. This feature of PLUME eliminates the need for any special Semaphore key management apart from Ethereum's wallet, and also means any individual can bootstrap an anonymity set over people that have never heard of PLUME before, nor signed up for anything. This seems like a subtle difference, but actually makes the difference between being able to bootstrap meaningful, novel anonymity systems, and not.

Another benefit is that it stays up to date with the chain. If you make a Semaphore set of NFT holders and someone sells, that set is now out of date. But with PLUME, you can define something like, must have had a Bored Ape on block x and the current block current. So if the anonymity set changes with time, PLUME changes with it, but Semaphore does not because Semaphore forces you to hardcode the group.

With Semaphore, there would be an additional trust assumption on the person making the Merkle tree of valid people in the set and uploading that Merkle root correctly. It can be easily audited on chain, but if that trusted party say, purposefully excluded someone, it's easy to miss that amongst the constant set updates happening as people enter and leave the set.

You can easily pair a PLUME proof with a Semaphore proof, but it's just that you can use Ethereum keys in the Merkle tree instead of Semaphore keys. So there's no real point in using Semaphore with PLUME -- you'd get the worst of both worlds of slow proving of PLUME (for now, until Halo2 is done!) and small Semaphore anonymity sets.

Axiom and PLUME are particularly powerful together. There are two ways to do such a proof: one proof of two proofs. With two proofs, we gain the additional property that the PLUME circuit and verifier don't need to change at all for each new use case!

In the one proof setting, in the circuit, you calculate both proofs, and constrain the now-hidden public key is equal for both proofs. This has the advantage of having a single on-chain verifier.

In the two proof setting, you simply have two different circuits being computed in parallel -- one Axiom, and one PLUME. Both circuits take the same private randomness r, and output both the hash(public key, r), and hash(r) -- these values, on-chain, are then constrained to be equal, thus implying that the hidden public key must be the same. This has the advantage of having faster proof calculation, smaller zkey downloads, and the ability to use the "canonical" PLUME circuits, zkey, and verifier contract unchanged -- making the two systems composable by someone with no ZK knowledge. This has the disadvantage of either requiring two proofs on chain, or requiring a recursive aggregation step before posting on-chain.

## Next steps

So far, we have the [Gupta-Gurkan nullifier paper proving all the security proofs](https://aayushg.com/thesis.pdf); a [repository](https://github.com/zk-nullifier-sig/zk-nullifier-sig/) with the deterministic signature calculation in Rust and Typescript, finished Circom circuits including [hashing to elliptic curves](https://github.com/geometryresearch/secp256k1_hash_to_curve/), and a [Metamask snap](https://ethglobal.com/showcase/zk-nullifier-snap-6a9sq) to compute nullifiers. We have had one audit on the codebase, and have open PRs open to Taho Wallet and Metamask, and one almost finished for Ledger.

The spec is formalized in ERC-7524, and hope it can be used for private voting apps. We have already had one audit on the codebase. We are actively working on integrations into Taho Wallet, Aztec Noir, and Ledger to start gaining traction. We have an open PR into Metamask ([1](https://github.com/MetaMask/eth-json-rpc-middleware/pull/198), [2](https://github.com/MetaMask/api-specs/pull/120), [3](https://github.com/MetaMask/metamask-extension/pull/17482)), and plan to push the nullifier calculation into [burner wallets](https://github.com/austintgriffith/burner-wallet), [Ledger core](https://github.com/LedgerHQ/app-ethereum), and [Metamask core](https://github.com/MetaMask/metamask-extension). We also want to try benchmarking the proof in different languages like Halo2 or Nova that might be faster (for instance, by using lookups for SHA-256). If you’re interested in helping out or using the scheme for your project, reach out to [@yush_g](https://twitter.com/yush_g/) on Twitter for a grant! Thank you to Kobi for coming up with the scheme and coauthoring the paper with me, 0xPARC for brainstorming the scheme with me, Vivek for writing the proofs with me and making helpful suggestions for this post, Richard for contributing a ton of JS code for wallet integrations, Blake and Weijie for doing the circom ZK circuits, Lily Jordan for editing this post, PSE and Andy for helping to arrange an audit this scheme, and all of the teams who looked at and used this for the Nouns private voting contest!

## Appendix

### The interactivity-quantum secrecy tradeoff

In the far future, once quantum computers can break ECDSA keypair security, most Ethereum keypairs will be broken. This doesn't mean quantum will necessarily cause everyone to lose their funds: we can migrate to a more quantum-resistant signature scheme (or even just a higher-bit version of ECDSA) in advance by having everyone sign messages committing to new keypairs under the new scheme and forking the canonical chain to make those new keypairs valid. zkSNARKs become forgeable, but secret data in past proofs remains secret. In the best case, the chain should be able to continue without a hitch.

However, the anonymity guarantee of deterministic nullifiers _will_ break: an adversary can derive the secret keys for the whole anonymity set and thus derive all the nullifiers. This problem will exist for any deterministic nullifier algorithm on ECDSA, since revealing the secret key reveals the only source of hidden information that guarantees anonymity in a deterministic protocol.

![quantum_tradeoff](../../media/plume_tradeoff.png)

If you want post-quantum anonymity, you have to give up at least one of our properties: uniqueness, determinism, verifiability, or non-interactivity. If you give up uniqueness, determinism, or verifiability, you defeat the point of having a nullifier in the first place, so the only real option is non-interactivity, in the style of Tornado or zCash. For example, for the zero-knowledge airdrop, each account in the anonymity set publicly signs a commitment to a new [semaphore ID commitment](https://semaphore.appliedzkp.org/docs/introduction): if your public key is `pk`, you publish `hash[randomness | external nullifier | pk]`. Then to claim the airdrop, you reveal your external nullifier and give a ZK proof that it came from one of the semaphore IDs in the anonymity set. But this considerably shrinks the anonymity set to everyone who opted in to a semaphore commitment before you claimed.

As a result, a semaphore system needs a separate signup phase where people commit to semaphore identities (which are then used as their nullifiers) in order to enter the anonymity set. This opt-in interactivity requirement makes many applications with large anonymity sets much harder. However, since hashes (as far as we currently know) are still hard with quantum computers, it’s unlikely that an adversary will be able to ever de-anonymize you.

There is an [alternative](https://zkresear.ch/t/how-quantum-computers-affect-zk-and-blockchains-how-to-quantum-proof-ethereum/59/2), but it will only work for accounts that don't have transactions yet, and requires users to start keeping their public keys secret. Even if nullifiers are used post-quantum, you can avoid being identified by your nullifier as long as your public key is not revealed; you can instead reveal only your address, which is `hash(public_key)[0:40]`. Normally, you would reveal your public key when you sign transactions or messages. An alternative that would keep public keys concealed is an account abstraction system where users send Ethereum transactions such that all transactions are "signed" with ZK proofs of signature corresponding to the publicly known address, and all messages are "signed" with ZK proofs of knowledge of signature corresponding to some address. Then users could keep their public keys private as well, and thus keep both their funds and their anonymity safe even with the advent of quantum computers, for the same reason that [UTXOs](https://en.wikipedia.org/wiki/Unspent_transaction_output) on Bitcoin and accounts with no transactions or signatures on Ethereum are usually quantum-safe. We would have to rework some nomenclature so people didn't reveal their "public keys", but eventually we will have to do this anyway to deal with quantum computers.

To get a better estimate of how long quantum computers might actually take to break the anonymity of nullifiers, a [recent approximation](https://eprint.iacr.org/) of $9n$ signal qubits needed to solve discrete log on quantum computers shows that we are likely several decades till discrete log is even theoretically in reach, primarily because the noise problem has not been corrected for yet. (For a more complete model of how quantum affects blockchains, check out my overview post [here](https://zkresear.ch/t/how-quantum-computers-affect-zk-and-blockchains-how-to-quantum-proof-ethereum/59)).

If you want to use nullifiers, this knowledge should inform the point you choose on the interactivity-quantum secrecy tradeoff curve, but ultimately, it also depends on your use case. People who care more about large anonymity sets in the short term, like DAO voters or young people making confessions that won't matter when they’re older, might prefer the nullifier construction outlined in this post, but people who need secrecy in the long term, like whistleblowers or journalists, might want to consider a semaphore construction like Tornado's instead.

### Why Use secp256k1_XMD:SHA-256_SSWU_RO_ for Hash To Curve?

This hash to curve function is about half a million constraints. Why not use a cheaper function like a zk-friendly hashing function directly, which seems like it would save a bunch of constraints? The main reason is the domain and range of the hash function. The whole difficulty of hashing to a curve is that only some of the points between 1 and p are even on the curve. So when you hash the input, there's some probability p that you produced a point on the curve. If you didn't, then you have to hash again. If p was like 99%, we would be OK. Unfortunately, p is about 50% -- here's why. The prime field that secp256k1 is on has $p = 2^256−2^32−977$ points. The order of the curve (number of points on the curve) is $n = 115792089237316195423570985008687907852837564279074904382605163141518161494337$. The problem is that this includes y positive and negative (as well as 0, hence n is odd), so the number of unique x coordinates on this curve is half that. So the proportion of points on the curve is about $\frac{\frac{n + 1}{2}}{p}$, which is about 50%.

Thus, in expectation, let's say you want to be able to support anonymity sets up to the size of the world. Then, the expected value of the number of times someone might have to hash would be about $\log_2{10^10}$, or 33. If we want a say 99.9% guarantee that our protocol is secure, we need need $maxf$ flips of the hash function in the zk circuit such that P(# of flips till head < maxf for $10^10$ trials) > $99.9\%$. To calculate this, we calculate the probability that every trial avoids the failure case of flipping tails for all $maxf$ flips, which is basically that, for $t = 10^10$, we need to calculate the smallest $maxf$ so that $(1 - 0.5 ^ {maxf}) ^ t > 0.999$. $maxf$ ends up being 44 for the 99.9% probability, and 50 for 99.999% probability. With Poseidon at [300 constraints](https://zkrepl.dev), this winds up being only 15,000 constraints for the hashing alone.

However, we would also need to prove that all the runs until the chosen nonce, are all not on the curve. Thus, would have to prove that the calculated hash value (after a cube and addition) is not a quadratic residue mod the field prime. To calculate that, we would [need to](https://en.wikipedia.org/wiki/Legendre_symbol#Definition) exponentiate the value to $((p - 1) / 2)$, which would take 7 repeated squarings (potentially a little less with speedups like Pippengers algorithm). This is in the wrong field for groth16, and such exponentiations are extremely expensive (far more than the 500K needed for regular hash to curve). Due to this overhead, iterative hashing is not practical as a replacement for hash to curve. However, if we could use any native field in a different proving system like Spartan, this approach may work.

In addition, just using the direct output of Poseidon for hashing m and pk could lead to a vulnerability in ECDSA. Because we would know the pre-image of the final curve exponentiation, we would be able to generate a fake normal ECDSA signature for an arbitrary message. Basically, using the [terminology of ECDSA Wikipedia](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm#Signature_generation_algorithm), we would know a valid k corresponding to some r (r in this case would be hash(m, pk)), for which we would receive back a PLUME signature that we could use as the last term in the ECDSA signature, add any message hash(m) to, then multiply by $k^{-1}$, hence creating an arbitrary ECDSA signing oracle from just one PLUME signature -- this would be quite bad. Thus, we must use a hash function for which the final step is not a curve exponentiation -- Poseidon is particularly bad here but other hash functions may be OK.

Note that if you have a map_to_curve after the hash, it will not have this problem. For instance, we used simplified SWU because it works on secp256k1 [as Geometry explains](https://geometry.xyz/notebook/Hashing-to-the-secp256k1-Elliptic-Curve#the-hashtocurve-algorithm) to prove map-to-curve faster than normal map to curve algorithms within a ZK proof, and Mina has a prototype of an [unsimplified map-to-curve](https://github.com/o1-labs/snarky/blob/78e0d952518f75b5382f6d735adb24eef7a0fa90/group_map/group_map.ml) from the original paper SvdW06. While we expect this to be secure, it isn't optimized speed-wise for client-side proving yet.

Our default implementation defaults to SHA256 over newer ZK friendly hash functions primarily due to hardware wallet speed, verification cost, and lindiness. We recommend against zk-friendly hash functions like Poseidon because on hardware like Ledger, Poseidon would likely be about ~30x slower (~15s) than Keccak/SHA256 (~400ms), and a massive UI barrier for users on this limited execution environment. If you ever want to verify on an L1 where execution gas is a concern, the V2 of the PLUME signature needs to run the hash function for c on-chain, so the SHA256 precompile makes that much faster. In addition, SHA256 is more lindy (has had 20 years to be broken) vs Poseidon (closer to 5 years in production) -- depending on your need for speed, this is a risk-reward trade-off that protocols are free to make themselves.

### Why use SHA256 as the hash function?

We had considered a number of hash functions here, including Poseidon, SHA512, and SHA256. We selected SHA256 because the V2 of the prover-optimized PLUME spec moves that hash into the on-chain part of verification, and the SHA256 precompile makes that specific hash much more efficient.

In addition, Poseidon is much harder to optimize within the Ledger environment than already built-in and optimized functions like SHA256.

### Why is there a V1 and a V2?

The main difference is that the V1 has the sha256 hash verified within the ZK proof. The v2 has it verified on-chain as part of the verifier instead.

V1 is useful on chains without sha precompiles or future proving systems with fast proofs i.e. hypernova based systems where prover cost is negligible.

V2 is useful on chains with sha precompiles where proving speed matters (i.e. in browser applications with 2023 proving tech).

It turns out that we probably can edit the V1 spec to include the minimized V2 nullifier calculation, but we need to think about that.

## More Links

Learn more from Blake's post on [ZK-ECDSA with PLUME nullifiers](https://mirror.xyz/privacy-scaling-explorations.eth/djxf2g9VzUcss1e-gWIL2DSRD4stWggtTOcgsv1RlxY).

Check out a concrete proposal for a ZK voting scheme with PLUME at [the ZKSnap whitepaper](https://linktr.ee/zksnap).
