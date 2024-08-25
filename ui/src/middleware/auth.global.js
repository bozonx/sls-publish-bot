export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === "/login") return;
  else if (isAuthenticated()) return;

  if (isInsideTgBot()) {
    const { $config } = useNuxtApp();
    const apiBaseUrl = $config.public.apiBaseUrl;
    const isSuccess = await authorizeViaBot(apiBaseUrl);

    if (isSuccess) return;
    // else is something wrong - go to /login page
  }
  // means web env - got to login page
  return navigateTo("/login");
});
