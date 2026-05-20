export interface AuthUser {
  id: string
  name: string
  email: string
}

interface LoginResponse {
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

  async function login(email: string, password: string): Promise<void> {
    const config = useRuntimeConfig()

    const data = await $fetch<LoginResponse>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: { email, password },
    })

    user.value = data.user

    if (import.meta.client) {
      localStorage.setItem('auth:user', JSON.stringify(data.user))
      localStorage.setItem('auth:token', data.token)
    }
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

  return { user, isLoggedIn, login, logout, getToken }
}
