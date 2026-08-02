import type { UserType } from '~/config/portals'
import type { PortalKey } from '~/config/portals'

export type { UserType } from '~/config/portals'

export interface AuthUser {
  id: string
  name: string
  email: string
  type: UserType
  crmv?: string | null
  crm?: string | null
  status?: 'pending' | 'active' | 'rejected' | 'suspended'
}

interface AuthResponse {
  user: AuthUser
}

// Chave apenas do objeto de usuário (dado não-sensível) para hidratar a UI.
// O token de sessão vive em cookies httpOnly no servidor — inacessível ao JS,
// o que protege contra XSS. A autoridade da sessão é sempre o cookie.
const USER_KEY = 'auth:user'

function clearStoredUser() {
  if (import.meta.client) {
    localStorage.removeItem(USER_KEY)
    // Limpa a chave legada do token (migração do modelo localStorage → cookie).
    localStorage.removeItem('auth:token')
  }
}

// Deduplica refreshes concorrentes: várias requisições que tomem 401 ao mesmo
// tempo compartilham uma única chamada a /auth/refresh.
let refreshInFlight: Promise<boolean> | null = null

export function useAuth() {
  const user = useState<AuthUser | null>('auth:user', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(USER_KEY)
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
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    }
  }

  async function login(email: string, password: string, portal?: PortalKey): Promise<void> {
    const config = useRuntimeConfig()
    const data = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: { email, password, portal },
      // Necessário para o navegador aceitar/enviar os cookies de sessão.
      credentials: 'include',
    })
    persist(data)
  }

  async function register(payload: Record<string, unknown>): Promise<void> {
    const config = useRuntimeConfig()
    const data = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/register`, {
      method: 'POST',
      body: payload,
      credentials: 'include',
    })
    persist(data)
  }

  async function logout() {
    const config = useRuntimeConfig()
    try {
      // Revoga o refresh token e limpa os cookies no servidor.
      await $fetch(`${config.public.apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Mesmo se falhar, seguimos limpando o estado local.
    }
    user.value = null
    clearStoredUser()
    navigateTo('/')
  }

  /**
   * Tenta renovar a sessão via cookie de refresh (httpOnly). Retorna true se
   * renovou (novos cookies emitidos), false caso contrário. Concorrente-seguro.
   */
  function tryRefresh(): Promise<boolean> {
    if (!import.meta.client) return Promise.resolve(false)
    if (refreshInFlight) return refreshInFlight

    const config = useRuntimeConfig()
    refreshInFlight = $fetch<AuthResponse>(`${config.public.apiBase}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((data) => {
        persist(data)
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null
      })

    return refreshInFlight
  }

  /**
   * Encerra a sessão local (sem chamar o backend) por expiração/invalidez e
   * leva ao login preservando a rota atual. Usa window.location porque pode
   * ser chamado de dentro de um callback assíncrono de fetch, fora do contexto
   * do Nuxt. Idempotente: não redireciona se já estiver na tela de login.
   */
  function handleSessionExpired() {
    const wasLoggedIn = !!user.value
    user.value = null
    clearStoredUser()
    if (!import.meta.client) return
    if (window.location.pathname === '/login') return
    const params = new URLSearchParams({ expired: '1' })
    if (wasLoggedIn) {
      params.set('redirect', window.location.pathname + window.location.search)
    }
    window.location.assign(`/login?${params.toString()}`)
  }

  /**
   * Guard de rota: com o token em cookie httpOnly, o cliente não consegue mais
   * validar a expiração localmente. Basta a presença do usuário; a validade
   * real é garantida pelo fluxo de refresh no `useApi` (401 → refresh → retry)
   * e pelo refresh silencioso no boot (`auth.client.ts`).
   */
  function ensureValidSession(): boolean {
    return !!user.value
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    isVet,
    login,
    register,
    logout,
    tryRefresh,
    handleSessionExpired,
    ensureValidSession,
  }
}
