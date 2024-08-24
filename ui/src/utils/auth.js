// const runtimeConfig = useRuntimeConfig();

export function isAuthenticated() {
  // TODO: check cookie

  return true;
}

export function isInsideTgBot() {
  return Boolean(window.Telegram?.WebApp.initData);
}

export function useTgWebAppUserId() {
  // TODO: check hashsum
  if (window.Telegram?.WebApp.initDataUnsafe.user) {
    return window.Telegram.WebApp.initDataUnsafe.user.id;
  }

  // dev user id or undefined
  // return runtimeConfig.public.devTgUserId;
}
