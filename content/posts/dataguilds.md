
The current model of how personal data flows through the internet is that companies like Google, Meta, and Amazon glean a set of data about you based on your interactions with them and then uses the data to sell targeted ad campaigns. But there’s a fast-emerging alternative: the zero-knowledge sovereign model of data, where you log your data locally and can then selectively release proofs about that data. This allows for novel, less user-hostile approaches.

One idea is for users to just sell their data directly to advertisers. (This is the model used by the Brave browser, where users opt into ads in exchange for a cut of advertising fees.) In practice, though, the value an individual user can capture this way is fairly insignificant, on the order of ten dollars a month; the companies that make billions off ads do so by aggregating data from huge user bases. And if you send your data to an advertiser, then they can build a profile on you over time anyway, so you’re not actually that anonymous.

So let’s introduce an intermediate layer: the *data guild*. Under this system, instead of users providing or proving information about themselves directly to the advertiser, they can instead privately prove they’re part of a group that in aggregate has characteristics an advertiser is interested in. That way, their individual data goes neither to the platform nor the advertiser.

One basic model for how this would work is: users sign up for a social platform and generate logs of their activity on the platform: who and what they interact with, which ads they linger on or click. These logs are generated locally but are securely signed by the platform to guarantee their legitimacy (otherwise, users could just make up fake logs). Then, a group of users who have signed up for a particular guild combine their data together and publish an aggregate ZK proof to advertisers, saying, for example, “Our average clickthrough-to-purchase rate on ads similar to yours is at least x%” or “80% of our members have interest vectors within epsilon of the interest vector you’re targeting.”

## Why is this promising?

### **Reason 1: Privacy.**

Only anonymized, aggregate information about users’ interests and characteristics flows to advertisers.

### **Reason 2: Value sharing.**

It’s possible to just split the payout evenly among all users in the guild (or split it proportionally according to how many ads each person has viewed or clicked on), but the guild structure provides a natural way to pool funds from advertising payouts into some public or club good relevant to the group – for instance, a community insurance pool. Amounts of money that would be relatively insignificant if paid out to individuals can go farther if a group can use them to fund collective purchases that would otherwise have been difficult to coordinate.

The administration of these pools of ad dollars can be composed with other governance systems as well, like DAOs or ZK voting.

### **Reason 3: Permissionlessness.**

If you don’t like how a social platform handles your data, it’s difficult to unilaterally leave. But if you don’t like how a guild handles your data, your network membership is decoupled from the data processing, so you can just switch. Users can preferentially select guilds that give them governance rights, guarantee high degrees of privacy, and spend funds on goods of use to them.

## ****************************Design choices and tradeoffs****************************

### How homogenous the guilds should be

One approach is to form a guild with people who are very similar to you. There are two substantial benefits to this: first, the guild is more valuable to advertisers because you’ve basically already done most of the legwork of ad targeting by self-selecting; and second, given that your preferences are similar, there’s a wider space of potential uses for guild funds that would be considered public goods within the context of the guild, in that they would provide value to most or all members of the group.

The tradeoff is that users have less choice among guilds (since there are fewer possible options for a given user to fit into) and less privacy from the advertiser (since they then learn that you’re approximately within some well-specified target group).

### How to form guilds

Some guilds might naturally arise from existing interest groups, like physical regions, DAOs, or the subscriber base of an online creator. Other guilds could be more generic. There’s not an obvious reason users couldn’t belong to multiple guilds, perhaps toggling or randomly distributing which guilds their ads originate from. And groups with niche or non-obvious characteristics in common could benefit from a discovery mechanism built on top of the guild system.

### How to serve ads

For a sufficiently homogenous group, you could give everyone the same ads; for more heterogeneous groups, the guild will probably have to distribute ads internally in order for the targeting to be valuable enough.

### Privacy model between user and guild (recursive or no?)

One option is for guilds to generate recursive SNARKs that generate aggregate data without even the guild being able to view any user’s data. First user proves 1) that their vector was generated legitimately and 2) that the previous version of the model (public), with their vector added in (private), yields a new version of the model (public).

### Preventing bots

Requiring proof of unique humanity is one generic way to combat bots. Data guild systems can also just use clickthrough to purchase rate as the metric for payment, which removes the financial incentive for bot farms. (This would prevent the case where, e.g., the guild is paid based on how many ads you view or based on your platform activity, so users or guilds would be incentivized to generate fake logs.)

### Where to use it

It’ll be a hard sell to integrate data guilds into a large legacy platform; emerging social platforms or even entirely new ones are better positioned to integrate ZK. Data guilds can largely constitute their own layer; the only places a social platform would have to plug in are 1) providing attestations that user logs legitimately came from that platform, and 2) displaying the ads. Even those can be decoupled – for instance, the data users provide doesn’t have to be engagement with a particular platform; it could be [proof-carrying-data](https://pcd.team/) from anywhere. Or you could bypass the need for 2) by implementing an AdBlock-like extension that blocks all ads across the web except those that pay out to your guilds.

There are also applications beyond advertising. One is market research – prove facts about your general demographics without releasing any personal information. Another is pharmaceuticals, where it can be valuable for regulatory reasons to amalgamate data for small, highly targeted groups, like people with rare diseases, while keeping individual participants anonymous.

## Implementation

We'd be excited to give grants to folks exploring real applications of ZK for data privacy and to help provide resources on learning ZK programming and the most relevant tools needed to build this idea out! We can give a token grant for any attempt and a large grant for any success or prototype with continued development. If you're interested, we’re fielding proposals for applications of this technology, which can be sent to [aayushg@mit.edu](mailto:aayushg@mit.edu) before December 31, 2023.
