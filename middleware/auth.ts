export default defineNuxtRouteMiddleware((to, from) => {
  const publicRoute = ["/login", "/register"];

  const token = useCookie("token").value;

  if (!publicRoute.includes(to.path) && !token) {
    return navigateTo("/login");
  }
});
