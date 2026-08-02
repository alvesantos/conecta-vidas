import { PORTALS, isPortalKey, portalForUser } from '~/config/portals'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const portalKey = to.meta.portal
  if (!isPortalKey(portalKey)) return navigateTo('/')

  const { user, ensureValidSession } = useAuth()
  if (!ensureValidSession()) {
    return navigateTo({
      path: '/login',
      query: { portal: portalKey, redirect: to.fullPath },
    })
  }

  if (!user.value || !PORTALS[portalKey].allowedTypes.includes(user.value.type)) {
    return navigateTo(user.value ? portalForUser(user.value.type).home : '/login')
  }
})
