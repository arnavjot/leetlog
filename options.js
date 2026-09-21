

const $ = (id) => document.getElementById(id);

const els = {

  enabledToggle: $('enabledToggle'),
  enabledHint: $('enabledHint'),
  askToggle: $('askToggle'),
  themeSelect: $('themeSelect'),
  askHint: $('askHint'),

  signedOut: $('signedOut'),
  signingIn: $('signingIn'),
  signedInBox: $('signedIn'),
  noClientId: $('noClientId'),
  signInBtn: $('signInBtn'),
  signOutBtn: $('signOutBtn'),
  cancelAuthBtn: $('cancelAuthBtn'),
  copyCodeBtn: $('copyCodeBtn'),
  openVerifyBtn: $('openVerifyBtn'),
  userCode: $('userCode'),
  authStatus: $('authStatus'),
  avatar: $('avatar'),
  loginName: $('loginName'),
  authKind: $('authKind'),
  repoNeededHint: $('repoNeededHint'),

  repoInput: $('repoInput'),
  repoHint: $('repoHint'),
  newRepoName: $('newRepoName'),
  createRepoBtn: $('createRepoBtn'),
  branch: $('branch'),
  notesDir: $('notesDir'),
  solutionsDir: $('solutionsDir'),

  token: $('token'),
  toggleToken: $('toggleToken'),
  owner: $('owner'),
  repo: $('repo'),
  saveBtn: $('saveBtn'),
  testBtn: $('testBtn'),
  status: $('status'),

  notesEmpty: $('notesEmpty'),
  notesBrowser: $('notesBrowser'),
  notesSearch: $('notesSearch'),
  notesList: $('notesList'),
  noteModalOverlay: $('noteModalOverlay'),
  noteModalTitle: $('noteModalTitle'),
  noteModalClose: $('noteModalClose'),
  noteModalLc: $('noteModalLc'),
  noteModalGh: $('noteModalGh'),
  noteModalBody: $('noteModalBody'),
};

const send = (msg) => chrome.runtime.sendMessage(msg);

const ICON_COPY = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"
  stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="5.5" width="8" height="9" rx="1.5"/>
  <path d="M10.5 3.5v-1a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1"/></svg>`;

const ICON_DONE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"
  stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5"/></svg>`;

els.copyCodeBtn.innerHTML = ICON_COPY;

function setStatus(el, kind, text) {
  el.className = `status ${kind || ''}`;
  el.innerHTML = `<span class="dot ${kind || ''}"></span><span></span>`;
  el.lastElementChild.textContent = text;
}

function showAuthScreen(which) {
  els.signedOut.classList.toggle('hidden', which !== 'out');
  els.signingIn.classList.toggle('hidden', which !== 'pending');
  els.signedInBox.classList.toggle('hidden', which !== 'in');
}

async function refreshAuth() {
  const s = await send({ type: 'AUTH_STATUS' });

  els.noClientId.classList.toggle('hidden', !s.clientIdMissing);
  els.signInBtn.disabled = s.clientIdMissing;

  els.branch.value = s.branch;
  els.notesDir.value = s.notesDir;
  els.solutionsDir.value = s.solutionsDir;

  if (s.signedIn) {
    showAuthScreen('in');
    els.loginName.textContent = s.login || 'connected';
    els.authKind.textContent = s.authKind === 'oauth' ? 'signed in with GitHub' : 'using a personal access token';
    if (s.avatar) els.avatar.src = s.avatar;
    els.avatar.classList.toggle('hidden', !s.avatar);
    els.repoNeededHint.classList.toggle('hidden', !!s.repo);
  } else {
    showAuthScreen('out');
  }

  const stored = await chrome.storage.local.get(['ghToken', 'ghOwner', 'ghRepo', 'ghAuthKind']);
  if (stored.ghAuthKind !== 'oauth' && stored.ghToken) els.token.value = stored.ghToken;
  els.owner.value = stored.ghOwner || '';
  els.repo.value = stored.ghRepo || '';
  if (stored.ghOwner && stored.ghRepo) {
    els.repoInput.value = `${stored.ghOwner}/${stored.ghRepo}`;
  }

  markClean();
  return s;
}

let polling = null;

els.signInBtn.addEventListener('click', async () => {
  els.signInBtn.disabled = true;
  const res = await send({ type: 'AUTH_START' });
  els.signInBtn.disabled = false;

  if (res.error) {
    setStatus(els.status, 'err', res.error);
    return;
  }

  els.userCode.textContent = res.userCode;
  showAuthScreen('pending');
  setStatus(els.authStatus, null, 'waiting for you to approve on GitHub…');

  try { await navigator.clipboard.writeText(res.userCode); } catch {  }

  els.openVerifyBtn.onclick = () => chrome.tabs.create({ url: res.verificationUri });
  els.copyCodeBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(res.userCode);
      els.copyCodeBtn.innerHTML = ICON_DONE;
      els.copyCodeBtn.classList.add('done');
      setTimeout(() => {
        els.copyCodeBtn.innerHTML = ICON_COPY;
        els.copyCodeBtn.classList.remove('done');
      }, 1200);
    } catch {
      setStatus(els.authStatus, 'err', 'copy blocked — type the code by hand');
    }
  };

  startPolling(res.deviceCode, res.interval, res.expiresIn);
});

function startPolling(deviceCode, interval, expiresIn) {
  stopPolling();
  const deadline = Date.now() + expiresIn * 1000;
  let wait = interval;

  const tick = async () => {
    if (Date.now() > deadline) {
      stopPolling();
      setStatus(els.authStatus, 'err', 'code expired — start again');
      return;
    }

    const res = await send({ type: 'AUTH_POLL', deviceCode });

    if (res.error) {
      stopPolling();
      setStatus(els.authStatus, 'err', res.error);
      showAuthScreen('out');
      return;
    }
    if (res.status === 'slow_down') {
      wait = res.interval;
    } else if (res.status === 'token') {
      stopPolling();
      setStatus(els.status, 'ok', `signed in as ${res.login}`);
      await refreshAuth();
      await loadNotes();
      return;
    }

    polling = setTimeout(tick, wait * 1000);
  };

  polling = setTimeout(tick, wait * 1000);
}

function stopPolling() {
  if (polling) clearTimeout(polling);
  polling = null;
}

els.cancelAuthBtn.addEventListener('click', () => {
  stopPolling();
  showAuthScreen('out');
});

els.signOutBtn.addEventListener('click', async () => {
  await send({ type: 'AUTH_SIGNOUT' });
  els.token.value = '';
  setStatus(els.status, null, 'signed out — notes already in GitHub stay there');
  await refreshAuth();
  await loadNotes();
});

function parseRepo(value) {
  const text = (value || '').trim();
  if (!text) return null;

  const ssh = text.match(/^git@github\.com:([^/\s]+)\/([^/\s]+?)(?:\.git)?$/i);
  if (ssh) return { owner: ssh[1], repo: ssh[2] };

  const url = text.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s?#]+?)(?:\.git)?(?:[/?#].*)?$/i);
  if (url) return { owner: url[1], repo: url[2] };

  const plain = text.match(/^([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?$/);
  if (plain) return { owner: plain[1], repo: plain[2] };

  return null;
}

els.repoInput.addEventListener('input', () => {
  const parsed = parseRepo(els.repoInput.value);

  if (!parsed) {
    els.owner.value = '';
    els.repo.value = '';
    els.repoHint.textContent = els.repoInput.value.trim()
      ? "doesn't look like a repo — try owner/repo"
      : 'owner/repo, or a full github.com link.';
    updateDirty();
    return;
  }

  els.owner.value = parsed.owner;
  els.repo.value = parsed.repo;
  els.repoHint.textContent = `${parsed.owner}/${parsed.repo} — press Save to use it`;
  updateDirty();
});

els.createRepoBtn.addEventListener('click', async () => {
  const name = els.newRepoName.value.trim();
  if (!name) {
    setStatus(els.status, 'err', 'name the repo first');
    return;
  }
  els.createRepoBtn.disabled = true;
  setStatus(els.status, null, 'creating…');
  const res = await send({ type: 'CREATE_REPO', name });
  els.createRepoBtn.disabled = false;

  if (res.error) {
    setStatus(els.status, 'err', res.error);
    return;
  }
  els.newRepoName.value = '';
  setStatus(els.status, 'ok', `created ${res.repo.full_name} — now your notes repo`);
  els.owner.value = res.repo.owner;
  els.repo.value = res.repo.name;
  els.branch.value = res.repo.default_branch || 'main';
  els.repoInput.value = res.repo.full_name;

  markClean();
});

async function saveRepo() {
  const owner = els.owner.value.trim();
  const repo = els.repo.value.trim();
  if (!owner || !repo) return false;

  const res = await send({
    type: 'SET_REPO',
    owner,
    repo,
    branch: els.branch.value.trim() || 'main',
    notesDir: els.notesDir.value.trim() || 'notes',
    solutionsDir: els.solutionsDir.value.trim() || 'solutions',
  });
  if (res.error) {
    setStatus(els.status, 'err', res.error);
    return false;
  }
  setStatus(els.status, 'ok', `notes go to ${owner}/${repo}/${els.notesDir.value.trim() || 'notes'}`);
  markClean();
  return true;
}

async function loadTheme() {
  const { theme } = await chrome.storage.local.get('theme');
  applyTheme(theme === 'light' ? 'light' : 'dark');
}

function applyTheme(theme) {
  els.themeSelect.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
}

els.themeSelect.addEventListener('change', async () => {
  const theme = els.themeSelect.value;
  await chrome.storage.local.set({ theme });
  applyTheme(theme);
});

async function loadEnabled() {
  const { enabled } = await chrome.storage.local.get('enabled');
  setEnabledUi(enabled !== false);
}

function setEnabledUi(on) {
  els.enabledToggle.checked = on;
  els.enabledHint.textContent = on
    ? 'on — appears on every problem page'
    : 'off — your notes stay in GitHub, the panel just stops showing';
}

els.enabledToggle.addEventListener('change', async () => {
  const on = els.enabledToggle.checked;
  await chrome.storage.local.set({ enabled: on });
  setEnabledUi(on);
});

async function loadAskSolutions() {
  const { askSolutions } = await chrome.storage.local.get('askSolutions');
  setAskUi(askSolutions !== false);
}

function setAskUi(on) {
  els.askToggle.checked = on;
  els.askHint.textContent = on
    ? 'on — asks after every Accepted, never commits on its own'
    : 'off — no prompt; you can still commit notes by hand';
}

els.askToggle.addEventListener('change', async () => {
  const on = els.askToggle.checked;
  await chrome.storage.local.set({ askSolutions: on });
  setAskUi(on);
});

els.toggleToken.addEventListener('click', () => {
  const hidden = els.token.type === 'password';
  els.token.type = hidden ? 'text' : 'password';
  els.toggleToken.textContent = hidden ? 'hide' : 'show';
});

let savedSnapshot = null;

function snapshot() {
  return JSON.stringify(readForm());
}

function markClean() {
  savedSnapshot = snapshot();
  updateDirty();
}

function updateDirty() {
  if (savedSnapshot === null) return;
  const form = readForm();
  const dirty = snapshot() !== savedSnapshot;
  const configured = !!(form.owner && form.repo);
  els.saveBtn.disabled = !dirty;

  els.saveBtn.textContent = !dirty && configured ? 'Saved' : 'Save';
}

for (const field of ['token', 'owner', 'repo', 'branch', 'notesDir', 'solutionsDir']) {
  els[field].addEventListener('input', updateDirty);
  els[field].addEventListener('change', updateDirty);
}

function readForm() {
  return {
    token: els.token.value.trim(),
    owner: els.owner.value.trim(),
    repo: els.repo.value.trim(),
    branch: els.branch.value.trim() || 'main',
    notesDir: els.notesDir.value.trim() || 'notes',
    solutionsDir: els.solutionsDir.value.trim() || 'solutions',
  };
}

els.testBtn.addEventListener('click', async () => {
  const form = readForm();

  const stored = await chrome.storage.local.get('ghToken');
  const config = { ...form, token: form.token || stored.ghToken };

  els.testBtn.disabled = true;
  setStatus(els.status, null, 'checking…');
  const res = await send({ type: 'TEST_CONNECTION', config });
  els.testBtn.disabled = false;
  setStatus(els.status, res.ok ? 'ok' : 'err', res.message || res.error);
});

els.saveBtn.addEventListener('click', async () => {
  const form = readForm();
  const stored = await chrome.storage.local.get('ghToken');
  const token = form.token || stored.ghToken;

  if (!token) {
    setStatus(els.status, 'err', 'sign in with GitHub, or paste a token under Advanced');
    return;
  }
  if (!form.owner || !form.repo) {
    setStatus(els.status, 'err', 'pick a repo first');
    return;
  }

  els.saveBtn.disabled = true;
  setStatus(els.status, null, 'checking…');
  const check = await send({ type: 'TEST_CONNECTION', config: { ...form, token } });

  if (!check.ok) {
    updateDirty();
    setStatus(els.status, 'err', check.message || check.error);
    return;
  }

  if (form.token) {
    await chrome.storage.local.set({ ghToken: form.token, ghAuthKind: 'token', ghLogin: null, ghAvatar: null });
  }
  await saveRepo();

  setStatus(els.status, 'ok', `saved — ${check.message}`);
  await refreshAuth();
  await loadNotes();
});

let allNotes = [];
let notesRepoInfo = null;

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const CODE_KEYWORDS = new Set([
  'if', 'else', 'elif', 'for', 'while', 'do', 'switch', 'case', 'default',
  'break', 'continue', 'return', 'yield', 'pass', 'goto',
  'class', 'struct', 'enum', 'interface', 'namespace', 'template', 'typename',
  'def', 'fn', 'func', 'function', 'lambda', 'end',
  'var', 'let', 'const', 'auto', 'static', 'final', 'mut', 'val',
  'public', 'private', 'protected', 'override', 'virtual', 'abstract',
  'new', 'delete', 'this', 'self', 'super', 'nil', 'null', 'None',
  'true', 'false', 'True', 'False',
  'try', 'catch', 'except', 'finally', 'throw', 'raise', 'with',
  'import', 'from', 'using', 'include', 'package', 'require', 'as',
  'in', 'is', 'not', 'and', 'or', 'async', 'await', 'impl', 'pub', 'match',
  'int', 'long', 'short', 'double', 'float', 'bool', 'boolean', 'char',
  'string', 'str', 'void', 'unsigned', 'size_t', 'vector', 'unordered_map',
  'unordered_set', 'map', 'set', 'pair', 'deque', 'queue', 'stack',
  'List', 'Optional', 'sizeof', 'typedef', 'extern', 'inline',
]);

function highlight(code) {
  const pattern = new RegExp([
    /\/\*[\s\S]*?\*\//.source,
    /\/\/[^\n]*/.source,
    /#[^\n]*/.source,
    /"(?:\\.|[^"\\])*"/.source,
    /'(?:\\.|[^'\\])*'/.source,
    /`(?:\\.|[^`\\])*`/.source,
    /\b\d[\d_]*(?:\.\d+)?\b/.source,
    /[A-Za-z_]\w*/.source,
  ].join('|'), 'g');

  let out = '';
  let last = 0;

  for (const m of code.matchAll(pattern)) {
    const text = m[0];
    out += escapeHtml(code.slice(last, m.index));
    last = m.index + text.length;

    let cls = '';
    if (text.startsWith('//') || text.startsWith('/*') || text.startsWith('#')) cls = 'com';
    else if (/^["'`]/.test(text)) cls = 'str';
    else if (/^\d/.test(text)) cls = 'num';
    else if (CODE_KEYWORDS.has(text)) cls = 'kw';
    else if (code[last] === '(') cls = 'fn';

    out += cls ? `<span class="t-${cls}">${escapeHtml(text)}</span>` : escapeHtml(text);
  }

  return out + escapeHtml(code.slice(last));
}

let markedReady = false;

function configureMarked(md) {
  if (markedReady) return;
  md.use({
    gfm: true,
    breaks: true,
    renderer: {
      code({ text, lang }) {
        const label = (lang || '').split(/\s+/)[0];
        return `<pre><code>${highlight(text)}</code></pre>`
          .replace('<pre>', label ? `<pre data-lang="${escapeHtml(label)}">` : '<pre>');
      },
      link({ href, title, tokens }) {
        const body = this.parser.parseInline(tokens);
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return `<a href="${escapeHtml(href)}"${t} target="_blank" rel="noreferrer">${body}</a>`;
      },
      html({ text }) {
        return escapeHtml(text);
      },
    },
  });
  markedReady = true;
}

function markdownToHtml(source) {
  const md = window.marked;
  if (!md || typeof md.parse !== 'function') {
    return `<pre><code>${escapeHtml(source)}</code></pre>`;
  }
  try {
    configureMarked(md);
    return md.parse(source);
  } catch {
    return `<p>${escapeHtml(source)}</p>`;
  }
}

function ageLabel(date) {
  if (!date) return '';
  const days = Math.round((Date.now() - Date.parse(`${date}T00:00:00`)) / 86400000);
  if (days <= 0) return 'today';
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function renderNotesList() {
  const q = els.notesSearch.value.trim().toLowerCase();
  const filtered = q
    ? allNotes.filter((n) => n.title.toLowerCase().includes(q) || n.slug.includes(q))
    : allNotes;

  els.notesList.innerHTML = '';

  if (!allNotes.length) {
    els.notesList.innerHTML = `<div class="notes-msg">no notes committed yet — write one on any LeetCode problem page.</div>`;
    return;
  }
  if (!filtered.length) {
    els.notesList.innerHTML = `<div class="notes-msg">no notes match "${escapeHtml(els.notesSearch.value.trim())}".</div>`;
    return;
  }

  for (const note of filtered) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'note-row';
    row.dataset.slug = note.slug;

    const title = document.createElement('span');
    title.className = 'note-title';
    title.textContent = note.title;

    const date = document.createElement('span');
    date.className = 'note-date';
    date.textContent = ageLabel(note.date);

    row.append(title, date);
    els.notesList.appendChild(row);
  }
}

async function loadNotes() {
  const res = await send({ type: 'LIST_NOTES' });

  if (!res.configured) {
    els.notesEmpty.textContent = res.signedIn
      ? 'pick or create a repo above to see your notes here.'
      : 'sign in with GitHub above to see your notes here.';
    els.notesEmpty.classList.remove('hidden');
    els.notesBrowser.classList.add('hidden');
    allNotes = [];
    notesRepoInfo = null;
    return;
  }

  els.notesEmpty.classList.add('hidden');
  els.notesBrowser.classList.remove('hidden');
  allNotes = res.notes || [];
  notesRepoInfo = { repo: res.repo, branch: res.branch, notesDir: res.notesDir };
  renderNotesList();
}

function closeNoteModal() {
  els.noteModalOverlay.classList.add('hidden');
}

async function openNoteModal(slug, title) {
  els.noteModalTitle.textContent = title;
  els.noteModalLc.href = `https://leetcode.com/problems/${slug}/`;
  els.noteModalGh.href = notesRepoInfo
    ? `https://github.com/${notesRepoInfo.repo}/blob/${notesRepoInfo.branch}/${notesRepoInfo.notesDir}/${slug}.md`
    : '#';
  els.noteModalBody.innerHTML = '<p class="notes-msg">loading…</p>';
  els.noteModalOverlay.classList.remove('hidden');

  const res = await send({ type: 'LOAD_NOTE', slug });
  if (res.error) {
    els.noteModalBody.innerHTML = `<p class="notes-msg">${escapeHtml(res.error)}</p>`;
    return;
  }
  els.noteModalBody.innerHTML = res.content?.trim()
    ? markdownToHtml(res.content)
    : '<p class="notes-msg">this note is empty.</p>';
}

els.notesSearch.addEventListener('input', renderNotesList);

els.notesList.addEventListener('click', (e) => {
  const row = e.target.closest('.note-row');
  if (!row) return;
  const note = allNotes.find((n) => n.slug === row.dataset.slug);
  if (note) openNoteModal(note.slug, note.title);
});

els.noteModalClose.addEventListener('click', closeNoteModal);
els.noteModalOverlay.addEventListener('click', (e) => {
  if (e.target === els.noteModalOverlay) closeNoteModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !els.noteModalOverlay.classList.contains('hidden')) closeNoteModal();
});

(async function init() {
  await loadTheme();
  await loadEnabled();
  await loadAskSolutions();
  await refreshAuth();
  await loadNotes();
})();
