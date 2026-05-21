export function useApi() {
  const config = useRuntimeConfig()
  const { getToken } = useAuth()

  function api<T>(path: string, options?: Parameters<typeof $fetch>[1]) {
    const token = getToken()

    return $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers as Record<string, string> ?? {}),
      },
    })
  }

  return { api }
}
