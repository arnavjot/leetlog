# LeetLog

Write your own notes on any LeetCode problem — approach, edge cases, what you
got wrong the first time — and commit them straight to a GitHub repo you own.
Not your solution code, your *thinking*. Versioned, searchable, yours.

## Install (unpacked, for now)

1. Download/unzip this folder.
2. Open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the `leetlog` folder.
5. Click the extension icon in your toolbar — it opens the settings page.

## Connect GitHub

Click the extension icon, then **Sign in with GitHub**. GitHub shows you an
8-character code, we open `github.com/login/device` for you, you approve,
done — then pick your repo from the dropdown (or hit **create private repo**).

There's no LeetLog server and no client secret in this bundle. That's why
sign-in uses GitHub's **device flow**: it's the one OAuth flow designed for
clients that can't keep a secret.

### If you're building this yourself

Sign-in is off until the build has an OAuth client id:

1. github.com/settings/developers → **New OAuth App** (any name; the callback
   URL is unused).
2. On the app's page, tick **Enable Device Flow** and save.
3. Paste the Client ID into `CLIENT_ID` in `auth.js`. It's public by design —
   safe to commit.

Prefer per-repository access? Register a **GitHub App** with device flow on
and *Expire user authorization tokens* off, and use its client id instead —
the code is the same, the user just picks repos when installing.

### Or skip sign-in

Under **Advanced** on the settings page you can still paste a fine-grained
personal access token (Contents: Read and write) with an owner and repo.

## Theme

**Theme** in settings is Light or Dark, and it applies to both the notes
panel and the settings page. Dark unless you pick otherwise. Changing it
re-themes open LeetCode tabs immediately.

## Turning it off

The settings page has a **Show the panel on LeetCode** switch at the top.
Off hides the panel on every problem page — open tabs included, no reload —
while leaving your account, repo and notes untouched. Turn it back on and
everything is where you left it.

## Streak

The chip in the panel header is your **LeetCode** streak — days in a row with
a submission, read from your own account via `leetcode.com/graphql` (the panel
runs on leetcode.com, so that call is same-origin and carries your session
cookie; nothing is scraped and no extra permission is needed). Amber once
today is done, grey while the run is alive but today isn't.

Note that LeetCode's API `streak` field is the year's *max* streak, not the
live one, so the current run is computed from the submission calendar itself,
in UTC days, the way LeetCode counts them. Max streak and active-days land in
the tooltip.

Separately, the settings page tracks the days you **committed a note**:
current / best / total and the last 14 days, rebuilt from the repo's commit
history once a day so it survives a reinstall.

## Committing solutions

When a submission comes back **Accepted**, the panel asks what to do with
the code — it never pushes on its own. Three answers:

- **Commit** writes `{solutions_dir}/{slug}.{ext}` with the exact code the
  judge ran, committed as `Solution code: {problem name}`.
- **Add to note** drops it into the note you're writing as a fenced code block
  instead, for when the solution is the thing worth writing about.
- **Not now** dismisses it.

The verdict and the code both come from LeetCode's own API, not from
anything scraped or intercepted: `questionSubmissionList` gives the latest
attempt on the problem and `submissionDetails` gives exactly what the judge
ran, plus runtime/memory percentiles. A submit signal (`page.js`) or the
result panel appearing only tells the panel *when* to look, and it retries
with backoff while the judge is still running.

Only submissions from the last five minutes count, so opening an old
problem never offers to commit its history. Turn the prompt off under
**Offer to commit accepted solutions** in settings.

## Inserting your code

**{ } Insert my code from the editor** drops whatever is currently in the
LeetCode editor into your note as a fenced code block, tagged with the
language, at the cursor position.

It reads Monaco's model rather than the page's HTML, because Monaco only
renders the lines you can see — scraping the DOM would silently truncate
long solutions. Monaco is only reachable from the page's own JS world, so
`page.js` runs there (`world: "MAIN"` in the manifest) and hands the code
back over `postMessage`.

## Use it

Open any problem on `leetcode.com/problems/...`. A small panel appears in
the bottom-right corner. Write whatever you want, hit **Commit note** (or
`Cmd/Ctrl + Enter`). It saves to `{owner}/{repo}/notes/{problem-slug}.md`.

Switching to another problem without a page reload — using LeetCode's own
"next problem" navigation — is handled; the panel reloads the right note
automatically.

## Where your data lives

Nowhere but your browser and your own GitHub repo. The token is stored in
`chrome.storage.local` (this browser only, not synced). Every request goes
straight from your browser to `api.github.com` — there's no server in
between.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension config (Manifest V3) |
| `content.js` | Injects the floating panel on problem pages |
| `page.js` | Runs in the page's JS world to read the Monaco editor |
| `background.js` | Service worker — talks to the GitHub API |
| `github.js` | GitHub API wrapper — contents, repos, commit history, streak math |
| `auth.js` | GitHub OAuth device flow (no client secret) |
| `options.html` / `options.js` | Settings / connect-GitHub page |
