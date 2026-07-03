export type UserType = 'tutor' | 'admin' | 'veterinario'

export interface AuthUser {
  id: string
  name: string
  email: string
  type: UserType
  crmv?: string | null
}

interface AuthResponse {
  token: string
  user: AuthUser
}

function clearStorage() {
  if (import.meta.client) {
    localStorage.removeItem('auth:user')
    localStorage.removeItem('auth:token')
  }
}

/**
 * Lê o `exp` (segundos) do payload do JWT sem depender de libs.
 * Retorna null se o token for inválido/ilegível.
 */
function getTokenExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const data = JSON.parse(json) as { exp?: number }
    return typeof data.exp === 'number' ? data.exp : null
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const exp = getTokenExp(token)
  if (exp === null) return false // sem exp: deixa o backend decidir
  // margem de 10s para evitar corrida com o relógio
  return Date.now() >= (exp - 10) * 1000
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth:user', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('auth:user')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.type === 'admin')
  const isVet = computed(() => user.value?.type === 'veterinario')

  function persist(data: AuthResponse) {
    user.value = data.user
    if (import.meta.client) {
      localStorage.setItem('auth:user', JSON.stringify(data.user))
      localStorage.setItem('auth:token', data.token)
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const config = useRuntimeConfig()
    const data = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: { email, password },
    })
    persist(data)
  }

  async function register(payload: Record<string, unknown>): Promise<void> {
    const config = useRuntimeConfig()
    const data = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/register`, {
      method: 'POST',
      body: payload,
    })
    persist(data)
  }

  function logout() {
    user.value = null
    clearStorage()
    navigateTo('/')
  }

  /**
   * Encerra a sessão por expiração/invalidez do token e leva ao login,
   * preservando a rota atual para retorno. Usa window.location porque pode
   * ser chamado de dentro de um callback assíncrono de fetch, fora do
   * contexto do Nuxt (onde navigateTo/useRoute não estão disponíveis).
   * Idempotente: não redireciona em looping caso já esteja na tela de login.
   */
  function handleSessionExpired() {
    const wasLoggedIn = !!user.value
    user.value = null
    clearStorage()
    if (!import.meta.client) return
    if (window.location.pathname === '/login') return
    const params = new URLSearchParams({ expired: '1' })
    if (wasLoggedIn) {
      params.set('redirect', window.location.pathname + window.location.search)
    }
    window.location.assign(`/login?${params.toString()}`)
  }

  /**
   * Verifica a validade da sessão para guards de rota. Se o token estiver
   * ausente ou expirado, limpa o estado local e retorna false — sem
   * redirecionar (quem chama decide o destino). Assim uma rota protegida
   * não chega a renderizar com sessão inválida para só depois estourar 401.
   */
  function ensureValidSession(): boolean {
    if (!import.meta.client) return false
    const token = localStorage.getItem('auth:token')
    if (token && !isTokenExpired(token)) return true
    user.value = null
    clearStorage()
    return false
  }

  /**
   * Retorna o token válido. Se estiver expirado, encerra a sessão e
   * retorna null — impedindo requests fadados ao 401.
   */
  function getToken(): string | null {
    if (!import.meta.client) return null
    const token = localStorage.getItem('auth:token')
    if (!token) return null
    if (isTokenExpired(token)) {
      handleSessionExpired()
      return null
    }
    return token
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    isVet,
    login,
    register,
    logout,
    handleSessionExpired,
    ensureValidSession,
    getToken,
  }
}
