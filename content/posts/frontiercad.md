---
title: "FrontierCAD: Can Frontier Models Do CAD?"
date: 2026-10-27T12:00:00.000Z
type: posts
draft: false
slug: "frontiercad"
category: "10 min read"
tags: ["external"]
description: "A verifier study for CAD generation: a better part verifier, a new assembly verifier, and frontier models scored on building parts and assemblies from engineering drawings."
aliases:
  - /posts/frontiercad
  - /frontiercad
external_url: "https://normal.ai/research/frontiercad"
---

FrontierCAD is a benchmark we built at Normal for testing whether frontier models can turn engineering drawings into real CAD parts and assemblies. Along the way we found that existing CAD verifiers penalize correct parts that are just rotated, and miss real errors like a bolt hole shifted by a few millimeters, so we built a stricter part verifier and a new assembly verifier to score models properly.
