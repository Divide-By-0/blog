---
title: "How We Built Our Computer Use Harnesses and Models"
# NOTE: the source post only says "March 2026", so the day is a placeholder.
date: 2026-03-01T12:00:00.000Z
type: posts
draft: false
slug: "proteus-cua"
category: "10 min read"
tags: ["external"]
description: "How Proteus builds fast computer use agents for macOS, Windows, Android, and iOS: 3-10 chained actions per step instead of a 3-8 s screenshot loop, <250 ms verify gates, 5x faster custom video models, and an untethered mobile agent on a stock phone."
aliases:
  - /posts/proteus-cua
  - /proteus-cua
external_url: "https://proteus.computer/blog/tech.html"
---

How we built fast computer use agents at Proteus. Instead of the standard screenshot-action-screenshot loop that costs 3-8 seconds per step, our harness chains 3-10 actions per iteration, checks them with OCR + verify gates in under 250 ms, and swaps in custom video models that cut inference latency 5x. On mobile, the agent runs untethered on a stock Android or iOS phone, with no ADB and no emulator, controlled from a floating bubble overlay.
