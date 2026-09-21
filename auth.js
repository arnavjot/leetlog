

export const CLIENT_ID = 'Ov23liA2XhibhYyl32UY';

const SCOPE = 'repo';

const DEVICE_CODE_URL = 'https://github.com/login/device/code';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

export function isConfigured() {
  return !!CLIENT_ID;
}

export async function requestDeviceCode() {
  if (!CLIENT_ID) throw new Error('no OAuth client id — see auth.js');

  const res = await fetch(DEVICE_CODE_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, scope: SCOPE }),
  });

  if (!res.ok) throw new Error(`github said ${res.status} starting sign-in`);
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data;
}

export async function pollForToken(deviceCode) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  });

  const data = await res.json();

  if (data.access_token) return { status: 'token', token: data.access_token };

  switch (data.error) {
    case 'authorization_pending':
      return { status: 'pending' };
    case 'slow_down':

      return { status: 'slow_down', interval: data.interval || 10 };
    case 'expired_token':
      throw new Error('the code expired — start again');
    case 'access_denied':
      throw new Error('sign-in was cancelled on GitHub');
    default:
      throw new Error(data.error_description || data.error || 'sign-in failed');
  }
}

export async function signOut() {
  await chrome.storage.local.remove(['ghToken', 'ghLogin', 'ghAvatar', 'ghAuthKind']);
}
