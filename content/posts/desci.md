---
title: "New Ideas for Crypto Journals"
date: 2023-09-05T22:12:03.284Z
type: posts
draft: true
slug: "desci"
category: "15 min read"
tags: ["crypto"]
description: "My opinions on a new crypto journal, desci, and concrete problems that I personally experience in the space."
aliases:
  - /posts/desci
  - /journal
---
# The Crypto Review

A joint post with Avi Schiffman. Publishing is broken, and research in crypto is hard to surface and hard to verify accuracy. We think there is significant opportunity at this time to explore crypto journal designs, and rapidly iterate on new funding ideas via smart contracts. While I unfortunately don't have time to push forward a system like this, I hope the ideas and blueprints here can paint a path forwards for new incentive systems around academic publishing and journals.

**This is the format of this document:**
### Problem
* Explanation
  * Possible solution ideas for the journal to explore

### Citations as a metric

* There are [innumerable](https://www.gwern.net/Replication) [problems](https://mattsclancy.substack.com/p/does-chasing-citations-lead-to-bad?utm_source=url) [with](https://www.nature.com/articles/nn1298_641) [citations](https://www.nature.com/articles/d41586-019-02479-7) as a metric for research: to name a few, over-concentration on specific research directions leading to a lack of innovation, pursuing short-term papers likely to get citations over higher-risk long-term research experiments, and closed source code with irreproducible results.
    * We think crypto is a ripe space to try to surface new impact metrics for research: none are silver bullets, but it seems right to iterate starting from a completely new starting point. To name a few: number of real-world protocols that implement and thus verify these papers, prediction markets/coin representing likelihood for a retroactive funding grant, novelty metric based on occurence of core new ideas in the past/future, replication count, or impact-based endorsements by experts. 

### Grants

* Currently, professors spend an absurd amount of time looking for and applying to grants. A [number](https://www.mothminds.com/) of [organizations](https://fastgrants.org/) have popped up that have started to address this, but much of it is funded by people who receive no financial return -- it is closer to a form of high impact philanthropy than a sustainable funding model for research.
    * However, with proper research compensation post-hoc along with integration into existing grants primitives, we see this norm being ripe for change

### Research Compensation

* Authors are rarely compensated for their work post-hoc. Some of this is a culture problem (no giving back to open source), and some of it is an access problem (no easy way to give to any author in one click). 
    * However, with the strong culture around i.e. ethereum of [grant-giving](https://gitcoin.co/grants/) and [OSS](https://ethereum.org/en/community/grants/) [support](https://0xparc.org/), along with universality of Ethereum sign in, we think this is a tractable pain point to change.
* Papers themselves are subscription-gated by publishers. This makes it hard for new authors to explore existing research, and leads to sites like sci-hub that makes them open-source anyways.
    * We think that open source access to knowledge is imperative, and we are willing to iterate on alternative funding models to uphold this value.

###  Peer Review Process and Compensation

* Currently, PhD students absolutely hate the slog of reviewing papers, and often the paper filtration metric at journals boils down to “is there a future work section we can ask them to implement” or minor details that could easily be fixed post-review.
    * We can compensate peer reviewers at a specific proportion to paper authors (see compensation section), and have such compensations either be anonymous via ZK, or public via a public smart contract.
* Self-citation via peer review assignment manipulation and reviewers asking to cite their own papers, is common
    * We can assign peer reviewers to papers via a credibly neutral blind matching process (can be onchain via ZK for instance!), or an auction where they bid on papers with tokens (and also get assigned onchain with credibly neutral randomness).

### No Crypto Journal

* So far, many influential researchers in the space like Guillermo, Paradigm, Eth Research, 0xPARC etc. publish their research either on Arxiv, or as blog posts. We think this loses all of the nice affordances of a journal (peer review to verify accuracy, de facto registry), and errs towards only surfacing new research from incumbents with past legitimacy. There isn't a clear journal where one would publish say, novel work about NFTS (such as RICKS), and you'd be hard pressed to find such work at any academic conference.
    * This is an awesome use case to bootstrap legitimacy for a legitimate journal, not just a proof of concept.

### No fair surfacing

* Currently, journals largely devolve into a cult of popularity. How do we surface good papers from younger people, and ensure that people are researching on the fringes?
    * One simple idea is investing in a coin or prediction market on the papers’ popularity. People that bet on good ideas that are underrated get a big share of returns.
    * Finally, similar to a gitcoin matching fund, we can use custom funding algorithms to equalize paper grants. This universal pool can be a mandatory donation point (i.e. in the smart contract) when people donate via the UI. We can use quadratic funding to distribute the grants, or make it inversely proportional to popularity/newness of researcher, or proportional to nicheness etc. They are obviously free to donate to the authors directly via the chain themselves by seeing author addresses, but we hope that people identify with our mission and donate via us!
    * Another interesting idea is subprime CDOs for research funding: by this we basically mean high risk:return ratio loans. Imagine a risk assessment on each paper based on the quality metrics we defined earlier (see: citation section, or expert numbers on risk). We group these into x discrete buckets of risk/reward ratio, and investors can loan into the tranches based on their risk tolerance.

### Paper Acceptance Algorithm

* Lack of transparency and the ability for a few reviewers to accept/reject means that heuristic algorithms develop for acceptance that hurt the ecosystem: I remember a professor telling me once that any paper with a long future work section was weakly rejected immediately by him, with a comment to just implement it before resubmission. Such heuristic shortcuts harm the ecosystem as a whole.
    * One avenue here for improvement is to draw from futarchy: what if we had a prediction market on each paper for acceptance probability?

## Problems with Crypto Whitepapers

### Accuracy

* Without any peer review process, its extremely difficult to tell whether a paper’s claims are accurate
    * We think there is a high concentration of researchers in crypto (Paradigm, Eth Research, 0xPARC, academic researchers), that care about accuracy and intellectual honesty, who will be willing to do peer review.

### Distribution

* There is no registry of vetted, high quality recent papers, so it is very difficult to find a high SNR platform with which to regularly see academic advances (no crypto twitter, not you)
    * We can send out digest emails every month, and surface papers more regularly via Twitter.

## An Example Solution

Here we will lay out an example to demonstrate what a solution could look like: by no means is this realistic nor the ideal; it will require a ton of experimentation to figure out how these should actually look. We just include this section to inspire people to realize the whole scope of both the work required and a framework MVP to begin experimentation on. 

The project can be broken down into four high level components: a prospective research proposal site, a paper submission portal, a peer review system, and a compensation system. Note that because each one is high risk and high iteration, it is not necessary (and probably counterproductive) to build all 4 parts at once. They are also overspecified here to paint a picture of what a coherent solution could look like, but this journal will likely evolve to be something completely different due to iteration. 

_"On the frontier, mankind must often chart their course by stars they have never seen." - JCR Licklider (paraphrased)_

### Proposal Site

For research proposals that are not yet complete, we can take inspiration from the ethresearch forums (or use that directly). We will encourage authors to sign up for grants (or automatically submit for them), and perhaps push for additional functionality on grant sites to lock up a % of committed grants/funding to be released upon completion, to allow higher confidence for funders. 

### Paper Submission Portal

We intend to create a website for paper submission via Ethereum sign in (eventually other chains), and encourage researchers to non-exclusively post their papers to our journal. We will not own any submitted IP nor hinder access to papers that are submitted, and we can ensure this via a VDF based unlock, or a commit-reveal scheme.

### Peer Review System

There are a few different ways to match reviewers to papers, that tradeoff on privacy, ability of reviewer to choose papers, and compensation. We will need a signup portal, a matching portal, and a reviewer feedback system. We will intentionally ensure that there is no cap on papers admitted nor exclusivity, the bar simply being technical accuracy and novelty of research.

### Compensation System

Due to Ethereum sign in, we can create an on-chain graph of all authors, papers, reviewers, citations, and protocol uses. For papers that are cited in other journals, we can use push-to-ens to still assign some of them money, that only they can unlock. Donations will be one click, and money can be distributed according to a preset allocation proportion between each actor in the system. To minimize gas while keeping L1 consensus guarantees, we can bootstrap our contracts on an L2.

## Possible Names

VIbe: Professional sounding title to gain academic legitimacy, ideally with a subtle tongue-in-cheek reference to crypto memes (i.e. backronyms on gm, wagmi etc) 

* **Advances in Crypto**
* Crypto Journal
* **The Crypto Review**
* Journal for Research in Applied Cryptography
* Journal for Applied Research in Cryptography
* **Innovations in Crypto**
* The Decentralized Crypto Journal
* Journal of n Design and Application of Distributed Ledgers

## Possible Flaws with this Construction

* Inherently, it is difficult to make this decentralized off the bat. While we intend to explore ideas to do so, it is inherently a social construction based off of expertise that requires a significant amount of central coordination to make decisions rapidly and pull off properly.
    * To be clear, it's not even clear if decentralization is a goal. The primary cool thing we think crypto can do, is let us iterate very rapidly on funding models via smart contracts. Because the purpose is to explore alternative journal ideas, we can even run it on a private side chain. Censorship resistant donations are certainly nice though, and Ethereum (L2s for gas savings) is the easiest to build on.
* Funding for authors inherently relies on the kindness and culture of the space. While we have no doubt that existing protocols who have shown support for OSS in the past would support alternative publishing models (Uni, Eth Foundation, 0xPARC, Gitcoin, etc...), it is imperative that new protocols based off of journal papers continue this culture as well.
* It’s not even clear if the problems we list hamper the space enough to be relevant, and we are presently ill equipped to comment on if, for instance, peer review is even relevant or if market forces (hacks, audits) are sufficient checks.
* Executing this properly requires deep knowledge of sources of technical ideas and problems in the space.Stated more elegantly by anon, it's ‘kind of unrealistic to believe that you can just open up this pure open democratic process and then expect to get high quality projects and aligned funding sources that just *work*. In the bootstrapping phase you’ll need to use a lot of discretion and do a lot of manual onboarding, which necessitates a broad knowledge of the technical landscape yourselves as well as a good understanding of the ecosystem of humans and orgs.’

We are open to feedback, especially ideas to address these issues, possible other problems, ideas for cool constructions, or connecting to folks who are excited or knowledgeable about these ideas! If you’d like to help with any aspect, we would also love to hear from you :)

Thanks to Nalin for great feedback and for contributing ideas, especially to fair surfacing!

### Misc notes

* Problems
* Gate keeping and funding politics from departments
* Academia moves slow because of the processes 
* Crypto moves fast but the research is highly relevant and related to the work in academia