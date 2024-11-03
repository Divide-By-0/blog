---
title: "Thoughts for Curious Rabbit-holers Like Me [Live Post]"
date: 2024-11-03T22:12:03.284Z
type: posts
draft: false
slug: "thoughts"
category: "15 min read"
tags: ["thoughts", "musings"]
description: "Takeaways from rabbit holes I've dived into, articles I've read, or videos I've watched. Actually a way to make concrete my takeaways from late night binging."
aliases:  
  - /posts/thoughts
  - /thoughts
---

It's really hard to maintain any long-term takeaways from the content I read, and I find it useful to explain exactly how my thoughts and opinions change over time, to hold me to specific updates in opinions, to allow others to check and correct my understanding, and to invite conversation on topics that I'm interested in.

## Nov 2024

### Sleep Tools

I'm not as excited about [Elemind and Stimscience](https://www.wsj.com/podcasts/tech-news-briefing/wearable-tech-that-could-help-you-sleep-better/e0933b45-b850-4d5a-98d9-a64ea73aaf5f) due to the reliance on EEG and poor study endpoints. I get to sleep in 10 min (according to my Oura) so Elemind wouldn't help. Stimscience testing 'sleeping longer' seems useless to me, why not just... set ur alarm 20 min later? I'm not convinced Lumos is better for timezone transfer than adjusting your meal schedule a day or two ahead of time.

Personally I'm much more excited about people hacking the colmi r02 (https://github.com/tahnok/colmi_r02_client), a $20 Oura clone, to replicate Oura's platform open source (and therefore give real time sleep help + accurate lucid dreaming cues without brain reading needed). I'm cautiously optimistic on remspace showing two way within-dream communication, and still unsure if prophetic is promising (I think meditation is probably better for lucid dreaming than their focused ultrasound technique which seems oddly forceful).

### Blogging Tools

I really want a simple AI tool to automatically summarize my blog + Github's diff over the last month then make a draft update for all my subscribers. I just made a [simple script to get the commit names off an org](https://gist.github.com/Divide-By-0/c27819bd530b441445285818b5a5be2c) -- I can modify this to get all commits from my Github account, then use AI to summarize both the messages and diffs and see which is better.

## Oct 2024

### DEFCON Talks

I really want to go here next year. Till then, here's the crazy cool stuff I saw and what I thought:

- [Samy Kamkar on Keystroke Tracking via Lasers](https://www.youtube.com/watch?v=R5nMqju6crY) - I've seen various flavors of side channel attacks before, but this is the longest-range one I've seen so far. Insanely cool both breakdown of his personal journey through getting deeper into hardware and physics from software, and all sorts of different remote reading exploits. Samy is one of the first people who made the impression on me ~10 years ago that hacking was incredibly creative, you can do really cool things open source, and you can just sort of have fun as your job and it's fine. It's awesome that every year he puts out bangers. I was also excited that it's possible to transition from software/hacking to hardware/physics, even after all the cool software then hardware things I want to do :) He also lists a bunch of dope ideas like being able to automatically detect the iphone LIDAR infrared grid then emit a sound when a picture is being taken -- what a nerdsnipe, would love to hack on that or see someone else do it.

- [Joseph Cox on FBI Encrypted Phone Tapping](https://www.youtube.com/watch?v=uFyk5UOyNqI) - Joseph is one of the best tech journalists, is totally independent, and very good at finding information that seems impossible to get. This breakdown of how the FBI tapped what seemed like a legitimate anonymous phone company through and through, was super scary and well reported on.

### https://ground.news/

Interesting news site that shows how often the headline topic appears on left vs right news websites.

### Long Covid

I met a few folks with long covid, and dug a bit through Reddit to see why, to figure out what to prioritize for myself. It seems that not resting during infection ([empirical notes](https://www.reddit.com/r/LongCovid/comments/19de0qf/what_do_you_wish_you_did_to_avoid_long_covid/), [research paper](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10502447/)) increased odds for having long COVID empirically. It seems vaccines (by around ~40-50%), [consistent sleep](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10502447/) and [Vitamin D supplementation](https://pubmed.ncbi.nlm.nih.gov/35166850/) helps decrease long covid occurrence rate, which luckily I already mostly do.

## Sep 2024

### Lucid Dreaming

The rabbit hole is deep here, but I was curious about the current state of lucid dream science. I've been able to only lucid dream about 5 times, via dream journal every morning I can remember my dream for, and a simple lucidity tests of finger-through-palm that's easy for me to do during the day. I met someone once who meditates for an hour every day and lucid dreams every night, and now he *meditates in his lucid dreams*.

It seems the best meta-review here is this paper: https://www.tesble.com/10.1016/j.concog.2012.07.003 - it discusses basically every lucid dreaming mechanism and analyzes all the literature for it. Light pulses and [WILD](https://www.reddit.com/r/LucidDreaming/comments/trz9z/beginners_wild_method_adjustments_tricks_and_tips/) is really good, and volume-increasing sounds are also pretty good. It also shows there were a bunch of methodology errors in the studies (i.e. [WBTB](https://www.reddit.com/r/LucidDreaming/comments/28x5fj/how_to_wbtb/) is most effective in the mornings, but many studies don't take this into account for other methods).

Given that light/sound does so well, one can imagine that you can personally reproduce this via real time REM detection devices with APIs. It seems the only real time REM detection device I could find was this $1500 uncomfortable EEG style headset (called the zmax) that comes with a real time API hooked up to a pulsing light (that people on Reddit seem to think [does] [sort of](https://www.reddit.com/r/LucidDreaming/comments/guqeqa/comment/kqax757/) [work](https://www.reddit.com/r/LucidDreaming/comments/14jfxmw/comment/jpm9gwt) at least for the short term) and you can program it which is pretty nice. Ideally you could [hijack the Ultrahuman ring](https://www.reddit.com/r/Ultrahuman/comments/1fa2aqk/real_time_api_availability_in_order_to_induce/) or [Oura ring to get real time REM sleep pings](https://www.reddit.com/r/ouraring/comments/ds88f4/real_time_data/) but I don't think it's really possible right now. The Eight Sleep mattress signals, unlike the rings, does claim to real-time modify mattress temperature from sleep stage — unfortunately reverse engineering the mattress [1](https://github.com/lukas-clarke/eight_sleep), [2](https://github.com/bobobo1618/ninesleep) only gives you control of changing the mattress state, not reading sleep stages in real-time, though [the CEO seems open to custom mods](https://www.reddit.com/r/EightSleep/comments/1f7481h/comment/ll6ln1m/). Finally, you can theoretically detect REM sleep decently with microphones or with CV: https://github.com/lucidcode/Halovision-INSPEC -- which seems to have anecdotally worked for the creator.

I think you don't need fancy/expensive tech like fNIRS or [tFUS](https://www.prophetic.com/technology) -- it seems that there's still a lot of unfinished research on simpler triggers that combine light/sound/temperature, and that direction seems more mass marketable anyways. It's fun to build these short term hacks for the young, but it's interesting that the only consistent people to do this long-term are meditation masters.

## May 2024

- Recently got a sore throat/fever for a few days just after having 4 drinks in one night, vs having just sips for basically two years consecutively beforehand (the bar was really good). Apparently alcohol disables your immune system for 24 hours, so I'm guessing that + sleeping with the window open was a bad combination. I wonder if there's something I could have done (electrolytes?) to reverse this...
- Nardwaur is the absolutely most legendary interviewer of all time -- it seems a lot of the people he interviews consistently ask, "how did you know that"? He's unashamedly himself, and his methods are fascinating. [His TED talk is fun](https://www.youtube.com/watch?v=HkSUazeI2nM) and his actual hip-hop interviews are for sure worth watching.

## April 2024

- Do people care that Blind is not that anonymous? Seems [Business Insider does](https://www.businessinsider.com/blind-how-does-it-work-anonymous-workplace-app-2022-11#:~:text=Blind%20says%20that%20users'%20email,asked%20to%20provide%20this%20information.), and a number of threads (i.e. [1](https://www.reddit.com/r/cscareerquestions/comments/cndqzt/signing_up_for_blind_using_work_email/)) on Reddit where people are either scared of sysadmins seeing the Blind invite email, or sysadmins themselves saying it's unsafe.
- https://www.talentmobility.fund/ -- I've been convinced that a fund or VC firm focused on O1 visas and high talent immigration would be a pretty high leverage advantage (probably since all the best zk email contributors are international) -- glad to see it exists! Wonder if there's a version of this for people who aren't invested to by the fund.
- Getting PR previews on external PRs is really good for velocity of an OSS project, where you don't need any sensitive .env vars to check if the PR preview works. You can get this via Github Pages + [this Action](https://github.com/marketplace/actions/deploy-pr-preview) + [this patch](https://github.com/orgs/community/discussions/25217) it seems; I've been quite annoyed by the lack of this in Vercel and Render.
- The Future of Bacteria Treatments and Probiotics: I had a great 1-hour session with Adil discussing the competitiveness of different bacteria in our bodies, in the context of Lactaid and Bactose. It turns out that most of these ingested probiotics/bacteria/enzymes don't actually work that well because your body switches between highly acidic and highly basic states in the digestive system to neutralize anything that might kill you, which inevitably kills or denatures most enzymes before they can reach your gut. So it's easier to neutralize lactose outside the body, which is why food mixed with Lactaid is actually probably much better than having a pill. This is also why mouth bacteria like Lantern Bioworks might work much better than most probiotics. Even if these bacteria were to reach the gut, say via anal insertion or a robust casing (which lactose pills do not have), they would then still face competition from the antifragile equilibrium of your gut bacterium, that have been honed over years to resist any sort of strain in any direction. So most likely, they would be outcompeted and die quite fast. One interesting way around this might be to insert your desired plasmids into existing bacterial strains from inside a person's body instead of E. Coli, which might potentially be extremely destructive -- so they perform both the original duty of the original bacteria and the new duty of the new plasmid, thus being more likely to keep equilibrium.
- [Colin and Samir Interview Mr Beast](https://youtu.be/4FRYox-sPP8?t=1409) - I found this video interesting for a few reasons. I thought 23:30-28:30 was quite interesting to me -- like even the best people in the world have to "prove" themselves in order to get creative control. I also found it interesting the information he doesn't reveal. Working in open-source makes me naturally high transparency, and of course someone like Mr Beast who has his whole life on video is super high transparency. But there's information he intentionally omits -- not just about future unreleased content, but about meetings with high profile people, or deals he's made in the past, or details of negotiations, or of parties that he turned down, or exact amounts of money (to avoid misconceptions about expendable wealth), or just generally future things that he doesn't want to create an inflated impression of.I think in adopting more of an open source or streamer mindset, I often forget that even with high transparency, there are things that are good to keep private. I also thought it was interesting how he says he learns from his ripoffs/copycats -- that kind of humility is great to have for my own projects too. I think the recursive self-improvement, even at the top is always fascinating to me as well.

## The Blue LED (Feb 2024)

This [Veritasium video](https://www.youtube.com/watch?v=AF8d72mA41M) on the creation of the blue LED is mind blowing -- it explains the physics of simple n/p semiconductors extremely well, it explains the cascading sequence of research and evolving thought super well, and it tells a really great story about the inventor getting royally screwed time and again by corporations. I was left both awestruck and inspired after this video.

## Wifi Cracking (Jan 2024)

In my recent exploration of the world of wifi hacking, I've realized that most tools use a pre-2018 way of thinking and make no sense. Here's a brief rundown of what I've learned:

- This [resource](https://github.com/risinek/esp32-wifi-penetration-tool/blob/master/doc/ATTACKS_THEORY.md) is a good overview of the handshake function; basically, you are trying to reverse a hash with a small set of preimages.
- Deauthentication is a common technique in Wifi hacking, but I didn't like it ethically. For instance, what happens to critical devices like pacemakers or IoT devices that might not reconnect after a quick drop?
  - Pwngatochi, a tool I've been experimenting with, has a non-deauth mode. By disabling `personality.assossciate` and `personality.deauth`, you can operate without deauthentication.
  - I thought it was cute that pwngatochi units can "talk" to each other when in close proximity, dividing available channels among them for optimal hacking. It's interesting that the tomagochi model is super prevalent in the hacking community; there's mini cat-shaped hashcat PCBs too.
  - Another tool, Wifi Hash Monster, also offers a non-deauth mode, as discussed in this [Reddit thread](https://www.reddit.com/r/pwnagotchi/comments/ocoq25/comment/h3x1h1g/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).
- Luckily, a vulnerability in the Robust Security Network allows for the exploitation of most wifi routers without de-auth! These routers assume secure passwords, so they expose the 'client-less PKMID attack', in which routers volunteer up their PMKID to unauthenticated users, enabling offline hash cracking without deauths.
  - This method is already used by Pwngatochi and can be enabled via silent mode on hcxdumptool. More details can be found [here](https://www.evilsocket.net/2019/02/13/Pwning-WiFi-networks-with-bettercap-and-the-PMKID-client-less-attack/) and [by the attack creator here](https://hashcat.net/forum/thread-7717.html).
  - None of the Macbook-friendly repos worked, including [pmkidcracker (no cracking functionality)](https://github.com/n0mi1k/pmkidcracker) and [WiFiBroot (relies on Linux-only ports)](https://github.com/hash3liZer/WiFiBroot).
- To get this working on my Mac, I had to disconnect from the connected Wifi network, then combine the first half of [the BetterCap tutorial (with en0 instead of wlan0)](https://www.evilsocket.net/2019/02/13/Pwning-WiFi-networks-with-bettercap-and-the-PMKID-client-less-attack/) with the [second half of this PMKID article](https://softwaretester.info/crack-wpa2-with-pmkid-on-macos/).
  - I ran into some issues in that [it didn't capture as many PMKIDs as I expected](https://github.com/bettercap/bettercap/issues/1076) -- I was under the impression that all networks just give this hash out?
  - The docker command needs to be replaced with this, since the path is a little off `$ docker run -ti --rm --mount src="$(pwd)/cap",target=/hcxpcaptool,type=bind slorenz/hcxpcaptool hcxpcaptool -o /hcxpcaptool/pmkid.16800 /hcxpcaptool/bettercap-wifi-handshakes.pcap`. This outputs the needed `pmkid.16800` file.
  - It turns out this .16800 filetype is deprecated in hashcat and has been replaced by a .22000 filetype, so I used [this online tool instead to give me a .22000](https://hashcat.net/cap2hashcat/) and trashed the entire docker flow. Oh well.
  - Once you have the hash, you then have to run hashcat. The article uses `'?l?l?l?l?l?lt!'` which is useless since no password will end in a `t!`. So instead, I recommend doing `'?d?d?d?d?d?d?d?d'` at the very least, which is 8 random characters. Unfortunately, $36^8$ combinations is 3 trillion, so that makes any local search infeasible (maybe times 3 for Capital Case and ALL CAPS modes, so 10T)? Letters (all lower, Cap Case, and UPPER modes) followed by numbers -- is upper bounded by the sum of the geometric series, or $\frac{26 ^ 8}{(1 - \frac{10}{26})} * 3 ~= 1T$ combinations.
    - An A100 can do about [4 million 22000-type hashes per second](https://gist.github.com/Chick3nman/d65bcd5c137626c0fcb05078bba9ca89), at the on-demand cost of $2/hour. So we are at about 14 billion per hour, 7 billion per dollar, which is substantially better. That makes the cost on the order of $500 for an 8 character password, which is still high but not infeasible.
    - Hashcat is really quite slow even locally on an M1; it takes about 8 minutes to hash the [63 million CrackStation 2010 human-leaked passwords](https://crackstation.net/crackstation-wordlist-password-cracking-dictionary.htm).
  - I wish there was a hashcat wifi-cracking list that took into account the WiFi name, and tried all lowercase/Capital Case iterations of that value with a few numbers and symbols after, since that seems like a common pattern. I wonder if you can train a simple algorithm (doesn't even need to be AI-based) on large crowdsourced SSID/password databases like [Instabridge](https://instabridge.com/) or [Wifi Space](https://wifispc.com/) to deduce similar rules/heuristics?
  - There's an annoying thing where most of the hcxtools don't actually work on Mac, even though there's a brew package, since they are made for Linux. So you have to make an ephemeral Linux Docker image to even run them [like this article](https://softwaretester.info/crack-wpa2-with-pmkid-on-macos/), which is honestly a pretty useful skill.
- Some fun wifi pranks: you can rickroll people by creating a bunch of networks with the lyrics of "Never Gonna Give You Up", like this [GitHub repository](https://github.com/Jeija/esp32free80211) does.

Of course, all of this information is for educational purposes only and only for responsible experimentation on networks you own.

## Screensavers (Jan 2024)

I think it's cool to have a Chromecast on a TV/projector in the background on ambient mode, streaming various photos from a Google Photos album to a TV. I set it up for my parents and grandparents, and it led them to remember a lot of fond memories. I wanted to also have videos for my own house, but with the Chromecast it requires [these adb commands](https://github.com/theothernt/AerialViews#chromecast-with-google-tv-users) and an external app ([1](https://play.google.com/store/apps/details?id=jp.dip.mukacho.picasadaydream), [2](https://play.google.com/store/apps/details?id=com.furnaghan.android.photoscreensaver)). [Folks say](https://www.reddit.com/r/googlephotos/comments/nmqhmk/google_photos_slideshow_with_videos/) it might work better with an Android TV enabled stick like Fire TV instead -- this setup will take me too long right now but I'm leaving this as a self-reminder for our new house.

## My Position on e/acc vs d/acc (Dec 2023)

Andreessen (e/acc) correctly notes that we are not optimistic enough on technology, and we let short term concerns slow down long term losses. At the same time, Vitalik (d/acc) is right that we need this acceleration deeply in places like medicine (i.e. 10 people dying in a trial is a tragedy but 100K people dying because of a delayed drug is a statistic), but just accelerating indiscriminately in the direction that tech and capitalism take us can be destructive. He argues (and I agree) that we really do need to invest in defensive technologies at the same time, especially against tech-progressive ideas that the rest of the world will struggle to catch up to. I think this divide is well demonstrated in biosecurity, nuclear weapons, fracking, biological weapons, and human reproductive innovation (["tech is not inevitable"](https://maxlangenkamp.me/posts/tech_not_inevitable)) -- where defensive policies and technology defense was critical for those fields to not decimate humans. Overall, I think you can be d/acc but still be accelerationist -- you just believe that explicit, non-capitalist incentives are needed to accelerate technology on the best possible paths by incentivizing additional arms of technology.

I think this dialogue mostly exists between powerful tech people and on Twitter, and the broader world will not know about it. However, it seems possible for the political divide to slightly shift for this dialogue to become one of the dominant qualities that lets you determine the rest of someone's stances. On a meta note, I am super hyped that Vitalik named d/acc defensive technology instead of deaccelerationism, to change the natural "foil" of e/acc to still be accelerationist but responsibly, thus still giving power to the best deaccelerationist counterarguments, bit without giving momentum to that likely destructive movement.

## How to Clone Github on a New Computer (Dec 2023)

I have had this problem an infinite number of times -- a new computer or ssh, and I need to clone a private repo. It's a massive pain to keep adding my ssh key to Github when all I want is a quick piece of software and I don't really care about Github security beyond a one time key.

You have to:
```
git clone https://<USERNAME>@github.com/<USERNAME>/<REPO>
```

Putting username@ and using https means it won't error to ask for an ssh key. It will then query for a password (either when you first clone or when you git push), and in all these scenarios, put in a [personal access token](https://docs-github-com.translate.goog/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) instead of your password. I generated said token a while ago for all my ssh machines, and saved it in my Bitwarden. It's super weird that this process is completely undocumented, and I had to cobble it together from a bunch of random posts and answers -- it is admittedly lower security but marginally faster and higher convenience.

## Audio Timestamping (Nov 2023)

Turns out theres a [50 Hz background hum from power mains in all audio](https://www.youtube.com/watch?v=e0elNU0iOMY) with minor fluctuations that can be mapped back to the original power grid in order to precisely timestamp video, which is really interesting. This has use in catching fake speedrunners, but I wonder if it can be used for audio watermarking as well.

## Ethics in Consent and Truth in Research (Sept 2023)

Research is based on the premise that the pursuit of truth is noble. Unfortunately, this directly contradicts different cultures, like when an [Indian tribe's blood was used for non-consenual research](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5310710/) to determine their origin (among other things), which went against their traditions and tribal knowledge, and resulted in decreased group cohesion. This study (and then Rick and Morty Season 7 Episode 4) both had me thinking about cases in which telling the trust was counterproductive or even disrespectful.

## UBI (Sept 2023)

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

## Bipartisan Climate Change (Aug 2023)

Anson has a documentary on this that I am very excited for. Given that optics seems to be more important for Republican lawmakers, I think that couching pro-climate legislation with benefits to workers and naming the bill after the benefits to the workers i.e. advocating for ev or solar development and promising new job offers from existing firms for those displaced workers seems useful. I think also that rebranding [meltdown-proof triso-based nuclear fuel](https://www.energy.gov/ne/articles/triso-particles-most-robust-nuclear-fuel-earth) as something like "supergas" would help avoid association with anti-nuclear sentiment due to meltdowns.

## Quail Eggs, Laundry Detergent, and EoE (Aug 2023)

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
