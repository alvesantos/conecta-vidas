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
    if (import.meta.client) {
      localStorage.removeItem('auth:user')
      localStorage.removeItem('auth:token')
    }
    navigateTo('/')
  }

  function getToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem('auth:token')
    }
    return null
  }

  return { user, isLoggedIn, isAdmin, isVet, login, register, logout, getToken }
}
