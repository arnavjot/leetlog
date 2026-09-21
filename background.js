import {
  getFile, saveFile, notePath, solutionPath, testConnection,
  getUser, createRepo, noteCommitDates, listNoteSlugs,
  branchExists, defaultBranch, deleteFile,
  computeStreak, localDateKey,
} from './github.js';
import { requestDeviceCode, pollForToken, signOut, isConfigured } from './auth.js';

const CONFIG_KEYS = ['ghToken', 'ghOwner', 'ghRepo', 'ghBranch', 'notesDir', 'solutionsDir'];

async function loadConfig() {
  const data = await chrome.storage.local.get(CONFIG_KEYS);
  if (!data.ghToken || !data.ghOwner || !data.ghRepo) return null;
  return {
    token: data.ghToken,
    owner: data.ghOwner,
    repo: data.ghRepo,
    branch: data.ghBranch || 'main',
    notesDir: data.notesDir || 'notes',
    solutionsDir: data.solutionsDir || 'solutions',
  };
}

async function loadToken() {
  const { ghToken } = await chrome.storage.local.get('ghToken');
  return ghToken ? { token: ghToken } : null;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  handle(msg)
    .then(sendResponse)
    .catch(async (e) => sendResponse(await explain(e)));
  return true;
});

async function explain(e) {
  const message = e?.message || String(e);

  if (/auth failed|bad credentials|401/i.test(message)) {
    return { error: 'GitHub sign-in expired — sign in again in settings', authFailed: true };
  }

  if (/not found|404/i.test(message)) {
    const config = await loadConfig();
    if (config) {
      try {
        if (!(await branchExists(config, config.branch))) {
          const real = await defaultBranch(config);
          return {
            error: real
              ? `branch "${config.branch}" doesn't exist — this repo uses "${real}"`
              : `branch "${config.branch}" doesn't exist in ${config.owner}/${config.repo}`,
            badBranch: true,
          };
        }
      } catch {  }
    }
  }

  return { error: message };
}

async function handle(msg) {
  switch (msg.type) {
    case 'LOAD_NOTE': return loadNote(msg);
    case 'SAVE_NOTE': return saveNote(msg);
    case 'SAVE_SOLUTION': return saveSolution(msg);
    case 'REVISIT_LIST': return revisitList(msg.days);
    case 'LIST_NOTES': return listNotes();
    case 'DELETE_NOTE': return deleteNote(msg);
    case 'TEST_CONNECTION': return testConnection(msg.config);
    case 'OPEN_OPTIONS': chrome.runtime.openOptionsPage(); return { ok: true };

    case 'AUTH_STATUS': return authStatus();
    case 'AUTH_START': return authStart();
    case 'AUTH_POLL': return authPoll(msg.deviceCode);
    case 'AUTH_SIGNOUT': await signOut(); return { ok: true };

    case 'CREATE_REPO': return createRepoForUi(msg.name);
    case 'SET_REPO': return setRepo(msg);

    default: return { error: `unknown message type: ${msg.type}` };
  }
}

async function ghSignedIn() {
  const { ghToken } = await chrome.storage.local.get('ghToken');
  return !!ghToken;
}

async function unconfigured() {
  return { configured: false, signedIn: await ghSignedIn() };
}

async function loadNote(msg) {
  const config = await loadConfig();
  if (!config) return unconfigured();
  const path = notePath(config, msg.slug);
  const file = await getFile(config, path);
  const streak = await getStreak(false);
  return {
    configured: true,
    path,
    repo: `${config.owner}/${config.repo}`,
    streak: streak.streak,
    content: file ? file.content : '',
    sha: file ? file.sha : null,
  };
}

async function saveNote(msg) {
  const config = await loadConfig();
  if (!config) return unconfigured();
  const path = notePath(config, msg.slug);
  const message = `notes: ${msg.title || msg.slug}`;

  try {
    const sha = await saveFile(config, path, msg.content, msg.sha, message);
    const streak = await recordToday();
    await recordNoteDate(msg.slug);
    return { configured: true, sha, streak };
  } catch (e) {

    if (!/conflict|409|422/i.test(e.message)) throw e;
    const current = await getFile(config, path).catch(() => null);
    return { configured: true, conflict: true, sha: current ? current.sha : msg.sha };
  }
}

async function saveSolution(msg) {
  const config = await loadConfig();
  if (!config) return unconfigured();

  const path = solutionPath(config, msg.slug, msg.lang);
  const existing = await getFile(config, path);

  const message = `Solution code: ${msg.title || msg.slug}`;
  const sha = await saveFile(config, path, msg.code, existing?.sha, message);
  const streak = await recordToday();
  return { configured: true, path, sha, streak };
}

async function deleteNote(msg) {
  const config = await loadConfig();
  if (!config) return unconfigured();

  const path = notePath(config, msg.slug);
  const file = await getFile(config, path);
  if (!file) return { configured: true, deleted: false, reason: 'nothing committed yet' };

  await deleteFile(config, path, file.sha, `remove notes: ${msg.title || msg.slug}`);

  const dates = await readNoteDates();
  delete dates[msg.slug];
  await writeNoteDates(dates);

  return { configured: true, deleted: true, path };
}

const SYNC_ITEM_BUDGET = 7000;

async function readNoteDates() {
  const { noteDates } = await chrome.storage.sync.get('noteDates');
  if (noteDates) return noteDates;

  const legacy = (await chrome.storage.local.get('noteDates')).noteDates;
  if (!legacy) return {};
  const compact = {};
  for (const [slug, v] of Object.entries(legacy)) compact[slug] = v?.date ?? null;
  await chrome.storage.sync.set({ noteDates: compact });
  await chrome.storage.local.remove('noteDates');
  return compact;
}

async function writeNoteDates(dates) {
  let entries = Object.entries(dates);

  while (JSON.stringify(Object.fromEntries(entries)).length > SYNC_ITEM_BUDGET) {
    entries.sort((a, c) => String(c[1] ?? '').localeCompare(String(a[1] ?? '')));
    entries = entries.slice(1);
  }
  await chrome.storage.sync.set({ noteDates: Object.fromEntries(entries) });
}

async function recordNoteDate(slug) {
  if (!slug) return;
  const dates = await readNoteDates();
  dates[slug] = localDateKey(new Date());
  await writeNoteDates(dates);
}

async function seedNoteDates() {
  const config = await loadConfig();
  if (!config) return;

  try {
    const slugs = await listNoteSlugs(config);
    if (!slugs.length) return;

    const dates = await readNoteDates();
    let added = 0;

    for (const slug of slugs) {
      if (slug in dates) continue;
      dates[slug] = null;
      added++;
    }
    if (added) await writeNoteDates(dates);
  } catch {

  }
}

function slugTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

async function revisitList(days = 14) {
  await seedNoteDates();
  const entries = Object.entries(await readNoteDates());
  const today = Date.parse(`${localDateKey(new Date())}T00:00:00`);

  const title = slugTitle;

  const due = entries
    .map(([slug, date]) => {

      const age = date
        ? Math.round((today - Date.parse(`${date}T00:00:00`)) / 86400000)
        : null;
      return { slug, title: title(slug), date, days: age };
    })
    .filter((n) => n.days === null || n.days >= days)
    .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity));

  return { due, tracked: entries.length };
}

async function listNotes() {
  const config = await loadConfig();
  if (!config) return unconfigured();

  const slugs = await listNoteSlugs(config);
  const dates = await readNoteDates();

  const notes = slugs
    .map((slug) => ({ slug, title: slugTitle(slug), date: dates[slug] ?? null }))
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title));

  return {
    configured: true,
    notes,
    repo: `${config.owner}/${config.repo}`,
    branch: config.branch,
    notesDir: config.notesDir,
  };
}

async function authStatus() {
  const { ghToken, ghLogin, ghAvatar, ghAuthKind, ghOwner, ghRepo, ghBranch, notesDir, solutionsDir } =
    await chrome.storage.local.get(['ghToken', 'ghLogin', 'ghAvatar', 'ghAuthKind', ...CONFIG_KEYS]);

  return {
    clientIdMissing: !isConfigured(),
    signedIn: !!ghToken,
    login: ghLogin || null,
    avatar: ghAvatar || null,
    authKind: ghAuthKind || (ghToken ? 'token' : null),
    repo: ghOwner && ghRepo ? `${ghOwner}/${ghRepo}` : null,
    branch: ghBranch || 'main',
    notesDir: notesDir || 'notes',
    solutionsDir: solutionsDir || 'solutions',
  };
}

async function authStart() {
  if (!isConfigured()) {
    return { error: 'This build has no GitHub OAuth client id yet — see auth.js, or use a token under Advanced.' };
  }
  const d = await requestDeviceCode();
  return {
    deviceCode: d.device_code,
    userCode: d.user_code,
    verificationUri: d.verification_uri,
    interval: d.interval || 5,
    expiresIn: d.expires_in || 900,
  };
}

async function authPoll(deviceCode) {
  const res = await pollForToken(deviceCode);
  if (res.status !== 'token') return res;

  const user = await getUser({ token: res.token });
  await chrome.storage.local.set({
    ghToken: res.token,
    ghLogin: user.login,
    ghAvatar: user.avatar_url,
    ghAuthKind: 'oauth',
  });
  return { status: 'token', login: user.login, avatar: user.avatar_url };
}

async function createRepoForUi(name) {
  const config = await loadToken();
  if (!config) return { signedIn: false };
  const repo = await createRepo(config, name);
  await chrome.storage.local.set({
    ghOwner: repo.owner, ghRepo: repo.name, ghBranch: repo.default_branch,
  });
  return { signedIn: true, repo };
}

async function setRepo(msg) {
  await chrome.storage.local.set({
    ghOwner: msg.owner,
    ghRepo: msg.repo,
    ghBranch: msg.branch || 'main',
    notesDir: msg.notesDir || 'notes',
    solutionsDir: msg.solutionsDir || 'solutions',
  });

  await refreshStreakFromRepo();
  return { ok: true };
}

async function readDays() {
  const { streakDays } = await chrome.storage.local.get('streakDays');
  return Array.isArray(streakDays) ? streakDays : [];
}

async function writeDays(days) {
  const unique = [...new Set(days)].sort().slice(-400);
  await chrome.storage.local.set({ streakDays: unique });
  return computeStreak(unique);
}

async function recordToday() {
  const days = await readDays();
  return writeDays([...days, localDateKey(new Date())]);
}

async function refreshStreakFromRepo() {
  const config = await loadConfig();
  if (!config) return computeStreak(await readDays());
  try {
    const dates = await noteCommitDates(config);
    const merged = [...(await readDays()), ...dates];
    await chrome.storage.local.set({ streakSyncedOn: localDateKey(new Date()) });
    return await writeDays(merged);
  } catch {
    return computeStreak(await readDays());
  }
}

async function getStreak(force) {
  const { streakSyncedOn } = await chrome.storage.local.get('streakSyncedOn');
  const today = localDateKey(new Date());
  const streak = force || streakSyncedOn !== today
    ? await refreshStreakFromRepo()
    : computeStreak(await readDays());
  return { streak };
}
