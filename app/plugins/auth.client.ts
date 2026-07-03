// Roda apenas no cliente, após a hidratação do SSR.
// Restaura o usuário do localStorage caso o useState tenha iniciado como null no servidor.
export default defineNuxtPlugin(() => {
  const { user, getToken } = useAuth()

  const token = localStorage.getItem('auth:token')
  const storedUser = localStorage.getItem('auth:user')

  // Sem token ou usuário armazenado: nada a restaurar.
  if (!token || !storedUser) {
    localStorage.removeItem('auth:user')
    localStorage.removeItem('auth:token')
    user.value = null
    return
  }

  // getToken() valida a expiração; se expirado, já limpa a sessão e retorna null.
  if (!getToken()) return

  if (!user.value) {
    try {
      user.value = JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('auth:user')
      localStorage.removeItem('auth:token')
    }
  }
})
