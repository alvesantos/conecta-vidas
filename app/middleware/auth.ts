// Middleware de rota: redireciona para /login se o usuário não estiver autenticado.
// Roda apenas no cliente porque o token fica no localStorage (sem cookie de sessão).
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})
