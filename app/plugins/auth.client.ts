// Roda apenas no cliente, após a hidratação do SSR.
// Restaura o usuário do localStorage (dado não-sensível) e valida a sessão
// contra os cookies httpOnly via um refresh silencioso — que também renova
// o access token curto no início de cada carregamento do app.
export default defineNuxtPlugin(() => {
  const { user, tryRefresh } = useAuth()

  const storedUser = localStorage.getItem('auth:user')
  // Limpa a chave legada do token (modelo antigo em localStorage).
  localStorage.removeItem('auth:token')

  if (!storedUser) {
    user.value = null
    return
  }

  // Hidrata a UI otimisticamente com o usuário salvo.
  if (!user.value) {
    try {
      user.value = JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('auth:user')
      user.value = null
      return
    }
  }

  // Valida a sessão em segundo plano: se o refresh token estiver expirado/
  // revogado, encerra o estado local (sem forçar redirect — o usuário pode
  // estar em página pública; os guards cuidam das rotas protegidas).
  tryRefresh().then((ok) => {
    if (!ok) {
      user.value = null
      localStorage.removeItem('auth:user')
    }
  })
})
