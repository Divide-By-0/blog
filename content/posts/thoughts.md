---
title: "Thoughts on Various Media I've Consumed [Live Post]"
date: 2022-10-19T22:12:03.284Z
type: posts
draft: true
slug: "thoughts"
category: "20 min read"
tags: ["thoughts", "musings"]
description: "Takeaways from articles I've read or videos I've watched"
aliases:  
  - /posts/thoughts
  - /thoughts
---

It's really hard to maintain any long-term takeaways from the content I read, and I find it useful to explain exactly how my thoughts and opinions change over time, to hold me to specific updates in opinions, to allow others to check and correct my understanding, and to invite conversation on topics that I'm interested in.

## UBI

I think a lot about UBI in the context of tech like [email wallet](https://sendeth.org) that enables currency transfer to any email address and redemption via zk proofs behind the scenes, and in the context of blockchains where I'm not sure if it makes sense as an application. Below is my attempt to analyze existing experiments and determine the best path forwards for UBI.

### The [Mumbuca Currency Experiment](https://www.maricabasicincome.com/en/about-the-study)

The Mumbuca is a currency backed 1:1 by the Brazilian Real, but only spendable within the local city and with an additional 1% tax on redemption to Reals during 25 days of each month. The backing is funded by oil found off of the coast of the city, and this is effectively its choice public good. The tax only affects those who want liquidity immediately, and the restrictions on redemption keep spending from the UBI completely domestic. The tax funds a UBI for additional Mumbucas to be distributed to poor families of the local city, and has led to a claimed employment increase during the pandemic, compared to a decrease elsewhere. The study design is mentioned on the linked page, but I'm most curious to see a few answers.

1) Counterfactual analyses: had the [money been spent](https://medium.com/free-software-in-latin-america/mumbuca-99fd89b6e9c6) on a shopping center that provided local taxes or other public goods development like roads or infrastructure, how would the benefits have compared to extra local-only spending power? 
2) Does local-only redemption make a huge difference? For instance, haircuts and groceries must by definition be local, and if someone merely shifts all of their local spending to happen in mumbucas and international spending via their actual currency, does the local-only nature of a small supplemental income actually change much?

If the local-only nature of the currency really did change spending patterns, then I am curious if it makes proof-of-location via zk email or zk proofs of helium hotspots or zk proofs of attested gps, a more valuable proof to have.

### Finland's UBI Experiment

Finland's UBI experiment was marked as a failure, and they reformed the system (notes below). However, the [actual results](https://www.weforum.org/agenda/2023/06/children-care-guaranteed-income/) seem to paint a different picture -- the goal of the program was directly to reduce unemployment in the short term, but doesn't seem to have led to immediate changes in that aspect. Critics rightfully say the effects weren't measured on a long enough timescale (the premise being better mental health and education only leads to more employment later down the line). It seems to primarily [be because](https://yle.fi/a/74-20033917) part time jobs are sufficient to maintain a lifestyle and so people don't look for full-time work, and the expectations on how getting a job might change someone's eligibility for the program are unclear. The proposed solution was to restruct UBI to people who do not show 4 job applications per month and who reject job offers, but I can't find any information online with the results of this restriction. The UBI only increased existing benefits by $50 per month, and saved benefactors from the paperwork of reporting income. Of course, this means that you can no longer scale UBI sub-linearly with income (i.e. at higher incomes, you still have benefits, but less; so for instance, each $1 of income will reduce your benefits by 10 cents). It seems to me like the UBI should end after a specific period of time as to only be temporary support (which seems to have been the case, as the trial was only run for a year), and I'm dubious of self-reported data: there seems to be a bias for people to claim that their mental health got better regardless of the truth, in order to continue to receive the benefits as the government rules it a success.

### [Norway's UBI Requirements](https://worldpopulationreview.com/country-rankings/countries-with-universal-basic-income)

Norway gives UBIs conditional on public participation, including participating in elections and paying taxes. I think this makes sense, and seems hard to do with a crypto-based UBI scheme.

### Bolsa Familia ([Page 43 here](http://www.world-psi.org/sites/default/files/documents/research/en_ubi_full_report_2019.pdf))

This scheme is also dependent on completed vaccinations and school enrollment for children, which I like.

### [India's UBI Results](https://worldpopulationreview.com/country-rankings/countries-with-universal-basic-income)

If the primary result of UBI is increased schooling, then one would actually expect to see a temporary hit to employment in favor of education, and only see benefits many years later. I think analyses of the effects of UBI need to also consider the change in education rates, and factor the net long term effects into the success metric of the experiment.

### Takeaway on UBI

I'm no longer quite as convinced that existing UBI mechanisms are as effective as people claim, though I do think that we should increase the number of experiments trying different schemes, and that a small percent of public revenue should go towards local experiments on it. I also think that much of the criteria relies on things that can't efficiently be verified on chain, and blockchains are only useful as payment substrates, not entire backbones (and even then, taxes on blockchain-based UBI often hurt the community and help the UBI company and its venture capitalists).

The PSI pro-Union org released a [report](http://www.world-psi.org/sites/default/files/documents/research/en_ubi_full_report_2019.pdf) that seems well written, and proposes promising alternatives to UBI. The argument that it [subsidizes low wages](http://www.world-psi.org/sites/default/files/documents/research/en_ubi_full_report_2019.pdf) seems fair, and that it merely band-aids and doesn't actually change the underlying social fabric and problematic entrenched systems, only [offering temporary relief](http://www.world-psi.org/sites/default/files/documents/research/en_ubi_full_report_2019.pdf). Unfortunately, it also [exacerbates gender roles (page 44-45)](http://www.world-psi.org/sites/default/files/documents/research/en_ubi_full_report_2019.pdf) since women disproportionately enter education or caretaking roles.

I like their job guarantee proposal, in that the money is instead given to an organization to create a new job and pay the person that much, increasing employment and helping local businesses. Their cautions with four day workweeks also makes sense; it's reasonably opposed by low paid workers, and implementing it for only high-paid jobs only increases inequality in health etc due to disparities in disposable time.

### Metacomment on studies
It's unusual that [so many schemes have been tried](http://www.world-psi.org/sites/default/files/documents/research/en_ubi_full_report_2019.pdf) but documents [like this](http://www.world-psi.org/sites/default/files/documents/research/en_ubi_full_report_2019.pdf) are unable to make any concrete policy decisions or have takeaways since the schemes (like ReCivitas or Marica's) are not paired with rigorous studies. I also think that studies based on self-reporting might be biased by people saying they went better than they did to try to keep benefits, and not reporting employment due to fear of having to pay taxes on that income. I can see anonymous zero knowledge-enabled reporting i.e. via semaphore nullifiers to be valuable here.

### Universal Basic Services

The Institute for Global Prosperity at University College London is trying to spread this meme, which says that public goods like health, education, housing and domestic utilities, childcare, adult social care, and transport and digital communications.

## Ethics in Consent and Truth in Research

Research is based on the premise that the pursuit of truth is noble. Unfortunately, this directly contradicts different cultures, like when an [Indian tribe's blood was used for non-consenual research](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5310710/) to determine their origin (among other things), which went against their traditions and tribal knowledge, and resulted in decreased group cohesion.

## Bipartisan Climate Change

Anson has a documentary on this that I am very excited for. Given that optics seems to be more important for Republican lawmakers, I think that couching pro-climate legislation with benefits to workers and naming the bill after the benefits to the workers i.e. advocating for ev or solar development and promising new job offers from existing firms for those displaced workers seems useful. I think also that rebranding [meltdown-proof triso-based nuclear fuel](https://www.energy.gov/ne/articles/triso-particles-most-robust-nuclear-fuel-earth) as something like "supergas" would help avoid association with anti-nuclear sentiment due to meltdowns.

## Audio Timestamping
Turns out theres a [50 Hz background hum from power mains in all audio](https://www.youtube.com/watch?v=e0elNU0iOMY) with minor fluctuations that can be mapped back to the original power grid in order to precisely timestamp video, which is really interesting. This has use in catching fake speedrunners, but I wonder if it can be used for audio watermarking as well.

## My Position on e/acc vs d/acc

Andreessen (e/acc) correctly notes that we are not optimistic enough on technology, and we let short term concerns slow down long term losses. At the same time, Vitalik (d/acc) is right that we need this acceleration deeply in places like medicine (i.e. 10 people dying in a trial is a tragedy but 100K people dying because of a delayed drug is a statistic), but just accelerating indiscriminately in the direction that tech and capitalism take us can be destructive. He argues (and I agree) that we really do need to invest in defensive technologies at the same time, especially against tech-progressive ideas that the rest of the world will struggle to catch up to. I think this divide is well demonstrated in biosecurity, nuclear weapons, fracking, biological weapons, and human reproductive innovation (["tech is not inevitable"](https://maxlangenkamp.me/posts/tech_not_inevitable)) -- where defensive policies and technology defense was critical for those fields to not decimate humans. Overall, I think you can be d/acc but still be accelerationist -- you just believe that explicit, non-capitalist incentives are needed to accelerate technology on the best possible paths by incentivizing additional arms of technology.

I think this dialogue mostly exists between powerful tech people and on Twitter, and the broader world will not know about it. However, it seems possible for the political divide to slightly shift for this dialogue to become one of the dominant qualities that lets you determine the rest of someone's stances. On a meta note, I am super hyped that Vitalik named d/acc defensive technology instead of deaccelerationism, to change the natural "foil" of e/acc to still be accelerationist but responsibly, thus still giving power to the best deaccelerationist counterarguments, bit without giving momentum to that likely destructive movement.

## How to Clone Github on a New Computer

I have had this problem an infinite number of times -- a new computer or ssh, and I need to clone a private repo. It's a massive pain to keep adding my ssh key to Github when all I want is a quick piece of software and I don't really care about Github security beyond a one time key.

You have to:
```
git clone https://<USERNAME>@github.com/<USERNAME>/<REPO>
```

Putting username@ and using https means it won't error to ask for an ssh key. It will then query for a password (either when you first clone or when you git push), and in all these scenarios, put in a [personal access token](https://docs-github-com.translate.goog/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) instead of your password. I generated said token a while ago for all my ssh machines, and saved it in my Bitwarden. It's super weird that this process is completely undocumented, and I had to cobble it together from a bunch of random posts and answers -- it is admittedly lower security but marginally faster and higher convenience.

## Quail Eggs, Laundry Detergent, and EoE

There were a [few papers in 2018](https://www.nature.com/articles/s41598-018-19309-x) that showed consuming quail eggs reduced EoE-related inflammation. Apparently the ovomucuoid protein that is allergenic in chicken eggs is [mutated at all the allergenic binding sites](https://www.sciencedirect.com/science/article/pii/S2213453022002154), and in fact inhibits eosinophils in quail eggs. Quail eggs also have a specific 'serine protease inhibitor' which reduces abnormal antibody expression from EoE. I now very frequently eat them, but perhaps my intake should go from 5 once a week to 5 a day.

In 2022 and 2023, there were [a flurry of papers](https://scholar.google.com/scholar?hl=es&as_sdt=0%2C5&q=laundry+detergent+and+eoe&btnG=) tying laundry detergent to EoE. I now only use [Molly's Suds](https://amzn.to/3oznUYk) which doesn't have any of the harsh and possibly bad cleaning agents (likely SDS) in things like Tide.

## Slate Star Codex Article Thoughts

[Be Nice Until You Can Coordinate Meanness](https://slatestarcodex.com/2016/05/02/be-nice-at-least-until-you-can-coordinate-meanness/)

- Gives a good way to think about the default policy of being "nice", where that fails, and a cool heuristic to think about unilateral decisions vs group norms. Reminiscent of credible neutrality.

[Depression and Inflammation](https://slatestarcodex.com/2015/01/05/chronic-psychitis/)

- We have a garbage understanding of depression, and SSRIs don't work very well. I'm curious to see the inflammation link validated or disproved.

[Coherent Free Speech Norms](https://slatestarcodex.com/2017/08/01/is-it-possible-to-have-coherent-principles-around-free-speech-norms/)

- The archipelago approach to free speech norms is sensible, the distinction between a speech act and speech is a useful tool, and anti-vigilante principles being consistent is disappointing, but also makes sense.

[Archipelago and Atomic Communitarianism](https://slatestarcodex.com/2014/06/07/archipelago-and-atomic-communitarianism/)

- Gives a compelling analogy for why increasing someone's choice in a situation might be bad, due to making a worse choice closer to the lower friction default choice. Goes into a lot of details on specific situations that in retrospect, I also felt confused about. I like how this just felt like a thought dump of an untraditional view -- I'm hoping this can be an inspiraiton for me to also talk about my untraditional views.
