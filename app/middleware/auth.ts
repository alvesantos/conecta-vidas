// Middleware de rota: exige sessão válida.
// Roda apenas no cliente porque o token fica no localStorage (sem cookie de sessão).
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { ensureValidSession } = useAuth()
  // Valida a expiração do token antes de renderizar a rota protegida,
  // evitando o estado "página abre e só depois estoura 401".
  if (!ensureValidSession()) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
