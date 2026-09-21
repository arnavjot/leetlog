

const PANEL_CSS = `
:host { all: initial; }
* { box-sizing: border-box; }

.ln-root {
  --ln-mono: "IBM Plex Mono", ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, Consolas, monospace;
  --ln-prose: ui-sans-serif, -apple-system, "Segoe UI", Inter, "Helvetica Neue", system-ui, sans-serif;
  font-family: var(--ln-mono);
}

button, textarea, input, select { font: inherit; }

.ln-root {
  --ln-bg: #17140f;
  --ln-panel: #1f1a12;
  --ln-input: #100e0a;
  --ln-hover: #2a2418;
  --ln-border: #3a3222;
  --ln-border-focus: #6b5a2e;
  --ln-border-soft: #4a3f26;
  --ln-text: #f1e9d2;
  --ln-dim: #a89b78;
  --ln-faint: #6b6047;
  --ln-on-accent-dim: #b3a884;
  --ln-accent: #ffb020;
  --ln-accent-hover: #ffc250;
  --ln-accent-soft: #ffd79a;
  --ln-green: #8fbc6a;
  --ln-green-hover: #a6d081;
  --ln-green-dim: #55703f;
  --ln-green-text: #c7dcae;
  --ln-green-bg: #1f2a16;
  --ln-green-bg-2: #2a3a1c;
  --ln-green-bg-3: #35492376;
  --ln-green-border: #3d5228;
  --ln-red: #c96a4a;
  --ln-shadow: rgba(0,0,0,0.45);
  --ln-t-kw: #d98a5b;
  --ln-t-str: #8fbc6a;
  --ln-t-num: #d8b46a;
  --ln-t-com: #6b6047;
  --ln-t-fn: #ffd79a;
}

.ln-root[data-theme="light"] {
  --ln-bg: #fdfaf3;
  --ln-panel: #f4eee0;
  --ln-input: #fffdf8;
  --ln-hover: #e8e0cd;
  --ln-border: #ddd2b8;
  --ln-border-focus: #c2a961;
  --ln-border-soft: #cfc09a;
  --ln-text: #2e2718;
  --ln-dim: #6f6549;
  --ln-faint: #a1977c;
  --ln-on-accent-dim: #7a6a3c;
  --ln-accent: #b07405;
  --ln-accent-hover: #8f5e04;
  --ln-accent-soft: #6b4a06;
  --ln-green: #4e7a2a;
  --ln-green-hover: #3e6320;
  --ln-green-dim: #9ab183;
  --ln-green-text: #38561f;
  --ln-green-bg: #eaf3e0;
  --ln-green-bg-2: #dcebcd;
  --ln-green-bg-3: #cbe0b6;
  --ln-green-border: #b7cfa0;
  --ln-red: #a8432a;
  --ln-shadow: rgba(60,50,25,0.18);
  --ln-t-kw: #a4501a;
  --ln-t-str: #3e6320;
  --ln-t-num: #7a5a10;
  --ln-t-com: #9a9075;
  --ln-t-fn: #7a4b04;
}

.ln-root {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 2147483000;
  color: var(--ln-text);
}

.ln-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 420px;
  height: 480px;
  min-width: 280px;
  min-height: 220px;
  background: var(--ln-bg);
  border: 1px solid var(--ln-border);
  border-radius: 6px;
  box-shadow: 0 12px 32px var(--ln-shadow);
  overflow: hidden;
  transition: transform 160ms ease, opacity 160ms ease;
}

.ln-panel.ln-hidden {
  display: none;
}

.ln-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  background: var(--ln-panel);
  border-bottom: 1px solid var(--ln-border);
  cursor: grab;
  user-select: none;
}

.ln-cursor {
  width: 8px;
  height: 14px;
  background: var(--ln-accent);
  flex: none;
}

.ln-title {
  font-size: 12.5px;
  color: var(--ln-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.ln-icon-btn {
  background: transparent;
  border: none;
  color: var(--ln-dim);
  cursor: pointer;
  padding: 3px 6px;
  font-size: 16px;
  line-height: 1;
  border-radius: 3px;
}
.ln-icon-btn:hover { background: var(--ln-hover); color: var(--ln-text); }
.ln-icon-btn svg { width: 15px; height: 15px; display: block; }

.ln-streak {
  display: none;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--ln-accent);
  background: var(--ln-hover);
  border-radius: 10px;
  padding: 2px 7px;
  flex: none;
  cursor: default;
}
.ln-streak.ln-on { display: flex; }
.ln-streak.ln-cold { color: var(--ln-dim); }

.ln-main-state {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.ln-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.ln-resize {
  position: absolute;
  z-index: 2;
}

.ln-n, .ln-s { left: 15px; right: 15px; height: 6px; cursor: ns-resize; }
.ln-w, .ln-e { top: 15px; bottom: 15px; width: 6px; cursor: ew-resize; }
.ln-n { top: 0; }
.ln-s { bottom: 0; }
.ln-w { left: 0; }
.ln-e { right: 0; }

.ln-nw, .ln-ne, .ln-sw, .ln-se { width: 15px; height: 15px; z-index: 3; }

.ln-nw::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 6px;
  height: 6px;
  border-top: 2px solid var(--ln-border-soft);
  border-left: 2px solid var(--ln-border-soft);
}
.ln-nw:hover::after { border-color: var(--ln-accent); }

.ln-nw { top: 0; left: 0; cursor: nwse-resize; }
.ln-ne { top: 0; right: 0; cursor: nesw-resize; }
.ln-sw { bottom: 0; left: 0; cursor: nesw-resize; }
.ln-se { bottom: 0; right: 0; cursor: nwse-resize; }

.ln-import-btn {
  display: block;
  width: 100%;
  background: var(--ln-panel);
  border: 1px dashed var(--ln-border-soft);
  border-radius: 4px;
  color: var(--ln-dim);
  font-size: 11.5px;
  padding: 7px 8px;
  margin-bottom: 8px;
  cursor: pointer;
  text-align: left;
}
.ln-import-btn:hover { color: var(--ln-accent); border-color: var(--ln-border-focus); }
.ln-ask {
  display: none;
  align-items: center;
  gap: 8px;
  background: var(--ln-green-bg);
  border: 1px solid var(--ln-green-border);
  border-radius: 4px;
  padding: 8px 9px;
  margin-bottom: 8px;
}
.ln-ask.ln-on { display: flex; }
.ln-ask-text { font-size: 11.5px; color: var(--ln-green-text); flex: 1; line-height: 1.4; }
.ln-ask button { border: none; border-radius: 3px; font-size: 11.5px; padding: 5px 9px; cursor: pointer; flex: none; }
.ln-ask-yes { background: var(--ln-green); color: var(--ln-bg); font-weight: 600; }
.ln-ask-yes:hover { background: var(--ln-green-hover); }
.ln-ask-yes:disabled { background: var(--ln-green-dim); color: var(--ln-green-text); cursor: default; }
.ln-ask-note { background: var(--ln-green-bg-2); color: var(--ln-green-text); }
.ln-ask-note:hover { background: var(--ln-green-bg-3); color: var(--ln-text); }
.ln-ask-no { background: transparent; color: var(--ln-dim); }
.ln-ask-no:hover { color: var(--ln-text); }

.ln-toolstrip {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 9px 10px 0;
}
.ln-tools {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}
.ln-tools.ln-hidden, .ln-toolstrip.ln-hidden { display: none; }
.ln-tool {
  position: relative;
  width: 26px;
  height: 24px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  color: var(--ln-dim);
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.ln-tool:hover {
  color: var(--ln-text);
  background: var(--ln-hover);
  border-color: var(--ln-border);
}
.ln-tool svg { width: 14px; height: 14px; }

.ln-tool.ln-copied { color: var(--ln-green); }

.ln-hover-tip {
  position: absolute;
  background: var(--ln-panel);
  border: 1px solid var(--ln-border);
  border-radius: 3px;
  padding: 3px 6px;
  font-size: 10.5px;
  line-height: 1.35;
  color: var(--ln-text);
  white-space: normal;
  width: max-content;
  max-width: 150px;
  text-align: left;
  opacity: 0;
  pointer-events: none;
  transition: opacity 90ms ease;
  z-index: 50;
}
.ln-hover-tip.ln-show { opacity: 1; }

.ln-tool-sep {
  width: 1px;
  height: 14px;
  background: var(--ln-border);
  margin: 0 4px;
  flex: none;
}

.ln-tool-overflowed { display: none !important; }

.ln-more-wrap { position: relative; flex: none; }
.ln-tools-more-wrap.ln-hidden { display: none; }
.ln-more-btn svg, .ln-tools-more-btn svg {
  width: 14px;
  height: 14px;
}
.ln-tools-more-wrap .ln-more-menu { left: 0; right: auto; }
.ln-more-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 168px;
  background: var(--ln-panel);
  border: 1px solid var(--ln-border);
  border-radius: 6px;
  box-shadow: 0 6px 18px var(--ln-shadow);
  padding: 4px;
  display: none;
  flex-direction: column;
  gap: 1px;
  z-index: 6;
}
.ln-more-menu.ln-open { display: flex; }
.ln-more-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--ln-text);
  font-family: inherit;
  font-size: 12px;
  line-height: 1;
  padding: 8px 8px;
  cursor: pointer;
  text-align: left;
}
.ln-more-item:hover { background: var(--ln-hover); }
.ln-more-item svg { width: 14px; height: 14px; flex: none; color: var(--ln-dim); }
.ln-more-item.ln-copied svg { color: var(--ln-green); }
.ln-more-item.ln-more-danger { color: var(--ln-red); }
.ln-more-item.ln-more-danger svg { color: var(--ln-red); }
.ln-more-item.ln-more-danger:hover { background: var(--ln-hover); }

.ln-textarea {
  width: 100%;
  flex: 1;
  min-height: 60px;
  resize: none;
  background: var(--ln-input);
  border: 1px solid var(--ln-border);
  border-radius: 4px;
  color: var(--ln-text);
  font-size: 12.5px;
  line-height: 1.5;
  padding: 9px;
  outline: none;
}
.ln-textarea:focus { border-color: var(--ln-border-focus); }
.ln-textarea::placeholder { color: var(--ln-faint); }

.ln-confirm {
  display: none;
  gap: 9px;
  align-items: center;
  margin: 10px 10px 0;
  padding: 9px 10px;
  background: var(--ln-panel);
  border: 1px solid var(--ln-border-focus);
  border-radius: 4px;
}
.ln-confirm.ln-on { display: flex; }
.ln-confirm-text {
  flex: 1;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--ln-text);
}
.ln-confirm-text b { color: var(--ln-accent); font-weight: 600; }
.ln-confirm-text span { display: block; color: var(--ln-dim); margin-top: 2px; }
.ln-confirm-actions { display: flex; gap: 6px; flex: none; }
.ln-confirm button {
  border: none;
  border-radius: 3px;
  font-size: 11.5px;
  padding: 6px 10px;
  cursor: pointer;
}
.ln-confirm-yes { background: var(--ln-accent); color: var(--ln-bg); font-weight: 600; }
.ln-confirm-yes:hover { background: var(--ln-accent-hover); }
.ln-confirm-no { background: transparent; color: var(--ln-dim); }
.ln-confirm-no:hover { color: var(--ln-text); }

.ln-preview {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px 14px;
  font-family: var(--ln-prose);
  font-size: 13.5px;
  line-height: 1.6;
  padding-top: 9px;
}
.ln-preview-body strong, .ln-preview-body b {
  font-weight: 700;
  color: var(--ln-text);
}
.ln-preview-body em, .ln-preview-body i { font-style: italic; }

.ln-preview-body code, .ln-preview-body pre, .ln-preview-path {
  font-family: var(--ln-mono);
  font-size: 0.85em;
}
.ln-preview-path {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--ln-dim);
  border-bottom: 1px solid var(--ln-border);
  padding-bottom: 5px;
  margin-bottom: 10px;
}
.ln-preview-pathtext {
  flex: 1;
  min-width: 0;
  word-break: break-all;
}

.ln-preview-body h1,
.ln-preview-body h2,
.ln-preview-body h3,
.ln-preview-body h4,
.ln-preview-body h5,
.ln-preview-body h6 {
  color: var(--ln-text);
  font-weight: 700;
  line-height: 1.3;
  margin: 18px 0 8px;
}
.ln-preview-body h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--ln-border);
  padding-bottom: 0.3em;
}
.ln-preview-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--ln-border);
  padding-bottom: 0.3em;
}
.ln-preview-body h3 { font-size: 1.25em; }
.ln-preview-body h4 { font-size: 1em; }
.ln-preview-body h5 { font-size: 0.875em; }
.ln-preview-body h6 { font-size: 0.85em; color: var(--ln-dim); }
.ln-preview-body > :first-child { margin-top: 0; }
.ln-preview-body p { margin: 0 0 16px; }
.ln-preview-body ul, .ln-preview-body ol { margin: 0 0 8px; padding-left: 18px; }
.ln-preview-body li { margin-bottom: 2px; }
.ln-preview-body code {
  background: var(--ln-hover);
  border-radius: 6px;
  padding: 0.2em 0.4em;
  color: var(--ln-text);
}
.ln-preview-body pre {
  background: var(--ln-panel);
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  margin: 0 0 16px;
  line-height: 1.45;
}

.ln-preview-body pre code { font-size: 1em; }
.ln-preview-body pre code { background: none; border: none; padding: 0; color: var(--ln-text); }
.ln-preview-body .t-kw  { color: var(--ln-t-kw); }
.ln-preview-body .t-str { color: var(--ln-t-str); }
.ln-preview-body .t-num { color: var(--ln-t-num); }
.ln-preview-body .t-com { color: var(--ln-t-com); font-style: italic; }
.ln-preview-body .t-fn  { color: var(--ln-t-fn); }
.ln-preview-body a { color: var(--ln-accent); }
.ln-preview-body hr {
  height: 0.25em;
  border: 0;
  background: var(--ln-border);
  margin: 20px 0;
}
.ln-preview-body del { color: var(--ln-faint); }
.ln-preview-body ul ul, .ln-preview-body ol ol,
.ln-preview-body ul ol, .ln-preview-body ol ul { margin-bottom: 0; }
.ln-preview-body table {
  border-collapse: collapse;
  margin: 0 0 8px;
  font-size: 11.5px;
  width: 100%;
}
.ln-preview-body th, .ln-preview-body td {
  border: 1px solid var(--ln-border);
  padding: 6px 10px;
  text-align: left;
}
.ln-preview-body th { font-weight: 600; color: var(--ln-text); }
.ln-preview-body tr:nth-child(2n) { background: var(--ln-panel); }
.ln-preview-body pre[data-lang]::before {
  content: attr(data-lang);
  display: block;
  font-size: 10px;
  color: var(--ln-faint);
  margin-bottom: 5px;
}
.ln-preview-body input[type="checkbox"] { margin-right: 5px; }

.ln-preview-body blockquote {
  margin: 0 0 16px;
  padding: 0 1em;
  border-left: 0.25em solid var(--ln-border);
  color: var(--ln-dim);
}
.ln-preview-body blockquote > :last-child { margin-bottom: 0; }
.ln-preview-body img {
  max-width: 100%;
  border-radius: 3px;
  border: 1px solid var(--ln-border);
}
.ln-preview-empty { color: var(--ln-faint); font-style: italic; }

.ln-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 10px;
  border-top: 1px solid var(--ln-border);
}

.ln-status {
  font-size: 11px;
  color: var(--ln-dim);
  display: flex;
  align-items: center;
  gap: 6px;
}

.ln-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ln-faint);
  flex: none;
}
.ln-dot.ln-dot-modified { background: var(--ln-accent); }
.ln-dot.ln-dot-saved { background: var(--ln-green); }
.ln-dot.ln-dot-error { background: var(--ln-red); }

.ln-commit-btn {
  background: var(--ln-accent);
  color: var(--ln-bg);
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.ln-commit-btn:hover { background: var(--ln-accent-hover); }
.ln-commit-btn:disabled { background: var(--ln-border-focus); color: var(--ln-on-accent-dim); cursor: default; }

.ln-empty {
  padding: 16px 12px;
  text-align: center;
}
.ln-empty p {
  font-size: 12px;
  color: var(--ln-dim);
  margin: 0 0 10px;
  line-height: 1.5;
}
.ln-connect-btn {
  background: var(--ln-accent);
  color: var(--ln-bg);
  border: none;
  border-radius: 4px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.ln-connect-btn:hover { background: var(--ln-accent-hover); }

.ln-tab {

  position: absolute;
  right: 0;
  bottom: 54px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--ln-panel);
  border: 1px solid var(--ln-border);
  border-radius: 999px;
  color: var(--ln-dim);
  font-size: 12px;
  padding: 8px 13px;
  cursor: pointer;
  box-shadow: 0 6px 18px var(--ln-shadow);
  transition: border-color 140ms ease, color 140ms ease, transform 140ms ease;
  user-select: none;
}
.ln-tab:hover {
  color: var(--ln-text);
  border-color: var(--ln-border-focus);
  transform: translateY(-1px);
}
.ln-tab.ln-hidden { display: none; }

.ln-tab-mark {
  width: 7px;
  height: 13px;
  background: var(--ln-accent);
  border-radius: 1px;
  flex: none;
}
.ln-tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ln-accent);
  flex: none;
  display: none;
}
.ln-tab-dot.ln-on { display: block; }
`;

const PANEL_HTML = `
<div class="ln-panel">
  <div class="ln-resize ln-n" aria-label="Resize"></div>
  <div class="ln-resize ln-s" aria-label="Resize"></div>
  <div class="ln-resize ln-w" aria-label="Resize"></div>
  <div class="ln-resize ln-e" aria-label="Resize"></div>
  <div class="ln-resize ln-nw" aria-label="Resize"></div>
  <div class="ln-resize ln-ne" aria-label="Resize"></div>
  <div class="ln-resize ln-sw" aria-label="Resize"></div>
  <div class="ln-resize ln-se" aria-label="Resize"></div>
  <div class="ln-header">
    <div class="ln-cursor"></div>
    <div class="ln-title"><span class="ln-title-text">loading…</span></div>
    <div class="ln-streak" title="days in a row with a submission on LeetCode">🔥<span class="ln-streak-n">0</span></div>
    <button class="ln-icon-btn ln-tip ln-settings" data-tip="Settings" aria-label="Settings">⚙</button>
    <button class="ln-icon-btn ln-tip ln-minimize" data-tip="Minimise" aria-label="Minimise">–</button>
  </div>

  <div class="ln-empty ln-empty-state" style="display:none;">
    <p class="ln-empty-text">Connect GitHub to start committing notes on problems you solve.</p>
    <button class="ln-connect-btn ln-connect">Connect GitHub</button>
  </div>

  <div class="ln-main-state">
    <div class="ln-toolstrip">
      <div class="ln-tools"></div>
      <div class="ln-more-wrap ln-tools-more-wrap ln-hidden">
        <button class="ln-tool ln-tools-more-btn" type="button" aria-haspopup="true" aria-expanded="false"></button>
        <div class="ln-more-menu ln-tools-more-menu" role="menu"></div>
      </div>
      <button class="ln-tool ln-tip ln-copy-btn"></button>
      <div class="ln-more-wrap">
        <button class="ln-tool ln-tip ln-more-btn" type="button" aria-haspopup="true" aria-expanded="false"></button>
        <div class="ln-more-menu" role="menu">
          <button class="ln-more-item ln-download-btn" type="button" role="menuitem"></button>
          <button class="ln-more-item ln-revert-btn" type="button" role="menuitem"></button>
          <button class="ln-more-item ln-more-danger ln-delete-btn" type="button" role="menuitem"></button>
        </div>
      </div>
      <button class="ln-tool ln-tip ln-preview-btn"></button>
    </div>
    <div class="ln-body">
      <div class="ln-ask">
        <span class="ln-ask-text">Accepted — commit this solution?</span>
        <button class="ln-ask-yes">Commit</button>
        <button class="ln-ask-note">Add to note</button>
        <button class="ln-ask-no">Not now</button>
      </div>
      <button class="ln-import-btn">{ } Insert my code from the editor</button>
      <textarea class="ln-textarea" placeholder="approach, edge cases, what you got wrong the first time"></textarea>
    </div>
    <div class="ln-confirm">
      <div class="ln-confirm-text"></div>
      <div class="ln-confirm-actions">
        <button class="ln-confirm-no">Cancel</button>
        <button class="ln-confirm-yes">Yes, commit</button>
      </div>
    </div>
    <div class="ln-preview" style="display:none;">
      <div class="ln-preview-path"><span class="ln-preview-pathtext"></span></div>
      <div class="ln-preview-body"></div>
    </div>
    <div class="ln-footer">
      <div class="ln-status"><span class="ln-dot"></span><span class="ln-status-text">reading…</span></div>
      <button class="ln-commit-btn">Commit note</button>
    </div>
  </div>
  <div class="ln-hover-tip" role="tooltip"></div>
</div>
<div class="ln-tab ln-hidden" role="button" tabindex="0" aria-label="Open notes">
  <span class="ln-tab-mark"></span>
  <span class="ln-tab-label">Notes</span>
  <span class="ln-tab-dot" title="unsaved changes"></span>
</div>
`;

const state = {
  slug: null,
  title: null,
  number: null,
  sha: null,
  lastSavedContent: '',
  saving: false,
  path: null,
  repo: null,
  restoredAt: 0,
  pendingCommit: false,
  pendingDelete: false,
};

function getSlugFromUrl() {
  const m = location.pathname.match(/\/problems\/([^/]+)/);
  return m ? m[1] : null;
}

function getTitleFromDocument() {
  const raw = document.title || '';
  const cleaned = raw.replace(/\s*-\s*LeetCode\s*$/i, '').trim();
  return cleaned || state.slug;
}

let root, els;

let hostEl = null;

function injectPanel() {
  const host = document.createElement('div');
  host.id = 'leetlog-host';
  document.documentElement.appendChild(host);
  hostEl = host;
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = PANEL_CSS;
  shadow.appendChild(style);

  root = document.createElement('div');
  root.className = 'ln-root';
  root.innerHTML = PANEL_HTML;
  shadow.appendChild(root);

  els = {
    panel: root.querySelector('.ln-panel'),
    titleText: root.querySelector('.ln-title-text'),
    streak: root.querySelector('.ln-streak'),
    streakN: root.querySelector('.ln-streak-n'),
    settingsBtn: root.querySelector('.ln-settings'),
    minimizeBtn: root.querySelector('.ln-minimize'),
    emptyState: root.querySelector('.ln-empty-state'),
    emptyText: root.querySelector('.ln-empty-text'),
    connectBtn: root.querySelector('.ln-connect'),
    mainState: root.querySelector('.ln-main-state'),
    importBtn: root.querySelector('.ln-import-btn'),
    tools: root.querySelector('.ln-tools'),
    toolstrip: root.querySelector('.ln-toolstrip'),
    toolsMoreWrap: root.querySelector('.ln-tools-more-wrap'),
    toolsMoreBtn: root.querySelector('.ln-tools-more-btn'),
    toolsMoreMenu: root.querySelector('.ln-tools-more-menu'),
    hoverTip: root.querySelector('.ln-hover-tip'),

    ask: root.querySelector('.ln-ask'),
    askText: root.querySelector('.ln-ask-text'),
    askYes: root.querySelector('.ln-ask-yes'),
    askNote: root.querySelector('.ln-ask-note'),
    askNo: root.querySelector('.ln-ask-no'),
    textarea: root.querySelector('.ln-textarea'),
    confirm: root.querySelector('.ln-confirm'),
    confirmText: root.querySelector('.ln-confirm-text'),
    confirmYes: root.querySelector('.ln-confirm-yes'),
    confirmNo: root.querySelector('.ln-confirm-no'),
    preview: root.querySelector('.ln-preview'),
    previewPath: root.querySelector('.ln-preview-path'),
    previewPathText: root.querySelector('.ln-preview-pathtext'),
    previewBody: root.querySelector('.ln-preview-body'),
    previewBtn: root.querySelector('.ln-preview-btn'),
    moreWrap: root.querySelector('.ln-more-wrap'),
    moreBtn: root.querySelector('.ln-more-btn'),
    moreMenu: root.querySelector('.ln-more-menu'),
    copyBtn: root.querySelector('.ln-copy-btn'),
    downloadBtn: root.querySelector('.ln-download-btn'),
    revertBtn: root.querySelector('.ln-revert-btn'),
    deleteBtn: root.querySelector('.ln-delete-btn'),
    grips: root.querySelectorAll('.ln-resize'),
    statusDot: root.querySelector('.ln-dot'),
    statusText: root.querySelector('.ln-status-text'),
    commitBtn: root.querySelector('.ln-commit-btn'),
    tab: root.querySelector('.ln-tab'),
    tabDot: root.querySelector('.ln-tab-dot'),
  };

  buildToolbar();
  setPreviewMode('preview');
  els.copyBtn.innerHTML = SVG_COPY;
  els.copyBtn.dataset.tip = 'Copy note';
  els.copyBtn.setAttribute('aria-label', 'Copy note');
  els.moreBtn.innerHTML = SVG_MORE;
  els.moreBtn.dataset.tip = 'More actions';
  els.moreBtn.setAttribute('aria-label', 'More actions');
  els.toolsMoreBtn.innerHTML = SVG_MORE;
  els.toolsMoreBtn.dataset.tip = 'More formatting';
  els.toolsMoreBtn.setAttribute('aria-label', 'More formatting');
  setMoreItem(els.downloadBtn, SVG_DOWNLOAD, 'Download .md');
  setMoreItem(els.revertBtn, SVG_REVERT, 'Discard unsaved changes');
  setMoreItem(els.deleteBtn, SVG_TRASH, 'Delete note from GitHub');
  wireEvents();
  initHoverTips();
  makeDraggable(els.panel, root.querySelector('.ln-header'));

  const GRIP_DIRS = {
    'ln-n':  { x: 0,  y: -1 },
    'ln-s':  { x: 0,  y: 1 },
    'ln-w':  { x: -1, y: 0 },
    'ln-e':  { x: 1,  y: 0 },
    'ln-nw': { x: -1, y: -1 },
    'ln-ne': { x: 1,  y: -1 },
    'ln-sw': { x: -1, y: 1 },
    'ln-se': { x: 1,  y: 1 },
  };
  for (const grip of els.grips) {
    const dir = GRIP_DIRS[[...grip.classList].find((c) => GRIP_DIRS[c])];
    if (dir) makeResizable(els.panel, grip, dir);
  }
  restoreSize();
  applyTheme();
  watchToolbarSize();
}

function setMoreItem(btn, icon, label) {
  btn.innerHTML = `${icon}<span>${label}</span>`;
  btn.dataset.label = label;
}

function openDropdown(btn, menu) {
  menu.classList.add('ln-open');
  btn.setAttribute('aria-expanded', 'true');
}

function closeDropdown(btn, menu) {
  menu.classList.remove('ln-open');
  btn.setAttribute('aria-expanded', 'false');
}

function toggleDropdown(btn, menu) {
  if (menu.classList.contains('ln-open')) closeDropdown(btn, menu);
  else openDropdown(btn, menu);
}

function anyDropdownOpen() {
  return els.moreMenu.classList.contains('ln-open') || els.toolsMoreMenu.classList.contains('ln-open');
}

function closeAllDropdowns() {
  closeDropdown(els.moreBtn, els.moreMenu);
  closeDropdown(els.toolsMoreBtn, els.toolsMoreMenu);
}

function showHoverTip(target) {
  const text = target.dataset.tip;
  if (!text || !els) return;
  const tip = els.hoverTip;
  tip.textContent = text;
  tip.classList.add('ln-show');

  const panelRect = els.panel.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const tipWidth = tip.offsetWidth;

  let left = rect.left - panelRect.left + rect.width / 2 - tipWidth / 2;
  left = Math.max(6, Math.min(left, panelRect.width - tipWidth - 6));

  tip.style.left = `${left}px`;
  tip.style.top = `${rect.bottom - panelRect.top + 5}px`;
}

function hideHoverTip() {
  if (els) els.hoverTip.classList.remove('ln-show');
}

function initHoverTips() {
  root.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tip]');
    if (target) showHoverTip(target);
  });
  root.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-tip]');
    if (target && !target.contains(e.relatedTarget)) hideHoverTip();
  });
  root.addEventListener('focusin', (e) => {
    const target = e.target.closest('[data-tip]');
    if (target) showHoverTip(target);
  });
  root.addEventListener('focusout', (e) => {
    if (e.target.closest('[data-tip]')) hideHoverTip();
  });
  root.addEventListener('mousedown', hideHoverTip);
}

let toolEntries = [];

function reflowToolbar() {
  if (!els || !toolEntries.length) return;
  hideHoverTip();

  for (const entry of toolEntries) entry.el.classList.remove('ln-tool-overflowed');
  els.toolsMoreWrap.classList.add('ln-hidden');
  els.toolsMoreMenu.innerHTML = '';

  const available = els.tools.clientWidth;
  let total = 0;
  const widths = toolEntries.map((entry) => {
    const w = entry.el.offsetWidth + 2;
    total += w;
    return w;
  });

  if (total <= available) return;

  // toolsMoreBtn is still display:none at this point (hidden above), so its
  // offsetWidth would read 0 — use the fixed .ln-tool size (26px) instead of
  // measuring a hidden element.
  const moreBtnWidth = 26 + 2;
  const budget = available - moreBtnWidth;
  let used = 0;
  let cutIndex = toolEntries.length;

  for (let i = 0; i < toolEntries.length; i++) {
    used += widths[i];
    if (used > budget) { cutIndex = i; break; }
  }
  while (cutIndex > 0 && toolEntries[cutIndex - 1].sep) cutIndex--;

  const hidden = toolEntries.slice(cutIndex);
  const hiddenTools = hidden.filter((entry) => !entry.sep).map((entry) => entry.tool);
  if (!hiddenTools.length) return;

  for (const entry of hidden) entry.el.classList.add('ln-tool-overflowed');

  els.toolsMoreWrap.classList.remove('ln-hidden');
  for (const tool of hiddenTools) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'ln-more-item';
    item.setAttribute('role', 'menuitem');
    item.innerHTML = `${tool.html}<span>${tool.title.replace(/\s*·.*$/, '')}</span>`;
    item.addEventListener('click', () => {
      closeDropdown(els.toolsMoreBtn, els.toolsMoreMenu);
      tool.run();
    });
    els.toolsMoreMenu.appendChild(item);
  }
}

let toolbarResizeFrame = null;

function watchToolbarSize() {
  const observer = new ResizeObserver(() => {
    if (toolbarResizeFrame) return;
    toolbarResizeFrame = requestAnimationFrame(() => {
      toolbarResizeFrame = null;
      reflowToolbar();
    });
  });
  observer.observe(els.panel);
}

function openSettings() {
  try {
    chrome.runtime.openOptionsPage();
  } catch {
    chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
  }
}

function wireEvents() {
  els.settingsBtn.addEventListener('click', openSettings);
  els.connectBtn.addEventListener('click', openSettings);

  els.minimizeBtn.addEventListener('click', () => setMinimized(true));
  els.tab.addEventListener('click', () => setMinimized(false));
  els.tab.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMinimized(false);
    }
  });

  els.textarea.addEventListener('input', () => {
    setStatus('modified', 'unsaved changes');
    queueDraftSave();
  });

  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (anyDropdownOpen()) closeAllDropdowns();
    else if (state.pendingCommit || state.pendingDelete) cancelCommit();
    else if (els.preview.style.display === 'block') hidePreview();
  });

  els.commitBtn.addEventListener('click', onCommitClick);
  els.moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDropdown(els.toolsMoreBtn, els.toolsMoreMenu);
    toggleDropdown(els.moreBtn, els.moreMenu);
  });
  els.toolsMoreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDropdown(els.moreBtn, els.moreMenu);
    toggleDropdown(els.toolsMoreBtn, els.toolsMoreMenu);
  });
  for (const item of [els.downloadBtn, els.revertBtn, els.deleteBtn]) {
    item.addEventListener('click', () => closeDropdown(els.moreBtn, els.moreMenu));
  }
  els.copyBtn.addEventListener('click', copyNote);
  els.downloadBtn.addEventListener('click', downloadNote);
  els.revertBtn.addEventListener('click', discardDraft);
  els.deleteBtn.addEventListener('click', askDeleteNote);
  document.addEventListener('click', (e) => {
    const path = e.composedPath();
    if (!path.includes(els.moreWrap)) closeDropdown(els.moreBtn, els.moreMenu);
    if (!path.includes(els.toolsMoreWrap)) closeDropdown(els.toolsMoreBtn, els.toolsMoreMenu);
  });
  els.confirmYes.addEventListener('click', () => {
    if (state.pendingDelete) return deleteNote();
    state.pendingCommit = false;
    els.confirm.classList.remove('ln-on');
    commitNote();
  });
  els.confirmNo.addEventListener('click', cancelCommit);
  els.previewBtn.addEventListener('click', () => {
    if (state.pendingCommit) return cancelCommit();
    togglePreview();
  });
  els.importBtn.addEventListener('click', insertCodeBlock);
  els.askYes.addEventListener('click', commitSolution);
  els.askNote.addEventListener('click', solutionToNotes);
  els.askNo.addEventListener('click', () => {
    pendingSubmission = null;
    els.ask.classList.remove('ln-on');
  });

  els.textarea.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onCommitClick();
      return;
    }
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'b') { e.preventDefault(); wrapSelection('**'); }
      else if (e.key === 'i') { e.preventDefault(); wrapSelection('*'); }
      else if (e.key === 'k') { e.preventDefault(); insertLink(); }
    }
  });
}

const SVG_UL = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
  <circle cx="3" cy="4" r="1" fill="currentColor" stroke="none"/><path d="M6.5 4h7"/>
  <circle cx="3" cy="8" r="1" fill="currentColor" stroke="none"/><path d="M6.5 8h7"/>
  <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none"/><path d="M6.5 12h7"/></svg>`;

const SVG_OL = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6.5 4h7M6.5 8h7M6.5 12h7"/><path d="M2 2.8l1-.5V5"/><path d="M1.8 7.4a1 1 0 0 1 1.7.7c0 .6-1.7 1.3-1.7 1.9h1.9"/>
  <path d="M1.9 11.3h1.6l-1 1.1a.9.9 0 1 1-.6 1.5"/></svg>`;

const SVG_QUOTE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
  <path d="M2.5 3.5v9" stroke-width="2"/><path d="M6 5h7.5M6 8h7.5M6 11h5"/></svg>`;

const SVG_IMAGE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round">
  <rect x="2" y="3" width="12" height="10" rx="1.5"/>
  <circle cx="5.7" cy="6.4" r="1" fill="currentColor" stroke="none"/>
  <path d="M2.6 11.4l3.2-3 2.3 2.1 2-1.9 3.3 3"/></svg>`;

const SVG_CODE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5"/></svg>`;

const SVG_LINK = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
  <path d="M6.8 9.2a2.5 2.5 0 0 0 3.6 0l2-2a2.5 2.5 0 0 0-3.6-3.6l-.9.9"/>
  <path d="M9.2 6.8a2.5 2.5 0 0 0-3.6 0l-2 2a2.5 2.5 0 0 0 3.6 3.6l.9-.9"/></svg>`;

const SVG_COPY = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <rect x="5.5" y="5.5" width="8" height="9" rx="1.5"/>
  <path d="M10.5 3.5v-1a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1"/></svg>`;

const SVG_CHECK = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 8.5l3.5 3.5L13 4.5"/></svg>`;

const SVG_REVERT = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 8a5 5 0 1 1 1.5 3.6"/><path d="M3 4.5V8h3.5"/></svg>`;

const SVG_TRASH = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2.8 4.3h10.4"/><path d="M6.4 4.3V3a.8.8 0 0 1 .8-.8h1.6a.8.8 0 0 1 .8.8v1.3"/>
  <path d="M4.2 4.3l.6 8.2a.9.9 0 0 0 .9.8h4.6a.9.9 0 0 0 .9-.8l.6-8.2"/></svg>`;

const SVG_DOWNLOAD = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 2.5v7.5"/><path d="M4.8 7.2L8 10.4l3.2-3.2"/><path d="M2.8 12.8h10.4"/></svg>`;

const SVG_EYE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M1.5 8S3.9 3.8 8 3.8 14.5 8 14.5 8 12.1 12.2 8 12.2 1.5 8 1.5 8z"/>
  <circle cx="8" cy="8" r="1.9"/></svg>`;

const SVG_PENCIL = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11.3 2.6l2.1 2.1-8 8-2.8.7.7-2.8z"/><path d="M10 3.9l2.1 2.1"/></svg>`;

const SVG_X = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
  <path d="M4 4l8 8M12 4l-8 8"/></svg>`;

const SVG_MORE = `<svg viewBox="0 0 16 16" fill="currentColor" stroke="none">
  <circle cx="3.5" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="12.5" cy="8" r="1.3"/></svg>`;

async function copyNote() {
  const text = els.textarea.value;
  if (!text.trim()) {
    setStatus(null, 'nothing to copy yet');
    return;
  }

  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    const { selectionStart, selectionEnd } = els.textarea;
    els.textarea.select();
    copied = document.execCommand('copy');
    els.textarea.setSelectionRange(selectionStart, selectionEnd);
  }

  if (!copied) {
    setStatus('error', 'copy blocked by the browser');
    return;
  }

  els.copyBtn.innerHTML = SVG_CHECK;
  els.copyBtn.classList.add('ln-copied');
  setStatus('saved', 'note copied to clipboard');

  setTimeout(() => {
    els.copyBtn.innerHTML = SVG_COPY;
    els.copyBtn.classList.remove('ln-copied');
  }, 1400);
}

async function discardDraft() {
  if (els.textarea.value === state.lastSavedContent) {
    setStatus(null, 'nothing unsaved to discard');
    return;
  }
  els.textarea.value = state.lastSavedContent;
  await clearDraft(state.slug);
  setStatus(state.sha ? 'saved' : null, 'discarded — back to the committed note');
}

function askDeleteNote() {
  if (!state.sha) {
    setStatus(null, 'this note was never committed');
    return;
  }
  state.pendingDelete = true;
  els.confirmText.innerHTML = 'Delete <b></b> from <b></b><span>This removes the file from GitHub.</span>';
  const marks = els.confirmText.querySelectorAll('b');
  marks[0].textContent = state.path || 'this note';
  marks[1].textContent = state.repo || 'your repo';
  els.confirmYes.textContent = 'Delete';
  els.confirm.classList.add('ln-on');
  els.commitBtn.style.display = 'none';
  setStatus('modified', 'waiting for you to confirm');
}

async function deleteNote() {
  state.pendingDelete = false;
  els.confirm.classList.remove('ln-on');
  els.confirmYes.textContent = 'Yes, commit';
  els.commitBtn.style.display = '';

  const res = await chrome.runtime.sendMessage({
    type: 'DELETE_NOTE', slug: state.slug, title: numberedTitle(),
  });

  if (res.error) {
    setStatus('error', res.error);
    if (res.authFailed) showEmptyState('expired');
    return;
  }
  if (!res.deleted) {
    setStatus(null, res.reason || 'nothing to delete');
    return;
  }

  state.sha = null;
  state.lastSavedContent = '';
  els.textarea.value = '';
  await clearDraft(state.slug);
  setStatus('saved', 'note deleted from GitHub');
}

function downloadNote() {
  const text = els.textarea.value;
  if (!text.trim()) {
    setStatus(null, 'nothing to download yet');
    return;
  }

  const name = `${state.number ? `${state.number}-` : ''}${state.slug || 'note'}.md`;
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  setStatus('saved', `saved ${name}`);
}

function setPreviewMode(mode) {
  const modes = {
    preview: [SVG_EYE, 'Preview'],
    edit: [SVG_PENCIL, 'Back to editing'],
    cancel: [SVG_X, 'Cancel commit'],
  };
  const [icon, label] = modes[mode];
  els.previewBtn.innerHTML = icon;
  els.previewBtn.dataset.tip = label;
  els.previewBtn.setAttribute('aria-label', label);
}

const TOOLS = [
  { html: '<b>B</b>', title: 'Bold · ⌘B', run: () => wrapSelection('**') },
  { html: '<i>I</i>', title: 'Italic · ⌘I', run: () => wrapSelection('*') },
  { html: '<b>H</b>', title: 'Heading · press again for H2, H3', run: cycleHeading },
  { html: SVG_QUOTE, title: 'Quote', run: () => togglePrefix('> ') },
  { sep: true },
  { html: SVG_UL, title: 'Bullet list', run: () => togglePrefix('- ') },
  { html: SVG_OL, title: 'Numbered list', run: numberLines },
  { sep: true },
  { html: '<b>`</b>', title: 'Inline code', run: () => wrapSelection('`') },
  { html: SVG_CODE, title: 'Code block', run: insertCodeFence },
  { html: SVG_LINK, title: 'Link · ⌘K', run: insertLink },
  { html: SVG_IMAGE, title: 'Image', run: insertImage },
];

function buildToolbar() {
  toolEntries = [];
  for (const tool of TOOLS) {
    if (tool.sep) {
      const sep = document.createElement('span');
      sep.className = 'ln-tool-sep';
      els.tools.appendChild(sep);
      toolEntries.push({ sep: true, el: sep });
      continue;
    }
    const btn = document.createElement('button');
    btn.className = 'ln-tool';
    btn.type = 'button';
    btn.dataset.tip = tool.title;
    btn.setAttribute('aria-label', tool.title);
    btn.innerHTML = tool.html;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      tool.run();
    });
    els.tools.appendChild(btn);
    toolEntries.push({ tool, el: btn });
  }
}

function selection() {
  const ta = els.textarea;
  return { ta, start: ta.selectionStart, end: ta.selectionEnd, text: ta.value.slice(ta.selectionStart, ta.selectionEnd) };
}

function setValue(value, selStart, selEnd) {
  els.textarea.value = value;
  els.textarea.setSelectionRange(selStart, selEnd ?? selStart);
  els.textarea.focus();
  setStatus('modified', 'unsaved changes');
}

function wrapSelection(marker) {
  const { ta, start, end, text } = selection();
  const before = ta.value.slice(0, start);
  const after = ta.value.slice(end);

  if (before.endsWith(marker) && after.startsWith(marker)) {
    const value = before.slice(0, -marker.length) + text + after.slice(marker.length);
    setValue(value, start - marker.length, end - marker.length);
    return;
  }

  const value = `${before}${marker}${text}${marker}${after}`;
  setValue(value, start + marker.length, end + marker.length);
}

function caretInFence() {
  const { ta, start } = selection();
  const before = ta.value.slice(0, start);
  return (before.match(/^```/gm) || []).length % 2 === 1;
}

function refuseInFence() {
  if (!caretInFence()) return false;
  setStatus(null, "that's inside a code block");
  return true;
}

function cycleHeading() {
  if (refuseInFence()) return;
  const { ta, start, end } = selection();
  const from = ta.value.lastIndexOf('\n', start - 1) + 1;
  const to = ta.value.indexOf('\n', end);
  const stop = to === -1 ? ta.value.length : to;

  const next = ta.value.slice(from, stop).split('\n').map((line) => {
    const m = line.match(/^(#{1,6})\s+(.*)$/);
    if (!m) return `# ${line}`;
    const level = m[1].length;
    return level >= 3 ? m[2] : `${'#'.repeat(level + 1)} ${m[2]}`;
  }).join('\n');

  const value = ta.value.slice(0, from) + next + ta.value.slice(stop);
  setValue(value, from, from + next.length);
}

function togglePrefix(prefix) {
  if (refuseInFence()) return;
  const { ta, start, end } = selection();
  const from = ta.value.lastIndexOf('\n', start - 1) + 1;
  const to = ta.value.indexOf('\n', end);
  const stop = to === -1 ? ta.value.length : to;

  const lines = ta.value.slice(from, stop).split('\n');
  const allPrefixed = lines.every((l) => l.startsWith(prefix));
  const next = lines
    .map((l) => (allPrefixed ? l.slice(prefix.length) : prefix + l))
    .join('\n');

  const value = ta.value.slice(0, from) + next + ta.value.slice(stop);
  setValue(value, from, from + next.length);
}

function numberLines() {
  if (refuseInFence()) return;
  const { ta, start, end } = selection();
  const from = ta.value.lastIndexOf('\n', start - 1) + 1;
  const to = ta.value.indexOf('\n', end);
  const stop = to === -1 ? ta.value.length : to;

  const lines = ta.value.slice(from, stop).split('\n');
  const numbered = lines.every((l) => /^\d+\. /.test(l));
  const next = lines
    .map((l, i) => (numbered ? l.replace(/^\d+\. /, '') : `${i + 1}. ${l}`))
    .join('\n');

  const value = ta.value.slice(0, from) + next + ta.value.slice(stop);
  setValue(value, from, from + next.length);
}

function insertCodeFence() {
  if (refuseInFence()) return;
  const { ta, start, end, text } = selection();
  const block = `\n\`\`\`\n${text || ''}\n\`\`\`\n`;
  const value = ta.value.slice(0, start) + block + ta.value.slice(end);

  const caret = start + 5 + (text ? text.length : 0);
  setValue(value, caret);
}

function insertImage() {
  const { ta, start, end, text } = selection();
  const alt = text || 'alt';
  const snippet = `![${alt}](url)`;
  const value = ta.value.slice(0, start) + snippet + ta.value.slice(end);
  const urlAt = start + alt.length + 4;
  setValue(value, urlAt, urlAt + 3);
}

function insertLink() {
  const { ta, start, end, text } = selection();
  const label = text || 'text';
  const snippet = `[${label}](url)`;
  const value = ta.value.slice(0, start) + snippet + ta.value.slice(end);

  const urlAt = start + label.length + 3;
  setValue(value, urlAt, urlAt + 3);
}

let pendingSubmission = null;
let lastHandledSubmissionId = null;
let polling = false;

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  const msg = event.data;
  if (!msg || msg.source !== 'leetlog-page' || msg.type !== 'SUBMITTED') return;
  pollForAccepted();
});

async function lcQuestionNumber(slug) {
  try {
    const data = await lcGraphql(
      `query questionNumber($titleSlug: String!) {
         question(titleSlug: $titleSlug) { questionFrontendId }
       }`,
      { titleSlug: slug }
    );
    return data?.question?.questionFrontendId || null;
  } catch {
    return null;
  }
}

function numberedTitle() {
  return state.number ? `${state.number}. ${state.title}` : state.title;
}

async function loadQuestionNumber(slug) {
  const number = await lcQuestionNumber(slug);
  if (state.slug !== slug) return;
  state.number = number;
}

async function lcLatestSubmission(slug) {
  const data = await lcGraphql(
    `query submissionList($offset: Int!, $limit: Int!, $questionSlug: String!) {
       questionSubmissionList(offset: $offset, limit: $limit, questionSlug: $questionSlug) {
         submissions { id statusDisplay lang langName runtime memory timestamp }
       }
     }`,
    { offset: 0, limit: 1, questionSlug: slug }
  );
  return data?.questionSubmissionList?.submissions?.[0] || null;
}

async function lcSubmissionDetails(id) {
  const data = await lcGraphql(
    `query submissionDetails($submissionId: Int!) {
       submissionDetails(submissionId: $submissionId) {
         code runtimeDisplay memoryDisplay runtimePercentile memoryPercentile
         lang { name verboseName }
       }
     }`,
    { submissionId: Number(id) }
  );
  return data?.submissionDetails || null;
}

async function pollForAccepted(attempt = 0) {
  if (polling && attempt === 0) return;
  polling = true;
  let scheduled = false;

  try {
    if (!els || !state.slug) return;

    const sub = await lcLatestSubmission(state.slug).catch(() => null);
    const isNew = sub && String(sub.id) !== String(lastHandledSubmissionId);

    const isRecent = sub && (!sub.timestamp || Date.now() / 1000 - Number(sub.timestamp) < 300);

    if (sub && isNew && isRecent && sub.statusDisplay === 'Accepted') {
      lastHandledSubmissionId = sub.id;
      await offerToCommit(sub);
      return;
    }

    if (attempt < 3) {
      scheduled = true;
      setTimeout(() => pollForAccepted(attempt + 1), 1500 * (attempt + 1));
    }
  } finally {

    if (!scheduled) polling = false;
  }
}

async function offerToCommit(sub) {
  const { askSolutions } = await chrome.storage.local.get('askSolutions');
  polling = false;
  if (askSolutions === false || !els) return;

  const details = await lcSubmissionDetails(sub.id).catch(() => null);
  const code = details?.code || '';
  if (!code.trim()) return;

  pendingSubmission = {
    code,
    langSlug: sub.lang || details?.lang?.name || '',
    prettyLang: sub.langName || details?.lang?.verboseName || '',
    runtime: details?.runtimeDisplay || sub.runtime || '',
    memory: details?.memoryDisplay || sub.memory || '',
  };

  const bits = [pendingSubmission.runtime, pendingSubmission.memory].filter(Boolean);
  if (Number.isFinite(details?.runtimePercentile)) {
    bits.push(`beats ${details.runtimePercentile.toFixed(0)}%`);
  }
  els.askText.textContent = bits.length
    ? `Accepted (${bits.join(' · ')}) — save this solution?`
    : 'Accepted — save this solution?';
  els.ask.classList.add('ln-on');

  refreshLeetCodeStreak(true);
}

function solutionToNotes() {
  if (!pendingSubmission) return;

  const { code } = pendingSubmission;
  const lang = pendingSubmission.langSlug || pendingSubmission.prettyLang || '';
  insertAtCursor(fencedBlock(code, lang));
  queueDraftSave();

  const lines = code.trimEnd().split('\n').length;
  pendingSubmission = null;
  els.ask.classList.remove('ln-on');
  setStatus('modified', `${lines} lines added to your note — unsaved changes`);
}

async function commitSolution() {
  if (!pendingSubmission) return;

  els.askYes.disabled = true;
  els.askYes.textContent = 'Committing…';

  const res = await chrome.runtime.sendMessage({
    type: 'SAVE_SOLUTION',
    slug: state.slug,
    title: numberedTitle(),
    code: pendingSubmission.code,
    lang: pendingSubmission.langSlug,
  });

  els.askYes.disabled = false;
  els.askYes.textContent = 'Commit';

  if (res.error) {
    setStatus('error', res.error);
    if (res.authFailed) showEmptyState('expired');
    return;
  }
  if (!res.configured) {
    els.ask.classList.remove('ln-on');
    showEmptyState(res.signedIn ? 'noRepo' : 'signedOut');
    return;
  }

  pendingSubmission = null;
  els.ask.classList.remove('ln-on');
  setStatus('saved', `solution committed to ${res.path}`);
}

function watchForVerdictInDom() {
  let queued = false;

  const check = () => {
    queued = false;
    if (!els) return;
    const el = document.querySelector('[data-e2e-locator="submission-result"]');
    if (!el || !/accepted/i.test(el.textContent || '')) return;
    pollForAccepted();
  };

  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(check);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  check();
}

const LANG_FENCE = {
  python3: 'python', python: 'python', cpp: 'cpp', c: 'c', java: 'java',
  javascript: 'javascript', typescript: 'typescript', csharp: 'csharp',
  golang: 'go', go: 'go', kotlin: 'kotlin', swift: 'swift', ruby: 'ruby',
  scala: 'scala', rust: 'rust', php: 'php', dart: 'dart', elixir: 'elixir',
  erlang: 'erlang', racket: 'racket', mysql: 'sql', mssql: 'sql',
  oraclesql: 'sql', postgresql: 'sql', bash: 'bash',
};

function requestEditorCode(timeoutMs = 2000) {
  return new Promise((resolve) => {
    const onMessage = (event) => {
      if (event.source !== window) return;
      const msg = event.data;
      if (!msg || msg.source !== 'leetlog-page' || msg.type !== 'CODE') return;
      cleanup();
      resolve(msg);
    };

    const timer = setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
    }

    window.addEventListener('message', onMessage);
    window.postMessage({ source: 'leetlog', type: 'GET_CODE' }, '*');
  });
}

async function lastSubmittedCode() {
  try {
    const sub = await lcLatestSubmission(state.slug);
    if (!sub) return null;
    const details = await lcSubmissionDetails(sub.id);
    if (!details?.code) return null;
    return { code: details.code, lang: sub.lang || details.lang?.name || '' };
  } catch {
    return null;
  }
}

function insertAtCursor(text) {
  const ta = els.textarea;
  const at = ta.selectionStart ?? ta.value.length;
  const before = ta.value.slice(0, at);
  const after = ta.value.slice(ta.selectionEnd ?? at);

  const lead = !before || before.endsWith('\n') ? text.replace(/^\n/, '') : text;

  ta.value = before + lead + after;
  const caret = before.length + lead.length;
  ta.setSelectionRange(caret, caret);
  ta.focus();
}

function fencedBlock(code, lang) {
  const body = code.trimEnd();
  const longest = (body.match(/`+/g) || []).reduce((n, run) => Math.max(n, run.length), 0);
  const fence = '`'.repeat(Math.max(3, longest + 1));
  const label = LANG_FENCE[(lang || '').toLowerCase()] || lang || '';
  return `\n${fence}${label}\n${body}\n${fence}\n`;
}

function insertCode(code, lang, note) {
  insertAtCursor(fencedBlock(code, lang));
  queueDraftSave();
  const lines = code.trimEnd().split('\n').length;
  setStatus('modified', `inserted ${lines} line${lines === 1 ? '' : 's'}${note ? ` ${note}` : ''}`);
}

async function insertCodeBlock() {
  const label = els.importBtn.textContent;
  els.importBtn.disabled = true;
  els.importBtn.textContent = '{ } reading the editor…';

  try {
    const res = await requestEditorCode();

    if (res?.code?.trim()) {
      insertCode(res.code, res.lang);
      return;
    }

    const reason = res ? res.reason : 'no-reply';
    if (reason === 'empty') {
      setStatus(null, 'the editor is empty');
      return;
    }

    els.importBtn.textContent = '{ } editor unreachable — fetching…';
    const fallback = await lastSubmittedCode();

    if (fallback) {
      insertCode(fallback.code, fallback.lang, '— your last submitted code');
      return;
    }
    setStatus('error', `couldn't read the editor (${reason}) — submit once, or copy it in`);
  } finally {
    els.importBtn.disabled = false;
    els.importBtn.textContent = label;
  }
}

function setMinimized(minimized) {
  els.panel.classList.toggle('ln-hidden', minimized);
  els.tab.classList.toggle('ln-hidden', !minimized);
  if (minimized) refreshTab();

  else state.restoredAt = Date.now();
}

function refreshTab() {
  const unsaved = els.textarea.value !== state.lastSavedContent;
  els.tabDot.classList.toggle('ln-on', unsaved);
  els.tab.setAttribute('aria-label', unsaved ? 'Open notes — unsaved changes' : 'Open notes');
}

function makeDraggable(panelEl, handleEl) {
  let dragging = false, startX, startY, startRight, startBottom;

  handleEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.ln-icon-btn')) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = root.getBoundingClientRect();
    startRight = window.innerWidth - rect.right;
    startBottom = window.innerHeight - rect.bottom;
    handleEl.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxRight = Math.max(8, window.innerWidth - 90);
    const maxBottom = Math.max(8, window.innerHeight - 60);
    root.style.right = `${clamp(startRight - dx, 8, maxRight)}px`;
    root.style.bottom = `${clamp(startBottom - dy, 8, maxBottom)}px`;
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    handleEl.style.cursor = 'grab';
  });
}

function makeResizable(panelEl, gripEl, dir) {
  let resizing = false, moved = false;
  let startX, startY, startW, startH, startRight, startBottom;

  gripEl.addEventListener('mousedown', (e) => {
    resizing = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = panelEl.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    startW = rect.width;
    startH = rect.height;
    startRight = window.innerWidth - rootRect.right;
    startBottom = window.innerHeight - rootRect.bottom;
    e.preventDefault();
    e.stopPropagation();
  });

  window.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    moved = true;

    const w = clamp(startW + dir.x * (e.clientX - startX), 260, window.innerWidth - 40);
    const h = clamp(startH + dir.y * (e.clientY - startY), 200, window.innerHeight - 40);
    panelEl.style.width = `${w}px`;
    panelEl.style.height = `${h}px`;

    if (dir.x === 1) root.style.right = `${Math.max(8, startRight - (w - startW))}px`;
    if (dir.y === 1) root.style.bottom = `${Math.max(8, startBottom - (h - startH))}px`;
  });

  window.addEventListener('mouseup', () => {
    if (!resizing) return;
    resizing = false;

    if (!moved) return;
    const rect = panelEl.getBoundingClientRect();
    chrome.storage.local.set({
      panelW: Math.round(rect.width),
      panelH: Math.round(rect.height),
    });
  });
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

async function restoreSize() {
  const { panelW, panelH } = await chrome.storage.local.get(['panelW', 'panelH']);
  if (!els) return;
  if (Number.isFinite(panelW)) {
    els.panel.style.width = `${clamp(panelW, 280, window.innerWidth - 40)}px`;
  }
  if (Number.isFinite(panelH)) {
    els.panel.style.height = `${clamp(panelH, 220, window.innerHeight - 40)}px`;
  }
}

function renderPreview() {
  const content = els.textarea.value;
  els.previewPathText.textContent = state.path
    ? `${state.path}${state.sha ? '' : ' (new file)'}`
    : 'preview';
  els.previewBody.innerHTML = content.trim()
    ? markdownToHtml(content)
    : '<p class="ln-preview-empty">nothing to preview yet</p>';
}

function showPreview() {
  renderPreview();
  els.preview.style.display = 'block';
  root.querySelector('.ln-body').style.display = 'none';

  closeAllDropdowns();
  els.previewPath.append(els.copyBtn, els.moreWrap, els.previewBtn);
  els.toolstrip.classList.add('ln-hidden');
  setPreviewMode('edit');
}

function hidePreview() {
  els.preview.style.display = 'none';
  root.querySelector('.ln-body').style.display = 'flex';

  closeAllDropdowns();
  els.toolstrip.classList.remove('ln-hidden');
  els.toolstrip.append(els.copyBtn, els.moreWrap, els.previewBtn);
  setPreviewMode('preview');
  reflowToolbar();
}

function togglePreview() {
  if (els.preview.style.display === 'block') hidePreview();
  else showPreview();
}

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

function getMarked() {
  const found =
    (typeof marked !== 'undefined' && marked) ||
    globalThis.marked ||
    (typeof self !== 'undefined' && self.marked) ||
    (typeof window !== 'undefined' && window.marked);
  return found && typeof found.parse === 'function' ? found : null;
}

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
  const md = getMarked();

  if (!md) {

    console.warn('[leetlog] vendor/marked.umd.js did not load — reload the extension at chrome://extensions');
    return `<p class="ln-preview-empty">markdown renderer didn't load — reload LeetLog at chrome://extensions, then reload this page</p>`
      + `<pre><code>${escapeHtml(source)}</code></pre>`;
  }

  try {
    configureMarked(md);
    return md.parse(source);
  } catch (e) {
    console.debug('[leetlog] markdown parse failed:', e.message);
    return `<p>${escapeHtml(source)}</p>`;
  }
}

const LC_CACHE_MS = 10 * 60 * 1000;

async function lcGraphql(query, variables) {
  const csrf = document.cookie.match(/csrftoken=([^;]+)/);
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrf ? { 'x-csrftoken': csrf[1] } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`leetcode graphql ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

async function lcUsername() {
  const data = await lcGraphql(`query { userStatus { username isSignedIn } }`);
  const status = data?.userStatus;
  return status?.isSignedIn ? status.username : null;
}

async function lcCalendar(username, year) {
  const data = await lcGraphql(
    `query userProfileCalendar($username: String!, $year: Int) {
       matchedUser(username: $username) {
         userCalendar(year: $year) { streak totalActiveDays submissionCalendar }
       }
     }`,
    { username, year }
  );
  const cal = data?.matchedUser?.userCalendar;
  if (!cal) return {};

  let days = {};
  try { days = JSON.parse(cal.submissionCalendar || '{}'); } catch {  }

  return { days, totalActiveDays: cal.totalActiveDays, maxStreak: cal.streak };
}

function utcDayKey(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

function lcComputeStreak(dayKeys) {
  const set = new Set(dayKeys);
  const dayMs = 86400000;
  const todayMs = Date.parse(`${utcDayKey(Date.now())}T00:00:00Z`);

  let cursor = todayMs;
  const doneToday = set.has(utcDayKey(todayMs));
  if (!doneToday) cursor -= dayMs;

  let count = 0;
  while (set.has(utcDayKey(cursor))) {
    count++;
    cursor -= dayMs;
  }
  return { current: count, doneToday, total: set.size };
}

async function fetchLeetCodeStreak() {
  const cached = await chrome.storage.local.get(['lcStreak', 'lcStreakAt']);
  if (cached.lcStreak && Date.now() - (cached.lcStreakAt || 0) < LC_CACHE_MS) {
    return cached.lcStreak;
  }

  const username = await lcUsername();
  if (!username) return { signedOut: true, current: 0, doneToday: false, total: 0 };

  const year = new Date().getUTCFullYear();
  const thisYear = await lcCalendar(username, year);
  let keys = Object.keys(thisYear.days || {}).map((sec) => utcDayKey(Number(sec) * 1000));

  if (keys.includes(`${year}-01-01`)) {
    const lastYear = await lcCalendar(username, year - 1);
    keys = keys.concat(Object.keys(lastYear.days || {}).map((sec) => utcDayKey(Number(sec) * 1000)));
  }

  const streak = {
    ...lcComputeStreak(keys),
    username,
    totalActiveDays: thisYear.totalActiveDays ?? null,
    maxStreak: thisYear.maxStreak ?? null,
  };
  await chrome.storage.local.set({ lcStreak: streak, lcStreakAt: Date.now() });
  return streak;
}

async function refreshLeetCodeStreak(force) {
  try {
    if (force) await chrome.storage.local.remove(['lcStreak', 'lcStreakAt']);
    renderLeetCodeStreak(await fetchLeetCodeStreak());
  } catch (e) {

    console.debug('[leetlog] streak lookup failed:', e.message);
  }
}

let notesStreak = null;
let lcStreak = null;

function renderLeetCodeStreak(lc) {
  if (lc) lcStreak = lc;
  lc = lcStreak;
  if (!els) return;

  if (!lc || lc.signedOut) {
    els.streak.classList.remove('ln-on');
    return;
  }
  els.streakN.textContent = lc.current;
  els.streak.classList.add('ln-on');
  els.streak.classList.toggle('ln-cold', !lc.doneToday);

  const lines = [];
  if (!lc.current) lines.push('no streak going — one problem today starts it');
  else if (lc.doneToday) lines.push(`${lc.current}-day LeetCode streak`);
  else lines.push(`${lc.current}-day LeetCode streak — solve one today to keep it`);

  if (lc.maxStreak) lines.push(`max streak this year: ${lc.maxStreak}`);
  if (lc.totalActiveDays) lines.push(`${lc.totalActiveDays} active days this year`);
  if (notesStreak?.current) lines.push(`notes committed ${notesStreak.current} days running`);
  els.streak.title = lines.join('\n');
}

function renderStreak(streak) {
  notesStreak = streak || null;
  if (!els) return;
  renderLeetCodeStreak(null);
}

const DRAFT_DEBOUNCE_MS = 600;
const SYNC_DEBOUNCE_MS = 10000;
const SYNC_DRAFT_MAX_BYTES = 4000;
const SYNC_DRAFT_KEEP = 12;

let draftTimer = null;
let syncTimer = null;

const draftKey = (slug) => `draft:${slug}`;

function queueDraftSave() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(saveDraft, DRAFT_DEBOUNCE_MS);
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncDraft, SYNC_DEBOUNCE_MS);
}

async function saveDraft() {
  if (!els || !state.slug) return;
  await flushDraft(state.slug, els.textarea.value, state.lastSavedContent);
}

async function flushDraft(slug, content, committed) {
  if (!slug) return;
  const key = draftKey(slug);

  if (content === committed) {
    await chrome.storage.local.remove(key);
    return;
  }
  await chrome.storage.local.set({ [key]: { content, at: Date.now() } });
}

async function syncDraft() {
  if (!els || !state.slug) return;
  const key = draftKey(state.slug);
  const content = els.textarea.value;

  try {
    if (content === state.lastSavedContent || content.length > SYNC_DRAFT_MAX_BYTES) {
      await chrome.storage.sync.remove(key);
      return;
    }
    await chrome.storage.sync.set({ [key]: { content, at: Date.now() } });
    await pruneSyncedDrafts();
  } catch {

  }
}

async function pruneSyncedDrafts() {
  const all = await chrome.storage.sync.get(null);
  const drafts = Object.entries(all)
    .filter(([k]) => k.startsWith('draft:'))
    .sort((a, b) => (b[1]?.at || 0) - (a[1]?.at || 0));

  const stale = drafts.slice(SYNC_DRAFT_KEEP).map(([k]) => k);
  if (stale.length) await chrome.storage.sync.remove(stale);
}

async function clearDraft(slug) {
  clearTimeout(draftTimer);
  clearTimeout(syncTimer);
  const key = draftKey(slug);
  await chrome.storage.local.remove(key);
  try { await chrome.storage.sync.remove(key); } catch {  }
}

async function restoreDraft(committed) {
  const key = draftKey(state.slug);
  const local = (await chrome.storage.local.get(key))[key];
  let remote = null;
  try { remote = (await chrome.storage.sync.get(key))[key]; } catch {  }

  const best = [local, remote]
    .filter((d) => d && typeof d.content === 'string')
    .sort((a, b) => (b.at || 0) - (a.at || 0))[0];
  if (!best) return false;

  if (best.content === committed) {
    await clearDraft(state.slug);
    return false;
  }
  els.textarea.value = best.content;
  return true;
}

function adoptRemoteCommit(info) {
  if (!els || !info || info.slug !== state.slug) return;

  const mine = els.textarea.value;
  const wasClean = mine === state.lastSavedContent;

  state.sha = info.sha;
  state.lastSavedContent = info.content;

  if (wasClean) {
    els.textarea.value = info.content;
    setStatus('saved', 'updated from another tab');
  } else {
    setStatus('modified', 'committed in another tab — yours is still unsaved');
  }
}

async function applyTheme() {
  if (!root) return;
  const { theme } = await chrome.storage.local.get('theme');
  root.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
}

function setStatus(kind, text) {
  els.statusDot.className = `ln-dot ${kind ? `ln-dot-${kind}` : ''}`;
  els.statusText.textContent = text;
}

const EMPTY_STATE_COPY = {
  signedOut: {
    text: 'Connect GitHub to start committing notes on problems you solve.',
    button: 'Connect GitHub',
  },
  noRepo: {
    text: "You're signed in to GitHub — now pick or create a repo in Settings to start committing notes.",
    button: 'Pick a repo',
  },
  expired: {
    text: 'Your GitHub sign-in expired — sign in again in Settings to keep committing notes.',
    button: 'Sign in again',
  },
};

function showEmptyState(kind = 'signedOut') {
  const copy = EMPTY_STATE_COPY[kind] || EMPTY_STATE_COPY.signedOut;
  els.emptyText.textContent = copy.text;
  els.connectBtn.textContent = copy.button;
  els.emptyState.style.display = 'block';
  els.mainState.style.display = 'none';
  els.panel.style.height = 'auto';
}

function showMainState() {
  els.emptyState.style.display = 'none';
  els.mainState.style.display = 'flex';
  if (els.panel.style.height === 'auto') els.panel.style.height = '';
  restoreSize();
}

async function loadForCurrentProblem() {
  if (!els) return;
  pendingSubmission = null;
  els.ask.classList.remove('ln-on');

  const leaving = state.slug;
  if (leaving) {
    clearTimeout(draftTimer);
    clearTimeout(syncTimer);
    await flushDraft(leaving, els.textarea.value, state.lastSavedContent);
  }

  state.slug = getSlugFromUrl();
  if (!state.slug) return;
  state.title = getTitleFromDocument();
  state.number = null;
  els.titleText.textContent = state.title;
  loadQuestionNumber(state.slug);

  setStatus(null, 'reading…');
  els.commitBtn.disabled = true;
  state.pendingCommit = false;
  els.commitBtn.textContent = 'Commit note';
  els.commitBtn.style.display = '';
  els.confirm.classList.remove('ln-on');
  hidePreview();

  const res = await chrome.runtime.sendMessage({ type: 'LOAD_NOTE', slug: state.slug });

  if (res.error) {
    if (res.authFailed) {
      showEmptyState('expired');
      return;
    }
    showMainState();
    els.textarea.value = '';
    setStatus('error', res.error);
    els.commitBtn.disabled = false;
    return;
  }

  if (!res.configured) {
    showEmptyState(res.signedIn ? 'noRepo' : 'signedOut');
    return;
  }

  showMainState();
  state.sha = res.sha;
  state.path = res.path || null;
  state.repo = res.repo || null;
  renderStreak(res.streak);
  state.lastSavedContent = res.content || '';
  els.textarea.value = state.lastSavedContent;

  if (await restoreDraft(state.lastSavedContent)) {
    setStatus('modified', 'restored your unsaved draft');
  } else {
    setStatus(state.sha ? 'saved' : null, state.sha ? 'up to date' : 'no note yet');
  }
  els.commitBtn.disabled = false;
}

function onCommitClick() {
  if (state.saving) return;
  if (Date.now() - state.restoredAt < 400) return;

  if (state.pendingCommit) {
    state.pendingCommit = false;
    commitNote();
    return;
  }

  const content = els.textarea.value;
  if (content === state.lastSavedContent) {
    setStatus('saved', 'up to date');
    return;
  }

  state.pendingCommit = true;
  showPreview();
  setPreviewMode('cancel');

  const verb = state.sha ? 'Update' : 'Create';
  const where = state.repo ? `${state.repo}` : 'your repo';
  els.confirmText.innerHTML =
    `${verb} <b></b> in <b></b><span>Check the note below, then confirm.</span>`;
  const marks = els.confirmText.querySelectorAll('b');
  marks[0].textContent = state.path || 'this note';
  marks[1].textContent = where;
  els.confirm.classList.add('ln-on');

  els.commitBtn.style.display = 'none';
  setStatus('modified', 'waiting for you to confirm');
}

function cancelCommit() {
  state.pendingCommit = false;
  state.pendingDelete = false;
  els.confirmYes.textContent = 'Yes, commit';
  els.confirm.classList.remove('ln-on');
  els.commitBtn.style.display = '';
  hidePreview();
  els.commitBtn.textContent = 'Commit note';
  setStatus('modified', 'unsaved changes');
}

async function commitNote() {
  const content = els.textarea.value;

  state.saving = true;
  els.commitBtn.disabled = true;
  els.commitBtn.textContent = 'Committing…';
  setStatus(null, 'committing…');

  const res = await chrome.runtime.sendMessage({
    type: 'SAVE_NOTE',
    slug: state.slug,
    title: numberedTitle(),
    content,
    sha: state.sha,
  });

  state.saving = false;
  els.commitBtn.disabled = false;
  els.commitBtn.textContent = 'Commit note';
  els.commitBtn.style.display = '';
  els.confirm.classList.remove('ln-on');
  hidePreview();

  if (res.error) {
    setStatus('error', res.error);
    return;
  }
  if (!res.configured) {
    showEmptyState(res.signedIn ? 'noRepo' : 'signedOut');
    return;
  }

  if (res.conflict) {

    state.sha = res.sha;
    setStatus('error', 'this note changed on GitHub — commit again to overwrite it');
    return;
  }

  state.sha = res.sha;
  state.lastSavedContent = content;
  clearDraft(state.slug);

  chrome.storage.local.set({
    [`committed:${state.slug}`]: { slug: state.slug, sha: res.sha, content, at: Date.now() },
  });
  renderStreak(res.streak);
  refreshLeetCodeStreak(true);
  setStatus('saved', res.streak && res.streak.current > 1
    ? `committed — ${res.streak.current} day streak`
    : 'committed');
}

function showPanel() {
  if (hostEl) return;
  injectPanel();
  loadForCurrentProblem();
  refreshLeetCodeStreak(false);
}

function hidePanel() {
  if (!hostEl) return;

  if (els && state.slug) {
    flushDraft(state.slug, els.textarea.value, state.lastSavedContent);
    syncDraft();
  }

  hostEl.remove();
  hostEl = null;
  root = null;
  els = null;
}

async function boot() {
  const { enabled } = await chrome.storage.local.get('enabled');
  if (enabled !== false) showPanel();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.theme) applyTheme();
      if (changes[`committed:${state.slug}`]) adoptRemoteCommit(changes[`committed:${state.slug}`].newValue);
      if (changes.enabled) {
        if (changes.enabled.newValue === false) hidePanel();
        else showPanel();
      }
    }
  });

  watchForVerdictInDom();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {

      saveDraft();
      syncDraft();
      return;
    }
    refreshLeetCodeStreak(false);
  });

  window.addEventListener('pagehide', () => {
    if (!els || !state.slug) return;
    flushDraft(state.slug, els.textarea.value, state.lastSavedContent);
    syncDraft();
  });

  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      loadForCurrentProblem();

      refreshLeetCodeStreak(true);
    }
  }, 800);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
