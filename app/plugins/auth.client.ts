// Roda apenas no cliente, após a hidratação do SSR.
// Restaura o usuário do localStorage caso o useState tenha iniciado como null no servidor.
export default defineNuxtPlugin(() => {
  const { user } = useAuth()

  const storedUser = localStorage.getItem('auth:user')
  if (storedUser && !user.value) {
    try {
      user.value = JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('auth:user')
      localStorage.removeItem('auth:token')
    }
  }
})
