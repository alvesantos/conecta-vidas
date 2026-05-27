export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const { isLoggedIn, isVet } = useAuth()
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
  if (!isVet.value) {
    return navigateTo('/')
  }
})
