export function useApi() {
  const config = useRuntimeConfig()
  const { tryRefresh, handleSessionExpired } = useAuth()

  async function api<T>(path: string, options?: Parameters<typeof $fetch>[1]): Promise<T> {
    const url = `${config.public.apiBase}${path}`
    // `credentials: 'include'` envia os cookies httpOnly de sessão em toda
    // requisição — não há mais header Authorization montado no cliente.
    const requestOptions = {
      ...options,
      credentials: 'include' as const,
      headers: {
        ...(options?.headers as Record<string, string> ?? {}),
      },
    }

    try {
      return await $fetch<T>(url, requestOptions)
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status !== 401) throw err

      // Access token expirado: tenta renovar de forma transparente (via cookie
      // de refresh) e refaz a requisição uma única vez.
      const renewed = await tryRefresh()
      if (renewed) {
        return await $fetch<T>(url, requestOptions)
      }

      // Refresh falhou (refresh token expirado/revogado): encerra a sessão.
      handleSessionExpired()
      throw err
    }
  }

  return { api }
}
