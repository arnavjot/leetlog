

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  const msg = event.data;
  if (!msg || msg.source !== 'leetlog' || msg.type !== 'GET_CODE') return;

  let code = '';
  let lang = '';
  let reason = '';

  try {
    const api = window.monaco?.editor;
    if (!api) {

      reason = 'no-monaco';
    } else {
      let models = api.getModels?.() || [];
      if (!models.length && api.getEditors) {
        models = api.getEditors().map((ed) => ed.getModel?.()).filter(Boolean);
      }

      const model = models.find((m) => m.getValue().trim()) || models[0];
      if (!model) reason = 'no-model';
      else {
        code = model.getValue();
        lang = model.getLanguageId?.() || '';
        if (!code.trim()) reason = 'empty';
      }
    }
  } catch (err) {
    reason = 'threw: ' + (err?.message || err);
  }

  if (window.__leetlogDebug) console.log('[leetlog/page] GET_CODE ->', { reason, lang, length: code.length });
  window.postMessage({ source: 'leetlog-page', type: 'CODE', code, lang, reason }, '*');
});

const SUBMIT_RE = /\/submit\/?(\?|$)/;
const CHECK_RE = /\/check\/?(\?|$)/;

function ping(why) {
  if (window.__leetlogDebug) console.log('[leetlog/page] submission signal:', why);
  window.postMessage({ source: 'leetlog-page', type: 'SUBMITTED' }, '*');
}

const originalFetch = window.fetch;
window.fetch = function (...args) {
  const input = args[0];
  const url = typeof input === 'string' ? input : input?.url || '';
  if (SUBMIT_RE.test(url) || CHECK_RE.test(url)) ping(url);
  return originalFetch.apply(this, args);
};

const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  if (SUBMIT_RE.test(url || '') || CHECK_RE.test(url || '')) ping(url);
  return originalOpen.call(this, method, url, ...rest);
};
