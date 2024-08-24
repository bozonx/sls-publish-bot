export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/login") return;
  else if (isAuthenticated()) return;

  if (isInsideTgBot()) {
    // TODO: autenthicate via bot
    return;
  }

  // means web env - got to login page
  return navigateTo("/login");
});
