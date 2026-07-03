export function useApi() {
  const config = useRuntimeConfig()
  const { getToken, handleSessionExpired } = useAuth()

  function api<T>(path: string, options?: Parameters<typeof $fetch>[1]) {
    const token = getToken()

    return $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers as Record<string, string> ?? {}),
      },
      onResponseError({ response }) {
        // Sessão inválida/expirada: limpa o estado local e leva ao login,
        // evitando o estado inconsistente de "parece logado mas dá erro".
        if (response.status === 401 || response.status === 403) {
          handleSessionExpired()
        }
      },
    })
  }

  return { api }
}
