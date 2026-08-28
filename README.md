# ASA at Texas State

This is the website for the Association for Statistics and Analytics at Texas
State University. We're a student org for anyone who likes working with data:
stats and analytics majors, but also people from other departments who do
research, or who just want to get better at this stuff.

The site is mostly for people who haven't joined yet. Four pages:

- `/` tells you what ASA is
- `/about` covers what we actually do, and how we relate to the department and
  to the national ASA
- `/membership` is who can join and the sign-up form
- `/events` has the meeting time, where it is, and a button to drop it in your
  calendar

It's live at https://sudeev157-afk.github.io/ASA-Website-TXST/

## How it's built

One Next.js app, all of it in [frontend/](frontend/). It builds to static files
and gets published to GitHub Pages every time we push to `main`, which is what
[.github/workflows/nextjs.yml](.github/workflows/nextjs.yml) does.

No backend, no database, no CMS. Meeting times and links live in small files
under `frontend/lib/`, so updating the site means editing code and pushing. That
was a deliberate tradeoff: a club site gets updated a few times a semester, and
running a CMS for that is more work than it saves.

If you want to know how the code is organized, that's in
[frontend/README.md](frontend/README.md).

## Who runs this

Sudip Bhandari and Bibesh Timalsina. We built it and we maintain it.

Club email: asatxst@gmail.com

## Contributions

We're not taking outside contributions, so please don't open pull requests. It's
a small site for one specific club and it's easier for the two of us to just
keep it in our heads.

If something on the live site is broken (dead link, wrong meeting time, anything
that doesn't work with a screen reader) we'd genuinely like to know. Email us at
the address above.

## If you want to copy it

Go ahead. If you're building a site for your own club and this is a useful
starting point, take it. It's [MIT licensed](LICENSE), so keep the license file
in whatever you ship, and credit us somewhere people can see it: a line in your
README, or in your site footer, naming Sudip Bhandari and Bibesh Timalsina and
linking back here.

Don't take our identity with it, though. The ASA seal and logos in
`frontend/public/`, the club name, and the Texas State connection aren't ours to
license to you. Use your own artwork and your own org's name.
