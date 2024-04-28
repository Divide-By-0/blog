---
title: "Thinking in Zero Knowledge: Designing a ZK Message Board"
date: 2022-01-12T22:12:03.284Z
authors: ["yush_g, nulven"]
type: posts
draft: false
slug: "zkmessage"
category: "30 min read"
tags: ["crypto", "zk"]
description: "The first (that we know) message board with anonymous posting in ZK, and a socratic dialogue to build it up."
aliases:
  - /posts/zkmessage
  - /zkmessage
---

Originally posted on [Mirror](https://mirror.xyz/0x3FD6f213ae1B8a7B6bd8f14BE9BF316a5e5A5d28/VTGpmEYLKIslUPf66VQzHUneB0R7EhMpJJ_mGrMvTwY).

## Motivation/Why ZK

Zero knowledge proofs are a [powerful cryptographic primitive](https://twitter.com/VitalikButerin/status/1433228277263462401), often used for proving pre-images of hashes (see [zkga.me](https://zkga.me)) or anonymizing transactions (see [zcash](z.cash)). We envision (and will interactively lead you through) an on-chain application that allows anyone to feel safe expressing their truth, like a persecuted journalist, congress member, or a disgruntled employee. Imagine an application where they could anonymously post on behalf of a verified group -- whether journalists are reporting without censorship, students of a university posting anonymous quips, congress members voting anonymously, or employees of a company are reporting harassment. This type of social media is [ripe for crypto](https://youtu.be/oLsb7clrXMQ?t=1141) innovation, and this is a great start!

For this to happen in a credibly neutral way (see [Vitalik’s definition](https://nakamoto.com/credible-neutrality/)), crypto-native code is a natural method by which all the code can be public and a member can feel completely safe in their anonymity. ZK-snarks (and starks, and newer gadgets) allow zero knowledge proofs that prove anonymity to verify in solidity on chain. For this construction, we need to engineer two functions: to prove group membership on chain, and to post on behalf of that group. We’ll give a naive way, and then attack each one individually -- showing why ZK is needed, and how one could properly execute such a scheme. The hope of this post is to inspire you all to engineer your own ZK protocols, by thinking like a true snarkoor -- and avoid the most common pitfalls.

Note that after this implementation, there were some great new off-chain constructions like [zkmessage.xyz](http://zkmessage.xyz) that provide some pretty cool new features (it’s a very [elegant construction](https://github.com/0xPARC/zkmessage.xyz) as well!) -- if you are inspired by this post, making this protocol on-chain seems like an awesome challenge (and feel free to reach out to them/me for more info!) :)


## The First Construction

Let’s assume there is an off-chain group we want to anonymously replicate on chain. Companies or groups can share a password between them, but have no public connection from that to their identities or wallets. We present a simple scheme, the most naive such implementation that minimally implements both steps on chain without any anonymity or security. 

**Join**: A smart contract stores the hash(hash(password)). You send the hash(password), with a public key. That public key is added to an allowlist for message sending.

**Send**: In future, can send a signed message with any allowlisted public key.

I recommend pausing for a moment and trying to think of all the security properties this breaks, before reading the three answers. In general, this will be a good way to read the post and fully convince yourself of the need for each building block of machinery.

<div class="spoiler">
Anyone can frontrun or resend a previously sent hash(password) with their own public key, and join a group.
</br> </br>
This reveals the public key of the sender: when joining the group, when sending each transaction, and when verifying the signature on the message! 
</br> </br>
The first few messages sent have a small anonymity set on chain, even if the whole group is large.
</div>

Traditionally in crypto, revealing a public key has been desirable -- however, we prioritize privacy and want anonymity for more general functions than just [sending money](https://z.cash).

To make explicit our goals, we define these properties:

**Actions**: Users can create groups, join them, and post from them.

**Security properties**: Groups are permissioned by password, users anonymously join, messages cannot be traced back to a user, and messages cannot be forged.


## Proving Group Membership On Chain

How do you properly show that your private/public key belongs to a group? Let’s try a natural extension of our original idea, each time attempting to fix one of the issues. At the end, we will have the needed complexity (fans of Gall’s law will recognize this, where we build the minimally complex system from simpler systems that don’t fully work).

Let’s start with the simple contract idea, and discuss how to verify the password to allow users to join an allowlist.


## Password security


### Password idea 1

Recall our naive construction, a smart contract where you send the hash(password) and your public key, to be added to an allowlist on-chain.

Check if you recall the problems with this part before moving on!

<div class="spoiler">
You prove you have the password and are part of the group, but you lose the uniqueness (anyone can send the hash(password)) and the privacy. Oof. 
</div>

Let’s focus on the reusable password problem first, then we can handle the public keys. One simple way to solve this is to have many one-time-use passwords.


### Password idea 2

Additionally send a nonce -- in this case, a unique password per user. As before, send hash(password). Smart contract verifies it matches anyone in the preset list of hash(hash(password))s, then adds your public key to the allowlist as before.

This is almost exactly what we want, and we made our implementation with this, but there are a few subtle improvements still.

<div class="spoiler">
This adds an inherent max group size (because there is a finite number of passwords), which in some cases may be the desired design. When there are few allowlisted users, users who send a second message can be associated with their past messages (recall that messages are sent with allowlisted public keys only)! This can be desirable (and is why we implement the protocol off of this), but in case we want complete dissociation from the start, let’s search a little more.
</div>

An astute blockchain enthusiast may have noticed this unique nonce can still be frontrun.This is resolved via commit-reveal*, but turns out the final construction doesn't suffer from this, and we elaborate on this at the end. 

* We can use a standard commit reveal along with this scheme to avoid frontrunning -- the same scheme ENS uses (also a Lamport one-time signature scheme, and Blockstack). Basically, you publish the hash of this transaction x blocks in advance, and then their actual message will only go through if there is a commit to it already at least x blocks beforehand. As long as the transaction doesn’t linger in the mempool too long, this will mean attackers have to wait for x blocks. Turns out if you couple the join and post steps cleverly, we don’t actually need this!

Assuming this is resolved as mentioned, let’s address the multiple password issue first.


### Password idea 3

Back to one group password. Each user concatenates a nonce (message number, corresponding to the number of messages sent by anyone in that group prior), and proves it is part of a merkle tree of say 1M hash(password | nonce)s (by sending ~13 hashes in total), which the smart contract verifies with the root. We will redo this for each message sent.

Note this merkle tree limits the number of total messages, but since merkle tree widths vary exponentially with heights, we can easily add a few more 0s to the number of possible nonces. There’s a particularly devious problem with this solution, relating to the merkle proofs.

<div class="spoiler">
If the nonces are consecutive, you might give away the next nonce’s hash in the process of proving the previous message! This is because proving a route up a merkle tree involves showing you know the hash of all the neighbors at each level. Users need to prove they knew the pre-image of the hash... **
</div>

** Note that one could alternatively just block off every alternate node in the merkle tree, and make the even nonces necessary in proofs but invalid for messages. This works, but still boils down to proving the pre-image of a hash (in this case by just sending it).

Folks familiar with ZK will realize the problem of proving a pre-image is canonical, and we try exactly that.


### Password idea 4

One group password. Each user concatenates a nonce (message number), and a merkle path of a merkle tree of say 1M hash(password | nonce)s (by sending ~20 hashes in total). They also send a zk proof that they know the pre-image of the hash.

This works! The group on creation starts with the merkle root of the hash(password | nonce)s. 

We can do a bit better though (probably not worth implementing, but an interesting theoretical exercise) -- this has one point of failure: the entire system depending on one shared password that might get leaked. Can we have a system of individual passwords that allows reuse, without replay attacks?


### Password idea 5

Individual passwords. The contract has all the merkle roots of each hash(password | nonce) for each password and nonce. We send a message nonce based on the number of messages sent from each user so far, and a zk-proof that we know the pre-image, and the merkle root of a claimed merkle path of (password | nonce) is one of the allowed merkle roots in the contract.

One might ask what such a zk proof would look like.† For instance, if there are 26 allowlisted merkle root a...z as public inputs to the circuit, we can send a proof that our generated merkle root, say x, satisfies (a-x)(b-x)(c-x)... == 0. One of these will be (x-x), and the proof will pass.

Multiple points of failure might encourage anonymous password leaking, which we discuss in the appendix being resolved with staking.***

*** Staking: To discourage password leaking, we can have each password user stake money, and if an attacker knows a leaked password, they can tell the contract and receive the stake in exchange for deleting that merkle root. Assuming this amount is more than the value an attacker gains from an unfavorable post, this system is incentivized to be more secure against password leaks (on the social layer, not tech layer).


## Public key security

Now that we’ve resolved the password leaking issues, we still have the public key leaking issues to fix. We assume using password idea 2 in the following experiments to simplify the logic.


### Public key idea 1

Recall this from our original idea. On authentication, a smart contract stores all the public keys, where you send the transaction from that public key.

Recall the issues mentioned before.

<div class="spoiler">
Well this defeats the purpose, you don't want to share your public key. It gets compromised twice here, in the contract and the sending address. Three times if you seed the contract with the public keys, since then the contract creator also knows them.
</div>

Let’s focus on the contract address verification step first.


### Public key idea 2

A smart contract stores hashes of all the allowlisted public keys. A message sender sends a zk proof that they know the preimage of any public key.

<div class="spoiler">
It is actually possible to find the preimages of the public key hashes; the anonymity set of all eth public keys is only 345M. As a result, making hashes public can be reverse engineered.
</div>

One could imagine using random keypairs and not eth addresses, but there are desirable properties to using an ETH address, such as checking if they own some NFT as a gate to joining the group -- also, we want to be antifragile to client choices such as key reuse.


### Public key idea 3

A smart contract with all hash(public keys | salt), and prove you know a preimage of the public key and some salt.

<div class="spoiler">
Contract anonymity fixed, but we are still sending as that public key! Let’s focus on that, and forget the message for a moment.
</div>


### Public key idea 4

A smart contract with a list of all of the hash(public key | salt)s, sent via a relayer with zk proof of a preimage of the public key and some salt. 

For a relayer, we can use GSN, or tornado.cash/zcash + GSN! But there is an unintended consequence...

<div class="spoiler">
The issue is that you could choose any public key that’s not yours then, and add them to the group. While this would still require them knowing the password to utilize, it still seems like an undesirable property. One could imagine signing with a private key instead, but we don’t want to reveal the public key to verify it.
</div>


### Public key idea 5

A smart contract with a list of all of the hash(public key | salt), sent via a relayer with zk proof of a preimage of the public key and some salt, that ALSO proves the private key generates the public key. Attach message.

Solves anonymity of the sender! One issue...

<div class="spoiler">
The message can be frontrun + forged. We can’t directly sign the message, but we have one last zk trick up our sleeves...
</div>


### Public key idea 6

Send hash(public key | salt) but add one ZK proof that you know the public key, and some salt, that hash to any allowlisted value, AND verify a sign(message) from your private key. As before, sent via a relayer. 

Works! This can be used to link messages across one anonymous user if desired. The group on creation now has a bunch of hash(public key | password)s stored (or we can send password verification schemes with each message), kind of like an invite key system. 


## Full Constructions

We’ve done all the dirty work. Now, we just have to put it all together!


### Full construction 1

**Create step**: The group creator adds a bunch of hash(hash(password))s to a contract.

**Join step**: Use a zk proof with the password scheme to verify a password, and add hash(public key | salt) to an allowlist.

**Post step**: A ZK proof shows that you know a public key (and some salt) that hashes to a value on the allowlist, AND verify sign(message) from your private key. Also, attach the message. As before, sent via a relayer.

To see the exact zk proof input and outputs, see the [zk proof section below](#protocol). This protocol means a user must have a new password for each message, but can opt to link their message to a previous instance of a user. We implement this password scheme idea in our repository. To resolve frontrunning, a production instance could simply add commit-reveal* or verify the salt is a password.


### Full construction 2

**Create step**: The group creator adds a bunch of merkle roots of hash(password | nonce)s.

**Join step**: Send a zk proof with the password scheme that proves a merkle root, and hash(public key | password salt) uses the same password. The hash(public key | password salt) to an allowlist.

**Post step**: A ZK proof shows that you know the public key (and the password salt) that hash to any one allowlisted value, AND verify sign(message) from your private key. Also attach message. As before, sent via a relayer.

This works even better, removing the need for unique passwords and making frontrunning impossible, since the original password is never revealed but needs to be known. This also enables linking to past messages, if one opts to make hash(public key | password salt) a public input to the circuit instead.

	


## Protocol

To prove this could actually be done, we build a general purpose client and set of circom circuits/solidity contracts that implements all the logic from the first construction, and works in seconds on chain. It is at [https://github.com/nulven/zk-message-board](https://github.com/nulven/zk-message-board).

This is what our primary joining zk proof looks like:

**Private inputs**
&emsp;Password (= salt)
&emsp;Private key
**Public inputs**
&emsp;Our hash(public key | salt)
**Main proof constraints**
&emsp;Private key generates public key
&emsp;Hash of public key and salt generates the public hash

This is what our primary message zk proof looks like:

**Private inputs**
&emsp;Password (= salt)
&emsp;Private key
&emsp;Public key | salt
&emsp;sign(message)
**Public inputs**
&emsp;Message nonce
&emsp;Message
&emsp;All allowed hash(public key | salts)
**Main proof constraints**
&emsp;sign(message) is correct
&emsp;public key | salt allowed

If trying to avoid front running, one would tack on ‘verify password is valid’ to the last proof’s constraints.

## Extensions

It is almost easy to extend the given constructions for several more situations. Want to recreate Signal, but where the data, server, and client layers are permissionless and public? Just encrypt each message one more time with a group’s “password” -- now you have private group chats! Want to obliviate the need for passwords in the first place? Any mathematically verifiable function will do in place of it (say, a specific property of a specially generated API key). Want connections from web2 groups to these? Using [InterRep](https://jaygraber.medium.com/introducing-interrep-255d3f56682) for early proof of concepts like verified Twitter badges is also an exciting way to move group communications onto web3. Worried about gas? Use the [xdai sidechain](https://newsletter.banklesshq.com/p/an-intro-to-xdai-ethereums-sister) or an EVM-compatible rollup/L2 until fees are low. We’re excited to help anyone who wants to build such an extension -- we think these are truly novel constructions.


## Implications

Privacy is a difficult topic to meander -- any solution that shields users from government backdoors enables scammers, criminals, and covert communication. Given that end to end security already exists, we are not worried about the additional implications of releasing this technology; this is simply a credibly neutral version of tech already provided by trusted third parties.
