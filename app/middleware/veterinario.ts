export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { ensureValidSession, isVet, isAdmin } = useAuth()
  if (!ensureValidSession()) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
  // O administrador também pode atuar como veterinário.
  if (!isVet.value && !isAdmin.value) {
    return navigateTo('/')
  }
})
