

const API = 'https://api.github.com';

function headers(config) {
  return {
    Authorization: `Bearer ${config.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function b64EncodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(escape(atob(str)));
}

const LANG_EXT = {
  python: 'py', python3: 'py', cpp: 'cpp', c: 'c', java: 'java',
  javascript: 'js', typescript: 'ts', csharp: 'cs', golang: 'go', go: 'go',
  kotlin: 'kt', swift: 'swift', ruby: 'rb', scala: 'scala', rust: 'rs',
  php: 'php', dart: 'dart', elixir: 'ex', erlang: 'erl', racket: 'rkt',
  mysql: 'sql', mssql: 'sql', oraclesql: 'sql', postgresql: 'sql', bash: 'sh',
};

export function solutionPath(config, slug, lang) {
  const dir = (config.solutionsDir || 'solutions').replace(/^\/+|\/+$/g, '');
  const ext = LANG_EXT[(lang || '').toLowerCase()] || 'txt';
  return `${dir}/${slug}.${ext}`;
}

export function notePath(config, slug) {
  const dir = (config.notesDir || 'notes').replace(/^\/+|\/+$/g, '');
  return `${dir}/${slug}.md`;
}

export async function getFile(config, path) {
  const url = `${API}/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(config.branch || 'main')}`;
  const res = await fetch(url, { headers: headers(config) });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await safeJson(res);
    throw new Error(describeError(res.status, body));
  }
  const data = await res.json();
  return {
    content: b64DecodeUnicode(data.content.replace(/\n/g, '')),
    sha: data.sha,
  };
}

export async function saveFile(config, path, content, sha, message) {
  const url = `${API}/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}`;
  const body = {
    message: message || `notes: ${path}`,
    content: b64EncodeUnicode(content),
    branch: config.branch || 'main',
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(config), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await safeJson(res);
    throw new Error(describeError(res.status, errBody));
  }
  const data = await res.json();
  return data.content.sha;
}

export async function testConnection(config) {
  if (!config.token || !config.owner || !config.repo) {
    return { ok: false, message: 'fill in every field first' };
  }
  try {
    const url = `${API}/repos/${config.owner}/${config.repo}`;
    const res = await fetch(url, { headers: headers(config) });
    if (res.status === 401) return { ok: false, message: 'token rejected — check it has repo access' };
    if (res.status === 404) return { ok: false, message: 'repo not found — check owner/repo spelling' };
    if (!res.ok) return { ok: false, message: `github said ${res.status}` };

    const data = await res.json();
    if (data.permissions && data.permissions.push === false) {
      return { ok: false, message: 'token can read this repo but not write to it' };
    }
    return { ok: true, message: `connected to ${data.full_name}` };
  } catch (e) {
    return { ok: false, message: 'network error — are you online?' };
  }
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

function describeError(status, body) {
  const msg = body && body.message ? body.message : '';
  if (status === 401) return `github auth failed (${msg || 'bad token'})`;
  if (status === 404) return `repo or file not found (${msg})`;
  if (status === 409) return `commit conflict — reload and try again`;
  return `github error ${status}${msg ? `: ${msg}` : ''}`;
}

export async function getUser(config) {
  const res = await fetch(`${API}/user`, { headers: headers(config) });
  if (!res.ok) throw new Error(describeError(res.status, await safeJson(res)));
  const data = await res.json();
  return { login: data.login, avatar_url: data.avatar_url };
}

export async function createRepo(config, name) {
  const res = await fetch(`${API}/user/repos`, {
    method: 'POST',
    headers: { ...headers(config), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      private: true,
      auto_init: true,
      description: 'LeetCode notes, written by me, committed by LeetLog.',
    }),
  });
  if (!res.ok) throw new Error(describeError(res.status, await safeJson(res)));
  const r = await res.json();
  return { full_name: r.full_name, owner: r.owner.login, name: r.name, default_branch: r.default_branch || 'main' };
}

export async function noteCommitDates(config, limit = 100) {
  const dir = (config.notesDir || 'notes').replace(/^\/+|\/+$/g, '');
  const url = `${API}/repos/${config.owner}/${config.repo}/commits?path=${encodePath(dir)}&sha=${encodeURIComponent(config.branch || 'main')}&per_page=${limit}`;
  const res = await fetch(url, { headers: headers(config) });
  if (res.status === 404 || res.status === 409) return [];
  if (!res.ok) throw new Error(describeError(res.status, await safeJson(res)));
  const data = await res.json();
  return data
    .map((c) => c.commit?.committer?.date || c.commit?.author?.date)
    .filter(Boolean)
    .map(localDateKey);
}

export function localDateKey(d) {
  const date = typeof d === 'string' ? new Date(d) : d;
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function computeStreak(dates) {
  const days = [...new Set(dates)].sort().reverse();
  if (!days.length) return { current: 0, best: 0, total: 0, lastDate: null };

  const dayMs = 86400000;
  const asTime = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d).getTime();
  };

  const today = asTime(localDateKey(new Date()));
  let current = 0;
  if (days[0] === localDateKey(new Date()) || asTime(days[0]) === today - dayMs) {
    current = 1;
    for (let i = 1; i < days.length; i++) {
      if (asTime(days[i - 1]) - asTime(days[i]) === dayMs) current++;
      else break;
    }
  }

  let best = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    run = asTime(days[i - 1]) - asTime(days[i]) === dayMs ? run + 1 : 1;
    if (run > best) best = run;
  }

  return { current, best: Math.max(best, current), total: days.length, lastDate: days[0] };
}

export async function listNoteSlugs(config) {
  const dir = (config.notesDir || 'notes').replace(/^\/+|\/+$/g, '');
  const url = `${API}/repos/${config.owner}/${config.repo}/contents/${encodePath(dir)}?ref=${encodeURIComponent(config.branch || 'main')}`;
  const res = await fetch(url, { headers: headers(config) });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error(describeError(res.status, await safeJson(res)));

  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .map((f) => f.name.replace(/\.md$/, ''));
}

export async function branchExists(config, branch) {
  const url = `${API}/repos/${config.owner}/${config.repo}/branches/${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: headers(config) });
  return res.ok;
}

export async function defaultBranch(config) {
  const res = await fetch(`${API}/repos/${config.owner}/${config.repo}`, { headers: headers(config) });
  if (!res.ok) return null;
  const data = await res.json();
  return data.default_branch || null;
}

export async function deleteFile(config, path, sha, message) {
  const url = `${API}/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...headers(config), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha, branch: config.branch || 'main' }),
  });
  if (!res.ok) throw new Error(describeError(res.status, await safeJson(res)));
  return true;
}
