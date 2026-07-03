// Middleware exclusivo do Backoffice: bloqueia quem não é admin.
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { ensureValidSession, isAdmin } = useAuth()
  if (!ensureValidSession()) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
