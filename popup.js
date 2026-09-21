

const $ = (id) => document.getElementById(id);

async function init() {
  const { theme, enabled, askSolutions, lcStreak } = await chrome.storage.local.get(
    ['theme', 'enabled', 'askSolutions', 'lcStreak']
  );

  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');

  $('enabledToggle').checked = enabled !== false;
  $('askToggle').checked = askSolutions !== false;

  if (lcStreak?.current) $('streak').textContent = `🔥 ${lcStreak.current}`;

  showAccount();
  showRevisit();
}

async function showRevisit() {
  const res = await chrome.runtime.sendMessage({ type: 'REVISIT_LIST', days: 14 });
  const due = res?.due || [];
  if (!due.length) return;

  $('revisit').hidden = false;
  $('revisitCount').textContent = due.length;

  const list = $('revisitList');
  list.innerHTML = '';

  for (const note of due.slice(0, 5)) {
    const a = document.createElement('a');
    a.href = `https://leetcode.com/problems/${note.slug}/`;
    a.target = '_blank';
    a.rel = 'noreferrer';

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = note.title;

    const age = document.createElement('span');
    age.className = 'age';
    age.textContent = note.days === null
      ? 'older'
      : note.days >= 30
        ? `${Math.floor(note.days / 30)}mo`
        : `${note.days}d`;

    a.append(name, age);
    const li = document.createElement('li');
    li.appendChild(a);
    list.appendChild(li);
  }
}

async function showAccount() {
  const who = $('who');
  try {
    const s = await chrome.runtime.sendMessage({ type: 'AUTH_STATUS' });
    const connected = s.signedIn && s.repo;
    who.firstElementChild.classList.toggle('ok', !!connected);
    who.lastElementChild.textContent = connected
      ? s.repo
      : s.signedIn
        ? 'signed in — no repo picked yet'
        : 'not connected to GitHub';
  } catch {
    who.lastElementChild.textContent = 'not connected to GitHub';
  }
}

$('enabledToggle').addEventListener('change', (e) => {
  chrome.storage.local.set({ enabled: e.target.checked });
});

$('askToggle').addEventListener('change', (e) => {
  chrome.storage.local.set({ askSolutions: e.target.checked });
});

$('openSettings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

init();
