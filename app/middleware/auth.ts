// Middleware de rota: exige sessão válida.
// Roda apenas no cliente: o usuário fica em useState/localStorage; o token de
// sessão vive em cookies httpOnly. A validade real do token é garantida pelo
// refresh silencioso no boot e pelo fluxo 401 → refresh → retry do useApi.
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { ensureValidSession } = useAuth()
  // Checa a presença da sessão antes de renderizar a rota protegida.
  if (!ensureValidSession()) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
