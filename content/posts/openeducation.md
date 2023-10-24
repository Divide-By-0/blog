---
title: "The Future of Open Education at MIT/Harvard"
date: 2023-10-17T22:12:03.284Z
type: posts
draft: false
slug: "education"
category: "30 min read"
tags: ["education"]
description: "Why I care so much about open education, and what inspired MIT SOUL and Course Texts."
aliases:
  - /posts/education
  - /posts/openedu
  - /openedu
  - /posts/openeducation
  - /openeducation
  - /mitsoul
  - /coursetexts
  - /edu
math: true
---

## Introduction

In the summer of 2021, I was blown away to find that my European roommate was sharper than I on command line, more original with his mathematical research ideas, more curious with his physics questions, and had a deeper understanding of complex computer systems (even though I had taken 5+ systems classes at MIT under a math minor + cs major). I realized this depth came through access to high quality education materials — he had taken a significant number of online MIT courses and read many textbooks on his own. Combined with other notes and novels, he had made himself an expert on every subfield he was curious about.

Imagine how many other students around the world there must be with the same drive to give themselves an MIT education: driven by true intellectual curiosity, not grades, mooc certificates, money, or grad school admissions. I met crazy ambitious student after student over the next few years -- a Canadian fusion founder who taught himself plasma physics on OCW, a self-driving vehicle builder who learned machine learning online, someone building brain-computer interfaces who taught themselves physics by self-reading textbooks.

If this is reproducible, it may well be the most impactful thing I do to empower the most ambitious kids to do bigger and grander things, by sharing access to the (arguably) highest quality education materials in the world, especially for advanced topics that only a handful of people understand and know how to teach -- these things have no textbooks and aren't possible for generative AIs to replace right now. As AI changes how students learn and MOOCs are structured, I expect the bottleneck to be high quality training data for cutting edge research topics.

## Hasn't this been done?

Something not too far from this was the original value statement of both OCW and edX. Disappointingly, OCW has failed to update their course contents in -10-15 years (the average release year of every class from courses 1-10 is 2008) and only open-source around 30 classes a semester, even when thousands of classes were online during COVID (not a single person on the team is an MIT alum, just bureaucratic administrators).

edX made many beautiful, high quality intro courses, but recently sold itself and its content to a for-profit institution -- many classes are only accessible on a certain cadence, and we expect many to be paywalled. Each class is takes several months to process to produce at that quality -- it's worth it, but is slow and doesn't work at massive scale.

Unfortunately, the vast majority of OCW content is missing a significant portion of materials, and classes are not realistically learnable. We [analyzed 600 classes](https://docs.google.com/spreadsheets/d/1G641tRW8Xp_FVIzZLLVMAVidl_NK8-VsO2jkZbjT8HI/edit#gid=0) on OCW from courses 1-10, including all of the computer science courses: the average release year was 2008, only 55% the classes had any lecture notes or slides, less than 10% had lecture videos, and less than 30% of them had any problem sets.

MIT classes like Strang's 18.06, MIT's CAT-S0013 systems classes, or the Missing Semester are intentionally iterated to be high quality — well laid out, self-driven, and complete with high quality lecture notes, videos, and exercises. How can we reproduce this type of joyful experience for every class that MIT offers, even the ones offered only once? How can we create a culture where students around the world share their best education materials as widely as possible, so we can curate a registry of the highest quality education on the planet and make everyone a true expert in their own fields? Can we uphold the values of open source and openness in the spirit of Aaron Schwartz and Alexandra Elbakyan, without angering administrators?

## What's in the way?

Professors are often hesitant to open-source courses, due to surprising reasons. The main one is that tenure is decided based on 3 factors: committee participation, in-person teaching, and research output -- open source content can only have negative externalities in terms of reputation. Many, if not most professors, are reluctant to put their videos online for a variety of additional reasons including insecurity, reputation risk-averseness, privacy, mismatched expectations over quality, and live attendance concern. One way we address a subset of these concerns, which has shown promise, is to avoid live lectures to begin with -- we can either focus on encouraging students to take notes, or convert lectures into a textbook-like text format, which professors are usually okay putting online.

Open education has to be done without meaningfully increasing workload of professors — they are taking time out of their research to offer their classes, and often say no to open source because in the past, the process has been hard and long (keeping it up to date, going back and forth, learning how to put up a website). We think (and have shown) that a professor should only have to say yes, add us to their class, and approve the final materials. Professors have complete control over their own courses, helping keep them up-to-date.

Another professor fear is around people cheating off of open source homework solutions. Unfortunately, currently, frets and sororities internally share solutions anyways, giving them a leg up while professors are kept in the dark. The long term antidote is cultural: since generative AI can already train on textbooks and solutions to solve homework problems -- the novelty of student projects and performance on tests will become the most important evaluation metrics, in turn making genuinely finished homework imperative (a truth we hope students will eventually grasp as that focus shifts).

And for copyrights? MIT OCW reportedly told possible donors that 80\% of their contribution would go to copyright overhead. We can start with classes that don't have any copyright overhead with math-focused courses like physics, econ, and computer science. For courses with images, we can create pipelines that automatically detect those images and in their place, embed a portal with an iframe to the original source. For images we can't replace, we can use AI models to re-create images from scratch (i.e. image -> description -> image) to convey sufficiently similar content.

The reason OCW can only open source ~30 classes/semester out of the 1500+ taught each semester is primarily due to video recording. Only a small fraction of classrooms have an auto-capture system, which is insanely expensive (on the order of tens of thousands of dollars per room). If we can simply plug in an iPhone on a tripod in the back of each classroom, we can record lectures in 1080p and automatically stream them. We can significantly cut down on the edit time by using AI to blur student faces to keep their privacy, as this is currently a painstaking manual process.

If professors and TAs want to be compensated for their work, donation links on each class, payment for a "certificate", and nonprofit grants provide classic low-hanging fruit -- but we can incentivize people far better by creating a culture where people who engage with open learning are rewarded and recognized publicly.

The Internet Archive is also interested in ensuring that we can keep content up, and we believe that Wikimedia editors can help caption these kinds of non-profit, open-access videos at scale.

## What does this do?

It turns out that this has massive chain effects that we only unlock at scale. Imagine a database that searches all MIT lecture notes for a certain topic, to get a higher quality first principles understanding than Wikipedia or random web pages. Simply adding search on college course notes would be the best way to learn anything (and generative AI trained on the the most advanced notes for topics without even textbooks, will turbocharge understanding).

The best classes will have time-aligned lecture subtitles (for accessibility and ease), official lecture notes, unofficial lecture notes, homeworks, solutions, exams, and exam solutions, but getting there will happen in stages.

## Master plan

1. Release a directory with links to all existing classes materials, like a html page linking to existing complete course websites, up-to-date edX links, and student-uploaded materials. We've already started this at [mitsoul.org/courses](https://mitsoul.org/courses/), where anyone can [add a GitHub PR](https://github.com/Divide-By-0/mitsoul.github.io/tree/main/docs/courses/mit) to add a class link.

2. Release as many courses' materials as possible, starting with advanced courses where accurate info is hard to find online. Quality is less of a concern, than just open sourcing as many materials as possible. Materials are automatically sorted and uploaded from existing professor courses, and they can edit anytime. This is the mission of [coursetexts.org](coursetexts.org).

3. Invest in longer-term goals of releasing well organized class materials -- ideally with videos at scale with AI editing to make them compliant, high quality lecture notes (that we pay student notetakers for if they don't exist), and automatically fixed copyrighted material. This requires more time, and is the medium to long term vision of [mitsoul.org](https://mitsoul.org), for which we are starting with the econ department at MIT.

Once this succeeds at a small scale, we hope it can help galvanize a self-sustaining community that operates to continue and expand this legacy. A non-profit is critical to keep it open access, and we think a small team of core operators is the most efficient structure.

*This is the manifesto I wrote for why I think open education is important basically exactly 2 years ago -- it is now updated to include my latest thoughts as of October 2023, but is still very incomplete. Joint work with Ashay, Selena, Raffi, and Milo. Put together with help from Brewster Kahle, Mary Lou Jepsen, SJ Klein, DC Posch, and Nate Foss.*
