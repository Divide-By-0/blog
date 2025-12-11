# Aayush's Blog

Subscribe at [this Google Form](https://forms.gle/PLprvT8XA9VNB69q7).

## How to Setup Your Own Blog Like This

By yush_g and amir_g

Make a new, empty github repo called blog.

```
git clone https://github.com/Divide-By-0/blog
cd blog
git checkout 1dfed56d9f20e11c3614ffb328e6b5001b59c485
git set-url origin git@github.com:<YOUR_USERNAME>/blog.git
git checkout main
git reset --hard 1dfed56d9f20e11c3614ffb328e6b5001b59c485
git push origin main
```

Now, you can do `hugo serve` on the command line which will generate a /build folder. Making a project on [render.com](https://render.com) and pointing it to your repo should just work.

## External Link Posts

To create a post that redirects to an external URL:

1. Add `external_url: "https://example.com/post"` to your post's frontmatter
2. The post will automatically redirect to that URL when visited

Example:
```yaml
---
title: "External Post Title"
external_url: "https://example.com/post"
---
```

