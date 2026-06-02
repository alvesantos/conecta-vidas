export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const { isLoggedIn, isVet, isAdmin } = useAuth()
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
  // O administrador também pode atuar como veterinário.
  if (!isVet.value && !isAdmin.value) {
    return navigateTo('/')
  }
})
