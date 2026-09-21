# Publishing LeetLog

Two separate jobs: getting the extension onto your own machines, and putting
it on the Chrome Web Store.

---

## 1. Sideloading to another device

Unzip anywhere, then in Chrome:

1. `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. **Load unpacked** → select the folder

### Pin the extension ID first, or sync won't work

An unpacked extension's ID is derived from its **folder path**, and
`chrome.storage.sync` is keyed per extension ID. A different path on the other
machine means a different ID, which means a separate sync bucket — your drafts
and revisit dates will not cross over.

Fix it once by pinning the ID:

```bash
# 1. chrome://extensions → "Pack extension" → select the folder.
#    Produces leetlog.crx and leetlog.pem. Keep the .pem safe and never ship it.

# 2. Derive the public key:
openssl rsa -in leetlog.pem -pubout -outform DER | openssl base64 -A
```

Paste the output into `manifest.json` as a top-level key:

```json
{
  "manifest_version": 3,
  "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",
  "name": "LeetLog",
  ...
}
```

Every install of that manifest now has the same ID on every machine, and sync
flows between them. Use the **same `.pem`** for the store upload later if you
want to keep that ID.

### What does and doesn't travel

| | Travels between devices | Why |
|---|---|---|
| Drafts | Yes (`storage.sync`) | needs a pinned ID, 10s debounce, 12 most recent, under 4KB each |
| Revisit dates | Yes (`storage.sync`) | compact `{slug: date}` |
| Notes and solutions | Yes | they live in your GitHub repo |
| GitHub token | **No** (`storage.local`) | deliberate — sign in again on each device |
| Panel size, theme, toggles | No (`storage.local`) | per-machine preferences |

---

## 2. Publishing to the Chrome Web Store

### Before you upload

- **Zip with `manifest.json` at the root**, not nested inside a folder. This is
  the most common rejection.
- Exclude `.pem`, `.DS_Store`, `*.map`.
- Bump `"version"` in `manifest.json` for **every** upload or it is rejected.

### Steps

1. **Register** at
   [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole).
   One-time **$5** fee.
2. **Upload the zip** as a new item.
3. **Store listing**
   - Short description: max 132 characters (the manifest one is 87).
   - Detailed description, category **Developer Tools**, language.
   - **At least one screenshot**, 1280×800 or 640×400.
   - The 128px icon is already in `icons/`.
4. **Privacy tab** — the part that needs care for this extension:

   **Single purpose**
   > Write notes on LeetCode problems and commit them to the user's own GitHub
   > repository.

   **Permission justifications**

   | Permission | Justification |
   |---|---|
   | `storage` | Stores the user's notes, unsent drafts and settings locally |
   | `https://api.github.com/*` | Reads and writes note files in the user's own repository |
   | `https://github.com/*` | OAuth device-flow sign-in endpoints |
   | content script on `leetcode.com` | Shows the notes panel and reads the signed-in user's own problem and submission data |

   **Data disclosure** — declare **authentication information** (the GitHub
   token) and **user activity**. Certify that it is not sold and not used for
   anything unrelated to the single purpose.

   **Privacy policy URL — required**, because the extension handles
   authentication data. A markdown page in your repo is enough.

   **Remote code: No.** True — `marked` is bundled in `vendor/`. Answering yes
   triggers a much slower review.
5. **Submit for review.** First review usually takes a few days; updates are
   faster.

---

## 3. After it goes live

- Installing from the store uses the **store's ID**. Drafts and revisit dates
  from your unpacked copy do not carry over unless you shipped the same `key`.
- Users get updates automatically within a few hours of you publishing a new
  version.
- Sign in once per device; the token never syncs.

---

## 4. Things to know before submitting

**Your OAuth client ID ships in the bundle.** That is correct for device flow
and is not a secret — but anyone can extract it and run a sign-in that presents
itself as "LeetLog" on GitHub's authorize screen. This is the deliberate
tradeoff against the common alternative of shipping the client *secret*, which
is far worse. If it ever becomes a problem, regenerate the OAuth app.

**Device flow must stay enabled** on the OAuth app
(github.com/settings/developers), and **"Expire user access tokens" must stay
off** — refreshing an expired token needs the client secret, which this
extension deliberately does not have. Tick that box and every user is signed
out after 8 hours with no way to recover.

**The `repo` scope is broad.** It is the narrowest an OAuth App offers. To scope
access per repository, register a **GitHub App** instead with device flow
enabled and token expiry off; the extension code works unchanged.
