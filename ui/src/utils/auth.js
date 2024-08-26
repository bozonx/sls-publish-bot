export function isAuthenticated() {
  // TODO: check cookie

  return true;
}

export function isInsideTgBot() {
  return Boolean(window.Telegram?.WebApp.initData);
}

export function getTgWebAppUserId() {
  // TODO: check hashsum
  if (window.Telegram?.WebApp.initDataUnsafe.user) {
    return window.Telegram.WebApp.initDataUnsafe.user.id;
  }

  // dev user id or undefined
  // return runtimeConfig.public.devTgUserId;
}

export async function authorizeViaBot(apiBaseUrl) {
  const tgUserId = getTgWebAppUserId();
  const url = `${apiBaseUrl}/users/auth-via-bot`;

  const res = await $fetch(url, {
    method: "POST",
    body: JSON.stringify({ tgUserId }),
  });

  return res.status === 200;
}

// export async function makeAuthHeaders() {
//   const jwtToken = (await window.cookieStore.get("apisessid"))?.value;
//
//   if (!jwtToken) return {};
//
//   return {
//     Authorization: `Bearer ${jwtToken}`,
//   };
// }
