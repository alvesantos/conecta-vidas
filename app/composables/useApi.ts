export function useApi() {
  const config = useRuntimeConfig()

  function api<T>(path: string, options?: Parameters<typeof $fetch>[1]) {
    return $fetch<T>(`${config.public.apiBase}${path}`, options)
  }

  return { api }
}
