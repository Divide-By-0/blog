---
title: "Cheap, Anonymous Vickrey Auctions on-chain"
date: 2022-11-15T22:12:03.284Z
authors: ["yush_g"]
type: posts
draft: false
slug: "vickrey"
category: "15 min read"
tags: ["crypto"]
description: "A writeup of the EthBogota hackathon project that me, real_philogy, and out.eth put together"
---

## Intro to [vickrey.xyz](https://vickrey.xyz)

Thanks to an idea from [@0xngmi](https://twitter.com/0xngmi), a team of [@real_philogy](https://twitter.com/real_philogy), [@outdoteth](https://twitter.com/outdoteth), and [me](https://twitter.com/yush_g) recently prototyped the first [maximally private Vickrey auctions on-chain](https://vickrey.xyz) [[repo here](https://github.com/Philogy/create2-vickrey-contracts)] (also shoutout to [@0x_Beans](https://twitter.com/0x_Beans) and [@rauchp\_](https://twitter.com/rauchp_) for some additional analysis and help). Unlike past implementations of Vickrey auctions on-chain, [vickrey.xyz](https://vickrey.xyz) leverages uninitialized CREATE2 addresses to not only conceal the size of bids, but their existence (more precisely, their association). This is unlike existing implementations, which only hide the amount, but disclose the other bidders’ identities and their maximum possible bids. Properly concealing bidders is crucial to prevent participants from gaming the system and circumventing the auction design’s benefits, which come from the idea that the winner pays the second highest price.

Unlike typical ascending, first price auctions (aka English auctions) whereby participants publicly bid up the price until no one is willing to pay more, second price auctions (aka Vickrey auctions) are proven in theoretical game theory to be optimal. The bidders are incentivized to bid honestly, and the seller obtains optimal price discovery for their asset. Precisely, in a Vickrey auction, the highest bidder still wins, but pays the second highest bid, not their own. Intuitively, it also makes sense -- from the perspective of a participant who wins a first price auction, they’ll be kicking themselves for not just bidding the second price + 1 cent, and so will want to bid lower in the future -- the Vickrey auction would resolve any such anxiety. Practically, many of the largest auctions right now i.e. Google ads and eBay use this mechanism.

There have been many suboptimal implementations of on-chain Vickrey auctions using ZK or just hashing (i.e. you send hash(bid) to a contract and ideally zk prove you have a valid bid). To understand why these approaches are suboptimal, it’s important to understand what properties we need in such an auction to actually benefit from the game theoretical advantages. We need 1) secret bids and 2) private participation. If people knew the bids, then later participants would have more information than earlier participants, so everyone would be incentivized to wait till the last second. It doesn’t actually change the game theoretical optimality of Vickrey auctions, since even if bids are public, you are incentivized to bid optimally. More importantly, we want private participation as well: merely knowing who is participating allows you to collude off-chain to lower the final price. Even without collusion, bidders could look at the balances in bidders' accounts and thus know other bidders’ maximum possible bid, thus know a minimum bid amount to be sure to win. While ZK neatly solves secret bids, it totally fails at private participation -- by looking at everyone who sent a valid ZK proof, you immediately know who is participating.

Our trick to simultaneously solve both issues is cleverly utilizing the create2 opcode. Instead of sending shielded money to a contract, users send it to an _**uninitialized create2 address**_. This allows bids to blend in with every other transfer on chain to an empty account. Since the hackathon, we've cleaned and tested the contracts, and implemented full slashing logic for auctions on Goerli. We highly recommend folks experiment with [our application](https://vickrey.xyz) if they can!

## How does it work?

An auctioneer declares they are selling their asset on chain, thus calling a factory contract to initialize a new auction contract and kick off a bidding period followed by a reveal period.

During the bid period, bidders send their bid in eth/erc20 to the address create2_hash(auction contract address, hash[actual bid, salt], our bid contract bytecode hash), without actually initializing the contract there. Since the salt can be arbitrarily complex, it’s impossible to brute force or reverse engineer that this is a bid, since it just looks like an EOA (account) transfer. Therefore, each bid blends in with every other EOA transfer on chain to an empty account, along with every other bid in any other auction for any other asset.

![bid_period](../../media/vickreyslide_1.png)

To kickoff the reveal period, anyone can call the contract at the preset block to store the most recent blockhash. This can be the auction creator, an MEV searcher (the payout to call this function is more than the gas cost), or a bidder. Then, bidders have a set amount of time (currently 24 hours) to send in their bid amount and salt to their selected auction contract. The auction contract initializes the create2 contract, finds the bid money there, and calls the only function on the newly deployed contract to withdraw it and consider the bid. The auction contract then updates the info about the first and second price bids.

![reveal_period](../../media/vickreyslide_2.png)

Note that this is almost exactly correct, but there is one issue: if someone bid after the reveal period began once some bids had been revealed, then reveals right after, they would have more information, and nothing in the previous checks would preclude such a delay. Thus, we need some way to verify that the money was sent to the bid contract before the reveal period started. This is where the snapshotted reveal period block hash comes in handy: this blockhash encodes the root of the Ethereum storage trie at that point in time. Thus, during the reveal, users also need to send a Merkle Patricia tree proof in Ethereum of the balance of their create2 address during the snapshotted block hash, which the contract then verifies before allowing a bid to be counted or refunded.

![mpt_proof](../../media/vickreyslide_3.png)

Finally, the reveal period ends. To kickoff the withdraw phase (which never ends), the contract has the winning bidder pay the second price and transfers them the asset, and refunds all the remaining money sans gas needed to refund the person who triggered the reveal period start.

![late_reveal](../../media/vickreyslide_4.png)

If someone late-reveals now or anytime in the future, they are penalized accordingly, and the first and second price so far are updated accordingly to include these bid amounts. Late-revealed bids under the second price are fully refunded sans gas + a small constant penalty, since they don’t affect the auction. Bids that would have been the second price have to pay the difference between them and the current second price to the auctioneer, and are refunded the rest. Bids that would have been the first price have to pay the difference between the current first price and current second price to the auctioneer, and are further slashed a majority of their funds (which either can go to charity or to the original auction factory contract protocol). This is to prevent the auctioneer themselves from artificially driving up bids via placing high fake bids. Note that it is within the auction design space that the auctioneer can place bids of their own revealed during the reveal period, the highest of which effectively functions as a “floor bid”.

## Does this scheme actually increase anonymity?

This design begs the question, how many EOA transfers actually are there at any moment, and thus how much anonymity does this scheme actually add? This auction fails when the anonymity set is too small (not enough transfers being made to EOAs where it is easy to differentiate between a bid and a regular transfer). Below we have graphed the amount of transfers to new EOAs over a 10,000 block period (~33 hours).
![late_reveal](../../media/transfersveth.png)

We can see even for the most expensive auctions that we typically see on ETH (Nouns auctions going from 40-60 eth), the anonymity is large enough to confidently hide bids. We typically see ~15 ‘real’ bids at most for Nouns, of which can be very hard to detect if they were plan transfers.

As the price for auction items become less, it becomes virtually impossible to differentiate between bids and transfers.

## What are the advantages/drawbacks of the scheme?

### Advantage: No Frontrunning

Maker vault bids for instance, have a generalized frontrunning problem (“Unfortunately, we found no great way to prevent generalized front-running that preserves single-block composability.”) Because this scheme looks like EOA transfers, there is no frontrunning.

### Advantage: Better Prices

Because the gas cost will usually be very small in comparison to the price of the asset, it is usually quite close to the optimal Vickrey-Clarke-Groves mechanism. In addition, gas cost in this scheme is much cheaper than i.e. zero knowledge based schemes because people do not have to execute a 300K-400K gas pairing operation on chain, which becomes prohibitively expensive for many auctions.

### Disadvantage: Bidders or Auctioneers Pay Gas

Unlike OpenSea which operates as a centralized off-chain signature store, the bidding parties have to pay gas in order to place bids -- this ensures the mechanism can function fully on-chain, but may de-incentivize bids due to gas cost. We expect this to matter less over time as sharding comes online or vault liquidations occur on much cheaper rollups. One can also mitigate this cost fully by refunding all bidders their base gas fees, by subtracting this from the winning bid (cannot include the priority gas fee or else someone could drain the entire bid), which would be a reasonable design choice for some auctions (i.e. vault liquidations would likely prefer this scheme). These are the gas costs:

| Function     | Gas Cost |
| ------------ | -------- |
| pendingPulls | 588      |
| reveal       | 79033    |
| sendBid      | 377      |
| startReveal  | 23671    |
| topBid       | 427      |
| topBidder    | 350      |

<!-- <div style="text-align: center;">
{{.Inner}}
</div>
<div style="text-align: center;">
| Function     | Gas Cost |
| ------------ | -------- |
| pendingPulls | 588      |
| reveal       | 79033    |
| sendBid      | 377      |
| startReveal  | 23671    |
| topBid       | 427      |
| topBidder    | 350      |
</div>
<table>
    <tr>
        <td>Foo</td>
    </tr>
</table> -->

### Disadvantage: No single block composability

Maker explicitly designs systems for bots, in which smart contracts can bid on an auction, reveal in the same step, and if they win, sell it all atomically. Because we disallow atomic arb, deployment may actually result in botted sales going down.

## What else can you do with create2?

If you think a bit about what specifically create2 adds here, you quickly realize that we unlock a new property on chain: _anonymous transfers until claimed_. One interesting use case for this is a better ConstitutionDAO: specifically, a system in which people donate to a DAO but no one knows the DAO balance until they want to reveal it. People send money to create2(dao address, random salt, withdraw bytecode). Then, the DAO has published a general purpose encryption key such as an ed25519 key. People encrypt their create2 salt with that encryption key, so only the DAO contract creator can read the salt and know that they can withdraw that money once the auction ends. This begs the question: why couldn’t the donor just send the funds to a random address and encrypt the secret key to the DAO in the same way? Because in that case, they would always be able to withdraw it themselves before the DAO has noticed -- the funds are not actually committed.

This construction also has interesting usecases for state channels, around which an entire blog post will be coming soon along with a general purpose library (stay tuned at [@real_philogy](https://twitter.com/real_philogy)), and replaces entire complex protocols like Umbra or [Boneh’s private DAO](https://hackmd.io/nCASdhqVQNWwMhpTmKpnKQ).

## I want more!

If you're excited about using these auctions or chatting more, reach out to us on Twitter! We are [@yush_g](https://twitter.com/yush_g), [@real_philogy](https://twitter.com/real_philogy), [@outdoteth](https://twitter.com/outdoteth), [@0x_Beans](https://twitter.com/0x_Beans), and [@rauchp\_](https://twitter.com/rauchp_). If you need some Goerli eth or Goerli NFTs to try [the app](https://vickrey.xyz) out, let us know and we can send you some :)

Kudos to [@13yearoldvc](https://twitter.com/13yearoldvc) for bringing us together for this kickass project :)
