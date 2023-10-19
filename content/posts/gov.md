---
title: "On Regulation and Crypto"
date: 2023-09-05T22:12:03.284Z
type: posts
draft: true
slug: "gov"
category: "15 min read"
tags: ["crypto"]
description: "My opinions on the state of the government in crypto, how I think about regulatory compliance, and building tech that may be banned by governments."
aliases:
  - /posts/gov
  - /gov
---

As governments become increasingly skeptical of and take action against crypto, I think it's important to lay out a path forwards for how one might remain optimistic about the space. My opinions on the state of the government in crypto, how I think about how crypto can work with governments in ways that do not undermine the ideals nor insert backdoors, and building tech that may be banned by governments. Note that I am not an expert, this is mostly distilling information from conversations with people much smarter than I. A kudos to WIRED's consistent commitment to convey the truth about relevant initiatives and governmental overreach to the public -- it was hard to find reputable sources elsewhere about these topics.

Past Interactions with Government
- The NSA is notorious for spending millions (maybe billions) of dollars [tapping phone lines](https://www.google.com/search?q=wired.com+phone+line+tap+jail+nsa) and [refusing to defend those who do not comply](https://www.wired.com/2007/11/feds-invoke-sec/), and inserting [backdoors into PRNGs](https://www.wired.com/2007/11/securitymatters-1115/) including NIST standards. There is also dubiousness over the "random" pre-image selected for the SHA1 parameter generation of the P256 curve by the NSA recommended by NIST, elaborated on in [SO](https://crypto.stackexchange.com/questions/10263/should-we-trust-the-nist-recommended-ecc-parameters) and [SafeCurves](https://safecurves.cr.yp.to/). Finally, it's likely that it is well within government capacity to [read basically all TLS1.2 communications](https://cacm.acm.org/magazines/2019/1/233522-technical-perspective-attacking-cryptographic-key-exchange-with-precomputation/abstract). [LogJam](https://dl.acm.org/doi/10.1145/3292035) showed that the NSA has likely broken small-group cryptography in TLS 1.2 and can read about 8.4% of all Alexa Top 1M sites' data, and this is consistent with the VPNs that the NSA has previously hacked.
- The moral question of whether stronger cryptography is more important, or national security is more important is filled with nuance. Most arguments for the former seem a bit idealistic to me -- you cannot just turn a blind eye to problematic users or content on your platform in the name of decentralization, and you still want to avoid extremely morally bad things from happening if you can. Most arguments for the latter (trusting the government) also seem a bit idealistic on the government's role -- we've seen concrete evidence of governments pushing for backdoors in cryptography, or a complete discarding of privacy in favor of delegating decision making power to the government. As usual, while the debate oversimplifies this argument down to two caricatured positions, I think there are many relatively unexplored middle grounds. For instance, privacy pools and compilant tornado cash showed that you can build systems without backdoors, but give users the optional feature to additionally prove in ZK that they are government-compliant.

Corporate Failure
- I think there is a middle ground, and many companies are rightly waking up to it. [Apple's CSAM](https://www.wired.com/story/apple-csam-scanning-heat-initiative-letter/) was one corporate attempt to toe the balance, that failed. The tech was basically the simplest client-side only design for on-premise CSAM detection. The problem was that by opening the ability for governments to add material to a registry that could be scanned for on all users phones, there was likely no way to restrict this feature to illicit images only. If there was an easy way to block only bad images while restricting government overreach, Apple would have implemented such a system long ago. Inherently, any centralized design opens a massive slippery slope for the government to monitor all private images, so this is one of the few times that decentralization is actually mission-critical. Models cannot be determined by individual companies that risk regulatory capture.

Decentralization?
- In the Apple CSAM case, the set of models being run on people's devices need to be automatically amalgamated through community wisdom. In practice, this can look like a repository that requires ZK KYC verification to vote on or add to, or a community system with decentralized stewards voted on by the community who choose open source models that everyone needs to consent to for them to run on that platform. We hope that advocacy groups push this boundary by funding cryptographic research into such prototypes and initiatives, rather than advocating for a specific side of an oversimplified argument (in my opinion, both sides do not capture the whole scope of the problem and are flawed).

Why to Build Even With Regulatory Risk
- When you build open source cryptographic tech, especially when compatible with a substrate as neutral and widely adopted as the EVM, your code can continue to be infinitely forked and redeployed. If it really is the best solution to a certain problem, then anyone wanting to solve that problem on a future government-friendly fork of the chain will prefer to lean on your solution, and even if you are shut down by regulatory agencies, your tech can continue.

Inspired by discussions with Maya Caddle, Arjun R, Sampriti P, and convincing my dad that what I work on is not useless.
