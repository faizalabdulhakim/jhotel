export default defineNuxtRouteMiddleware(async (to, from) => {
  const publicRoutes = ["/auth/login", "/auth/register"];
  const token = useCookie("token").value;

  // if (!publicRoutes.includes(to.path) && !token) {
  //   return navigateTo("/auth/login");
  // }

  // if (publicRoutes.includes(to.path) && status) {
  //   return navigateTo("/");
  // }

  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.API_BASE_URL;

    type ValidateTokenResponse = {
      valid: boolean;
    };

    const response = await $fetch<ValidateTokenResponse>(
      `${apiUrl}/auth/validateToken`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.valid && !publicRoutes.includes(to.path)) {
      return navigateTo("/auth/login");
    }

    if (response.valid && publicRoutes.includes(to.path)) {
      return navigateTo("/");
    }
  } catch (error) {
    console.error("Token validation error:", error);
    if (!publicRoutes.includes(to.path)) {
      return navigateTo("/auth/login");
    }
  }
});
