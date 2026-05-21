// Middleware exclusivo do Backoffice: bloqueia quem não é admin.
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const { isLoggedIn, isAdmin } = useAuth()
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
