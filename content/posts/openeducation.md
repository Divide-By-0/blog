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
recommended: true
---

*Thanks for support and guidance on these ideas from Brewster Kahle, Mary Lou Jepsen, SJ Klein, DC Posch, Adam D'Angelo, Michael Nielsen, and Nate Foss.*

## Introduction

In the summer of 2021, I was blown away to find that my European roommate was sharper than I on command line, more original with his mathematical research ideas, more curious with his physics questions, and had a deeper understanding of complex computer systems. I realized this depth came through access to high quality education materials — he had taken a significant number of online MIT courses and read many textbooks on his own, focused on deeply understanding. Combined with other notes and novels, he had made himself an expert on every subfield he was curious about.

There are many successful ex-students who started with the exact same drive to give themselves an MIT education: driven by true intellectual curiosity, not grades, certificates, money, or grad school admissions. I met crazy ambitious student after student over the next few years -- a Canadian fusion founder who taught himself plasma physics on OCW, a self-driving vehicle builder who learned machine learning online, a friend building brain-computer interfaces who taught themselves physics by self-reading textbooks.

The only problem is that they stopped -- not because of lack of curiosity, but because of the limits of the materials. They weren't complete enough to learn from, they stopped short of the full curriculum, or they were outdated.

If I can fix this reproducibly, it may well be the most impactful thing I do to empower the most ambitious kids to do bigger and grander things, by sharing access to the (arguably) highest quality education materials in the world. We can start with either full majors, lecture videos, or focus on advanced topics that only a handful of people understand and know how to teach -- these things have no textbooks and aren't possible for generative AIs to replace right now. As AI changes how students learn and MOOCs are structured, I expect the bottleneck to be high quality training data for cutting edge research topics -- relevant videos and materials will become more important, not less.

## Hasn't this been done?

Something not too far from this was the original value statement of both OCW and edX. Disappointingly, OCW has failed to update their course contents in -10-15 years (the average release year of every class from courses 1-10 is [2008](https://docs.google.com/spreadsheets/d/1G641tRW8Xp_FVIzZLLVMAVidl_NK8-VsO2jkZbjT8HI/edit#gid=0) and only open-source around [20 new classes](https://dspace.mit.edu/bitstream/handle/1721.1/157076/MITOpenLearning-annual%20report-2024.pdf) a semester for [an annual budget of ~$3M](https://mitocw.ups.edu.ec/give/why-give/#:~:text=The%20total%20annual%20cost%20of%20MIT%20OpenCourseWare,materials%20from%20faculty%2C%20ensure%20proper%20licensing%20for), even when thousands of classes were online during COVID (not a single person on the team is an MIT alum).

edX made many beautiful, high quality intro courses, but recently sold itself and its content to a for-profit institution 2U that [just went bankrupt](https://www.highereddive.com/news/2u-bankruptcy-restructuring-opms-education-department/722580/). Even if it wasn't in a dire financial situation, many classes are only accessible on a certain cadence, and we expect many to be paywalled. Because of the insanely high quality bar, each class is takes several months for a several person team to produce at that quality -- it's worth it and fills a valuable niche in open education, but is slow and doesn't work at massive scale.

Unfortunately, the vast majority of OCW content is missing a significant portion of materials, and classes are not realistically learnable. We [analyzed 600 classes](https://docs.google.com/spreadsheets/d/1G641tRW8Xp_FVIzZLLVMAVidl_NK8-VsO2jkZbjT8HI/edit#gid=0) on OCW from courses 1-10, including all of the computer science courses: the average release year was 2008, only 55% the classes had any lecture notes or slides, less than 10% had lecture videos, and less than 30% of them had any problem sets.

MIT classes like [Strang's 18.06](https://web.mit.edu/18.06/www/), MIT's [CS systems classes](https://mitsoul.org/courses/mit/course-6/), or the [Missing Semester](https://missing.csail.mit.edu/) are intentionally iterated to be high quality — well laid out, self-driven, and complete with high quality lecture notes, videos, and exercises. Can we reproduce this type of joyful experience for every class that MIT offers, even the ones offered only once? Can we create a culture where students and professors around the world share their best education materials as widely as possible? Can we use these to curate the highest quality education on the planet and make everyone a true expert in their desired fields? Can we uphold the values of open source and openness in the spirit of Aaron Schwartz and Alexandra Elbakyan, but without angering administrators?

## Addressing professors' concerns

Professors are often hesitant to open-source courses, due to surprising reasons. The main one is that tenure is decided based on 3 factors: committee participation, in-person teaching, and research output -- open source content can only have negative externalities in terms of reputation. Many professors that we talked to are reluctant to put their videos online for a variety of additional reasons including insecurity, reputation risk-averseness, privacy, mismatched expectations over quality, and live attendance concern. One way we address a subset of these concerns, which has shown promise, is to avoid live lectures to begin with -- we can instead encourage students to take textbook-quality notes of lectures, which professors are usually okay putting online.

Open education has to be done without meaningfully increasing workload of professors — they are taking time out of their research to offer their classes, and often say no to open source because in the past, the process has been hard and long (keeping it up to date, going back and forth, learning how to put up a website). We think (and have shown) that a professor should only have to say yes once, add us to their class, and then receive the final materials on a silver platter to approve. Professors keep complete control over their own courses, and can help keep them up-to-date along with crowdsourced PRs on the repository.

Another professor fear is around people cheating off of open source homework solutions. Unfortunately, currently, frets and sororities internally share solutions anyways, giving them a leg up while professors are kept in the dark. Now, generative AI can already train on textbooks and solutions to solve many homework problems. The long term antidote is cultural: the novelty of student projects and performance on tests will become the most important evaluation metrics, in turn making genuinely finished homework imperative (a truth we hope students will eventually grasp as that focus shifts).

## What else stands in the way?

Copyrights are one of the biggest issues with open sourcing content, especially with images and videos. MIT OCW reportedly told possible donors that 80\% of their contribution would go to copyright overhead. We intend to start with classes that don't have any copyright overhead with math-focused courses like physics, econ, and computer science. For courses with images, we are building an automated pipeline that automatically detect those images and in their place, embed a portal with an iframe to the original source. For images we can't replace, we can use AI models to re-create images from scratch (i.e. image -> description -> image) to convey sufficiently similar content.

The reason OCW can only open source ~30 classes/semester out of the 1500+ taught each semester is primarily due to video recording. Videos are manually edited frame by frame to blur out student faces, align slides, and switch angles. Then, they are sent to a manual transcription firm that charges thousands of dollars per course. We can significantly cut down on the edit time by using AI to blur student faces to keep their privacy, automatically detect slides and put them in perspective, and auto-align video angles and choose the one with the most motion. Then, Whisper (with crowdsourced post-processing, starting with Wikimedia editors) can help caption these kinds of non-profit, high-technical expertise, open-access videos at scale.

Once you fix recordings for recorded classes, you can start recording more classes. Only a small fraction of classrooms have an auto-capture system, which is insanely expensive (on the order of tens of thousands of dollars per room). If we can simply plug in an iPhone on a tripod in the back of each classroom, we can record lectures in 1080p, easily maintain them, and automatically stream them. If you buy used, slightly damaged iPhones (i.e. cracked screens), they'll work fine for recording and dissuade stealing.

If professors and TAs want to be compensated for their work, donation links on each class, payment for a "certificate", and nonprofit grants provide classic low-hanging fruit -- but we can incentivize people far better long-term by creating a culture where people who engage with open learning are rewarded and recognized publicly.

## What does this do?

It turns out that this has massive chain effects that we only unlock at scale. Imagine a database that searches all MIT lecture notes for a certain topic, to get a higher quality first principles understanding than Wikipedia or random web pages. Simply adding search on college course notes would be the best way to learn anything (and generative AI trained on the the most advanced notes for topics without even textbooks, will turbocharge understanding).

The best classes will have time-aligned lecture subtitles (for accessibility and ease), official lecture notes, unofficial lecture notes, homeworks, solutions, exams, and exam solutions, but getting there will happen in stages.

## Master plan

1. Directories: Release a directory with links to all existing classes materials, like a html page linking to existing complete course websites, up-to-date edX links, and student-uploaded materials. We've already started this at [mitsoul.org/courses](https://mitsoul.org/courses/), where anyone can [add a GitHub PR](https://github.com/Divide-By-0/mitsoul.github.io/tree/main/docs/courses/mit) to add a class link.

2. Fast Open Sourcing: Release as many courses' materials as possible, starting with advanced courses where accurate info is hard to find online. Ensuring completeness or videos is less of a concern, than just open sourcing as many materials or course notes as possible. Materials are automatically sorted and uploaded from existing professor courses, and they can edit anytime. This is the mission of [coursetexts.org](https://coursetexts.org).

3. Good Open Sourcing: Invest in longer-term goals of releasing realistically learnable, well organized class materials -- ideally with videos at scale with AI editing to make them compliant, high quality lecture notes (that we pay student notetakers for if they don't exist), and automatically fixed copyrighted material. This requires more time, and is the medium to long term vision of [mitsoul.org](https://mitsoul.org), for which we are starting with an end to end econ undergrad and grad curriculum for at MIT.

Once this succeeds at a small scale, we hope it can help galvanize a self-sustaining community that operates to continue and expand this legacy. A non-profit is critical to keep it open access, and we think a small team of core operators is the most efficient structure. Our success metric is not number of students served like most MOOCs, but something more like counterfactual increase in research published or companies founded after students studied that class, which is a harder metric to game.

## Updates as of Nov 2024

We have made significant progress on all of the above, and are continuing to make active progress.

**Coursetexts Updates**: We received written consent from Harvard and Canvas to do our work here. With consent from professors, we open sourced 15 courses for ~$6K, a rate ~500x more efficient than MIT OCW, via custom tooling that (legally) scrapes Canvas classes + AI processing of materials. We intend to take that cost to 0. In case folks want to help support us, money is the biggest blocker right now. Donations are 501c3 tax deductible + take 1 minute: https://hcb.hackclub.com/donations/start/coursetexts

**MIT SOUL Updates**: We are about halfway through the process to open source a [full MIT undergrad econ curriculum](https://mitsoul.org/courses/mit/course-14/). We received permission from MIT OCW and the administration to operate, which required 3-6 months of legal battles to restore professors the right to own their own content, which MIT legal quietly took for themselves last year. We have also [open sourced several tools](https://github.com/orgs/mitsoul/repositories) that we use in-house for state of the art selective video blurring, lecture video processing scripts for camera angles and brightness, and transcribers to flag content for professors to review. We had earlier listed and classified 50+ MIT primarily non-OCW classes on our directory at [mitsoul.org](https://mitsoul.org), but this isn't a priority.

*This manifesto was originally written 2 years ago, was updated as of March 2024, and is still an in-progress document! These projects are joint work with Ashay, Selena, and Raffi. Thank you to the Internet Archive for offering to backup all of our work.*
