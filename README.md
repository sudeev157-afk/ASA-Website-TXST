# ASA — Association for Statistics and Analytics, Texas State University

The official website of the **Association for Statistics and Analytics (ASA)** at
Texas State University — a student organization for anyone interested in
statistics, analytics, research, and working with data.

The site is where prospective and current members find out who we are, how to
join, and when we meet:

| Page | What it is for |
| --- | --- |
| `/` | The landing page — what ASA is, in one screen |
| `/about` | The club's purpose, and its relationship to Texas State and the national ASA |
| `/membership` | Who can join, what membership gets you, and the sign-up form |
| `/events` | Meeting time, place, cadence, and an add-to-calendar link |

**Live site:** https://sudeev157-afk.github.io/ASA-Website-TXST/

## How it is built

A single Next.js application in [frontend/](frontend/), shipped as a **static
export** — `next build` emits a plain `out/` folder of HTML, CSS, and JS with no
server behind it. Every push to `main` is built and published to GitHub Pages by
[.github/workflows/nextjs.yml](.github/workflows/nextjs.yml).

There is no backend, no database, and no CMS. Content lives in the components
and in a handful of small modules under `frontend/lib/` (meeting details, outbound
links), so updating the site means editing code and pushing.

For anything about the code itself — structure, conventions, how to run it
locally — see [frontend/README.md](frontend/README.md).

## Maintainers

Built and maintained by **Sudip Bhandari** and **Bibesh Timalsina** for the
Texas State University chapter of ASA.

Club contact: asatxst@gmail.com

## Contributions

**This project is closed to outside contributions.** We are not accepting pull
requests or feature issues from outside the maintainers — the site is a small,
opinionated piece of work for one specific student organization, and we would
rather keep it that way than manage it as an open project.

If you have found a genuine problem with the live site (a broken link, wrong
meeting information, an accessibility issue), email us at the address above
instead of opening a PR.

## Using this as a starting point

You are welcome to take the idea, the structure, or the code and build your own
club's site from it — **as long as you credit us.** The project is
[MIT licensed](LICENSE), so the terms are the familiar ones: do what you like
with it, keep the copyright notice and license text in what you ship.

In practice, crediting us means:

- Keep [LICENSE](LICENSE) intact in your copy.
- Say where it came from — a line in your own README, or a credit in your site's
  footer, naming Sudip Bhandari and Bibesh Timalsina and linking back to this
  repository.

What you should **not** carry over is our identity: the ASA seal and logos in
`frontend/public/`, the club name, and the Texas State association are ours and
are not covered by the code license. Swap in your own artwork and your own
organization's name.
