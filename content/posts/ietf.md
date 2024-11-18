---
title: "Advancing Standards for ZK and Provenance"
date: 2024-11-12T22:12:03.284Z
authors: ["yush_g"]
draft: true
type: posts
slug: "standards"
category: "30 min read"
tags: ["crypto", "zk", "signatures"]
description: "rt"
aliases:
  - /posts/standards
  - /standards
  - /posts/ietf
  - /ietf
recommended: false
toc: true
---

*Thanks to Eric Rescorla, Justin Richer, Digital Bazaar, Mark Nottingham, Vivek B, Crema Labs, Dan Boneh, and Desec for their time and insights!*


Going to the IETF standards conference for a week, reading more RFCs than most 24 year olds should be reading, and talking to several RFC authors has given me a decent sense of what needs to happen in standards and adoption to maximally advance the ZK, cryptography, and signatures space. Here are my thoughts, along with links to the raw info. Note that this is currently in progress and being actively edited and written -- please give feedback to [@yush_g](https://x.com/yush_g) on X or Telegram!

## General Framing and Purpose

My primary goal here is to increase the amount of signed data in the world -- ideally, we make proofs of signatures exactly as we do for [zk.email](https://zk.email), but for all sorts of web data -- this lets us interoperate that data with other data, and directly prove it's provenance. This is extremely powerful for 1) proving this data with ZK proofs to add selective disclosure, like how [openpassport.app](https://openpassport.app) does, 2) using these signatures in tandem with systems like [Proteus](https://proteus.photos) to prove provenance of data (i.e. this image came from the New York times, and here's a signature and series of proofs to prove that) and 3) proving the data on chain allows anyone to build prediction markets (like tmr.news) or composable, private identity proofs on top of this data. These identity proofs can allow for things like [account recovery](https://prove.email/blog/recovery) or gated groupchats, or arbitrarily complex autonomous systems like gated, anonymized access to a company reimbursement system on chain.

The primary reason that people are against this are 1) it's hard to setup, manage, and rotate signing keys -- DNSSEC has caused massive outages like Slacks, and managing sensitive key data isn't neccessarily a burden to give to organizations, and 2) nonrepudiation, where folks want to make it harder to prove provenance of leaked data. In my opinion, both of these arguments are extremely weak -- for 1), you can improve standards and key management practices to add security (as has recently been happening with DNSSEC, see below), and especially in an age of rampant AI, cryptography becomes increasingly critical. And for 2), the presence of digital signatures Isn't practically interpreted for repudiaability -- just look at the number of leaked documents or even emails for which the DKIM/repudiation data is completely stripped, yet the evidence is fully admissible in courts -- see any of the filings mentioned by [Internal Tech Emails](https://x.com/TechEmails). Adding signatures won't make that data any more valid -- it's already accepted as truth due to the way it was obtained (i.e. a search warrant on a database).

## TLS

Of course, TLS is currently asymmetric, meaning we have to rely on TLS Notary (relies on an MPC noncollusion assumption) or TLS Proxy approaches (purely infrastructure security, no cryptographic security) in order to get attestations on TLS data. These are fine stopgaps for now, but I think the long game is adding signatures to all web data.

Having chatted with the TLS author Eric Rescorla for over two hours about how to frame signed TLS, he implied (and I concur) that instead of adding signatures to the slow moving TLS (which requires buy-in from browsers), to instead add these signatures to the HTTPS layer. Adding anything that needs computation (like hashing a signed payload) to TLS will be an impossible goal -- it will make TLS bloated and add unneeded delays (single milliseconds on each connection will cost millions to Facebook), so it makes more sense to only send signatures when users request them.

The main way to convince folks to adopt here is NOT via the arguments I put in the introduction -- none of these are compelling business arguments to gain adoption. For each idea, he recommended 1) focusing on the fake news/provenance angle instead of all of the other cryptography ideas above, and 2) having a clear high demand *user story* for why it mattered, not a technology story. For instance, the most compelling adoption story is, proposing to browsers and news sites to have a right click, 'Save as Certified' option for image downloads only for sites with signatures on the HTTPS layer then makes this standard worth advocating for on both the website and browser side (and each drives the other).

## SXG

This was a standard proposed a few years back by Google. It's interesting for provenance, but that wasn't the original goal -- the purpose was to have CDNs/websites sign their webpages, such that Google could cache those sites and serve them from their own cache, without having to hit the CDNs to get that data. This lowers search latency (because one round trip to the CDN is saved) as well as bandwidth (CDNs don't have to serve as much data to get the same results). It seemed like a win-win standard, but the fundamental problem was more political than technical -- having spoken to a few parties at IETF, the main issue was that CDNs charge users per megabyte of bandwidth sent through the CDN, but this proposal would reduce the amount of data going through the CDN, so they would get paid less. Pretty dumb thing to kill a standard over, but that's the main reason for lack of support. Browsers like the very vocal Mozilla (not a CDN) also strongly oppose it because it's tied to AMP (a bad and dead standard), and because they interpreted it as *private user data* being signed and stored by the search provider, which would be very bad indeed (but I suspect was not the original intent of the standard, only public data).

It is worth noting that one way to turn this around would be to decouple SXG from search engine caching, decouple it from AMP, and don't make it visible to third parties -- only users (as part of encrypted packets to them), so that websites can continue to serve personalized or private content as needed, and the CDNs still serve all the packets (i.e. perhaps the signatures expire after a very short time). It would also have been better if this standard didn't have Google as a sole author but alas.

Luckily, because Cloudflare added a one-click option to enable this on websites, there are [a number of websites with it enabled](https://github.com/thor314/how-many-sxg-sites/tree/main/results), as well as several repos (that we helped fund and build!) to make zk proofs of that data -- there is a [circom](https://github.com/RiverRuby/circom-sxg) one but the [sp1](https://github.com/crema-labs/sxg-sp1) implementation is most mature. We think that even though there is no long term adoption of this standard as it's currently written, it's still useful to develop on in order to build inspiring apps to convince folks to adopt better versions of signed data, like RFC 9421. 

## RFC 9421

RFC 9421 is interesting as a better replacement to SXGs because it's 1) less opinionated and 2) does not serve Google's interests or hurt CDN income. It's not even for the same purpose -- RFC 9421 is explicitly targeting provenance, meaning organizations like the New York Times can sign webpages and ensure they don't spread misinformation (not search engine caching like SXG did, which wasn't quite as popular). It is already a finalized standard and there are [several implementations and libraries already](https://httpsig.org/).

This [discussion with the main writer Justin](https://app.tactiq.io/api/2/u/m/r/EA8nJ55lF1MzFcdDt0zJ?o=sl) was particularly helpful to understand. Basically, this standard is currently used by Amazon for inter-datacenter communication -- but for requests, not responses, and is a way to verify that the request you're receiving is authentic and trusted, and not just anyone can query arbitrary data from AWS datacenters. Note that we want to use it the other way around (the response is signed, not the request) -- but luckily either is supported in the standard. One note here is that the public key infrastructure (PKI) is not specified in the standard, but Justin said that DNS the same way that DKIM distributes keys should be totally fine (it would be ideal to strongly recommend DNSSEC as well).

For any changes to HTTPS, getting buy in from Cloudflare is your #1 option for adoption -- I suspect Digital Bazaar is already having these conversations with Cloudflare on RFC 9421, but good to check in. Mark Nottingham who runs much of the standards work at Cloudflare is the right contact for all of this -- Nick Sullivan used to drive much of the pioneering cryptography work at Cloudflare (like adding SXG) but unfortunately left the company last year.

## DKIM/SML

Having worked on [ZK Email](https://zk.email) for years, which makes ZK proofs of DKIM signatures, I think I have a good idea of what the main blockers are for improvements to the DKIM standard to make it better for provenance. Unfortunately, Deltachat is the only chat app that supports DKIM signatures, which is cool, but I wish more messaging apps supported this.

I think the main things here are 1) mandating the to: field is signed, which Hotmail doesn't do but nearly everyone else does (meaning you can spoof any email recipient to think they got an email from any other hotmail email sender who emailed you before), 2) mandating self-emails are signed, which no one does (but would help with proving email identity ownership), 3) mandating that forwarded/replied emails sign the signature of the previous email -- we can de-mangle the old email manually to rederive it, and this means the UX flow of ZK Email proofs can be a simple forwarding, and 4) ask onmicrosoft.com to ensure that their selectors/domains are not arbitrary, but instead 1-1 correspond to the domain they are signing for, the lack of which I suspect causes the majority of spam in email to come from Microsoft.

There's an additional working group at the IETF called SML (Structured Email), which is working on standardizing different kinds of common emails to ensure that needed metadata is always included in relevant emails of that type (like calendar events, etc), making them universally parseable. I think it would be great to add things like forcing specification of unique user IDs + amounts in order to make things like [zkp2p.xyz]'s Venmo flows consistently alive with the needed data.

## DNSSEC

Unfortunately, due to several outages like Slack's and a ridiculous proportion of top-level TLDs going down, DNSSEC has not been adopted widely, and several blog posts [NOTE TO SELF: CITE] treat it as literally evil devilspawn. However, DNSSEC will be needed to get public keys like DKIM or RFC 9421's keys to be verifiable without bespoke oracle networks.

Luckily, the primary issues with DNSSEC should all be fixed with the new key rotation RFCs 7344 + RFC 9615. Why? Because often when child DNS records rotate keys, the parent zones need to immediately handle that key rotation and sign the new keys [DOUBLE CHECK THIS]. Unfortunately, this doesn't currently happen because of poor automation interoperability between servers involved in the DNSSEC chain of trust, hence resulting in child domains sometimes breaking.  By helping to implement these standards in commonly used DNS repositories, we can increase the reliability of DNSSEC. Note there are other reasons too like caching inconsistences, but I'll address those later [ADDRESS THOSE].

Desec (a Berlin-based collective pushing for better DNSSEC standards) and I had a great chat about this -- they are doing incredible public goods work with the relevant parties (ICANN, IETF, DNS stakeholders, domain registrars, etc.) to improve and deploy DNSSEC. One concrete place they recommended to start was implementing these RFCs and adding them to the often-cloned DNS repos like [Knot's CZ server](https://gitlab.nic.cz/knot/knot-dns) -- it's purely an engineering effort problem.

## BBS+ Signatures

I had a [great chat](https://app.tactiq.io/api/2/u/m/r/EA8nJ55lF1MzFcdDt0zJ?o=sl) with the main drivers of RFC 9421, Digital Bazaar, who PSE (and other aligned orgs, feel free to get [in touch](https://x.com/yush_g)!) intend to work closer with, to advance this and more signed data standards. The main thing they requested is cryptographers to help review standards and basically say that they look OK. One of the main issues with many signed data standards is that they standardize a serialization format, which the very loud JOSE + W3C group attempts to shut down due to PTSD from serialization mistakes in the past -- however, this makes no sense as a reason to stop otherwise good standards. 

Note that due to the extreme conservatism of NIST, cryptographic standards have to have been around for 20+ years to standardize, which is why now is the right time for BBS+, but ZK proofs might take another decade or so to show up in standards. Digital Bazaar drafted a [great doc explaining how cryptographers can help review and standardize BBS signatures](https://docs.google.com/document/d/1vNJwvIr_RzMM3SFApOcYh7XjkRJzy_jnZQKWiGq3mXk/edit) for selective disclosure.
