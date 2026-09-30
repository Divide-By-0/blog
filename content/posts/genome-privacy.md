---
title: "Genome Computer's Lab Privacy Commitments"
date: 2026-09-26T12:00:00.000Z
# NOTE: type "page" (not "posts") keeps this off the homepage post list (layouts/index.html
# filters on Type "posts"); it is only meant to be reached from the link on /things.
type: page
draft: false
slug: "genome-privacy"
description: "The sequencing-lab privacy commitments Genome Computer shared with me over email."
aliases:
  - /posts/genome-privacy
---

I recommend [Genome Computer](https://genome.computer) on my [things list](/things) mainly for its privacy. Before recommending it to friends, I asked them for the agreement they signed with their sequencing lab. Their lawyer wouldn't let them share the redacted contract, so on August 11, 2026 their founder emailed me this summary of what the lab is contractually bound to:

> **Laboratory Privacy Commitments**
>
> 1. Samples and associated data provided to our laboratory partners are de-identified and exclude personally identifiable information and protected health information.
> 2. Our laboratories may not sell, license or otherwise commercially distribute data derived from our customers' samples—whether identifiable, de-identified or aggregated.
> 3. Sample collection devices and residual samples are retained for five days after the associated results are delivered. DNA samples and associated deliverables are retained for three months following delivery.
> 4. Deliverables made available through our laboratories' provisioning environment are removed from that environment after three months.
> 5. Any subcontractor our laboratories use are subject to the applicable terms of our agreement, and our laboratories remain responsible for their acts and omissions.

Earlier in the same thread, they told me the lab can't use the data for anything except QA (no model training, no selling or licensing), and that not every lab they talked to would accept these redlines. Their current [privacy policy](https://genome.computer/privacy) says the lab may use de-identified data for internal quality assurance and method improvement, and is contractually barred from selling, licensing, or using it for unrelated research or products. When I asked, they deleted my data from their platform and had the lab do the same, and confirmed it within a few days.

After this exchange they said they'd put privacy "more front and centre" on the site, and they did: the homepage had no privacy section on [August 6](https://web.archive.org/web/20260806101109/https://genome.computer/), and by [August 24](https://web.archive.org/web/20260824162013/https://genome.computer/) it had an "Our Privacy Commitment" section with these same terms.

You don't have to take my word that they sent this: here is a [ZK Email proof of their email](https://redacted.zk.email/verify?id=5db31511-cef9-4c17-a2b3-21f9b0fa3f95). It proves the commitments above came in an email DKIM-signed by genome.computer, while hiding my address and the rest of our thread. Press "Verify Proof" to check it in your browser.
