---
title: "On Regulation and Crypto"
date: 2023-09-05T22:12:03.284Z
type: posts
draft: true
slug: "gov"
category: "15 min read"
tags: ["crypto"]
description: "My opinions on the state of the government in crypto, how I think about regulatory compliance, and building tech that may be banned by governments."
---

As governments become increasingly skeptical of and take action against crypto, I think it's important to lay out a path forwards for how one might remain optimistic about the space. My opinions on the state of the government in crypto, how I think about how crypto can work with governments in ways that do not undermine the ideals nor insert backdoors, and building tech that may be banned by governments. Note that I am not an expert, this is mostly distilling information from conversations with people much smarter than I. A huge kudos to WIRED's consistent commitment to convey the truth about relevant initiatives and governmental overreach to the public.

Past Interactions with Government
- The NSA is notorious for spending millions (maybe billions) of dollars [tapping phone lines](https://www.google.com/search?q=wired.com+phone+line+tap+jail+nsa) and [refusing to defend those who do not comply](https://www.wired.com/2007/11/feds-invoke-sec/), and inserting [backdoors into PRNGs](https://www.wired.com/2007/11/securitymatters-1115/) including NIST standards. There is also dubiousness over the "random" pre-image selected for the SHA1 parameter generation of the P256 curve by the NSA recommended by NIST, elaborated on in [SO](https://crypto.stackexchange.com/questions/10263/should-we-trust-the-nist-recommended-ecc-parameters) and [SafeCurves](https://safecurves.cr.yp.to/). Finally, it's likely that it is well within government capacity to [read basically all TLS1.2 communications](https://cacm.acm.org/magazines/2019/1/233522-technical-perspective-attacking-cryptographic-key-exchange-with-precomputation/abstract). [LogJam](https://dl.acm.org/doi/10.1145/3292035) showed that the NSA has likely broken small-group cryptography in TLS and can read about 8.4% of all Alexa Top 1M sites' data, and this is consistent with the VPNs that the NSA has previously hacked.
- Regarding the complex moral question over whether stronger cryptography is more important, or national security is more important, most arguments for the former seem a bit idealistic to me (you still want to avoid extremely morally bad things from happening if you can), and most arguments for the latter also seem a bit idealistic on the government's role -- usually these push for backdoors in cryptography, or a complete discarding of privacy in favor of delegating decision making power to the government. I think there are many relatively unexplored middle grounds. For instance building systems without backdoors, but giving users the optional feature to additionally prove in ZK that they are government-compliant.

A Middle Ground
- I think there is a middle ground, and many companies are rightly waking up to it. [Apple's CSAM](https://www.wired.com/story/apple-csam-scanning-heat-initiative-letter/) was one corporate attempt to toe the balance. The tech was basically the simplest client-side only design for on-premise CSAM detection, and was well done. The problem was that by opening the ability for governments to add material to a registry that could be scanned for on all users phones, there was likely no way to restrict this feature to illicit images only. Unfortunately, the debate is not quite as black and white as the media and lobbyists claim -- if there was an easy way to block only bad images while restricting government overreach, Apple would have implemented such a system long ago. Groups like Heat Initiative would do better by funding cryptographic research into such initiatives.

Inspired by discussions with Maya Caddle, Arjun R, and convincing my dad that what I work on is not useless.
