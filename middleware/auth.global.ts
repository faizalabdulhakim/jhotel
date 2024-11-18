export default defineNuxtRouteMiddleware((to, from) => {
  const publicRoute = ["/auth/login", "/auth/register"];

  const token = useCookie("token").value;

  if (!publicRoute.includes(to.path) && !token) {
    return navigateTo("/auth/login");
  }

  if (publicRoute.includes(to.path) && token) {
    return navigateTo("/");
  }
});
