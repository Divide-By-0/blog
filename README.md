# How to Setup Your Own Blog Like This
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

Now, you can do `hugo serve` on the command line which will generate a /build folder. Making a project on Vercel and pointing it to your repo should just work.
