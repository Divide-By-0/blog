---
title: "Genome Computer's Privacy Promises, Proven"
date: 2026-09-26T12:00:00.000Z
# NOTE: type "page" (not "posts") keeps this off the homepage post list (layouts/index.html
# filters on Type "posts"); it is only meant to be reached from the link on /things.
type: page
draft: false
slug: "genome-privacy"
description: "Two privacy emails from Genome Computer, each with a ZK Email proof you can verify."
aliases:
  - /posts/genome-privacy
---

I recommend [Genome Computer](https://genome.computer) on my [things list](/things) because of its privacy. Here are two emails from them, each with a [ZK Email](https://redacted.zk.email) proof that shows the email is real while hiding the rest of our thread.

## 1. What their lab is allowed to do (Aug 11, 2026)

Their sequencing lab is contractually bound to:

- receive only de-identified samples, with no personal or health information;
- never sell, license or commercially distribute your data, even de-identified or aggregated;
- destroy leftover samples 5 days after results, and delete your DNA and data after 3 months;
- hold any subcontractors to the same terms.

{{< zkproof id="2079bdcc-42db-429d-b719-806be92259e8" >}}

Signed with genome.computer's own email key.

## 2. They kept none of my data (Sep 27, 2026)

> "I can confirm that none of your data has been retained, either here or at our lab."

Their policy's "QA" exception only covers non-identifiable sequencing stats like coverage and yield.

{{< zkproof id="46767a57-e439-41bc-af19-419a92b8562b" >}}

Caveat: this one was signed with Google Workspace's default key for their account, not genome.computer's own, so it proves the email came from their Google Workspace but not the exact From address.

After I asked, they also added a privacy section to their homepage ([before](https://web.archive.org/web/20260806101109/https://genome.computer/), [after](https://web.archive.org/web/20260824162013/https://genome.computer/)).
