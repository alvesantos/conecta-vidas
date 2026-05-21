import type { Plan, Subscription } from '../interfaces/plans'

export function usePlans() {
  const { api } = useApi()
  const config = useRuntimeConfig()

  function listPublic() {
    return $fetch<Plan[]>(`${config.public.apiBase}/plans`)
  }

  function listAdmin() {
    return api<Plan[]>('/admin/plans')
  }

  function getMySubscription() {
    return api<Subscription | null>('/subscriptions/me')
  }

  function subscribe(plan_id: string, paid_value = 0) {
    return api<Subscription>('/subscriptions', {
      method: 'POST',
      body: { plan_id, paid_value },
    })
  }

  function createPlan(payload: Partial<Plan>) {
    return api<Plan>('/admin/plans', { method: 'POST', body: payload })
  }

  function updatePlan(id: string, payload: Partial<Plan>) {
    return api<Plan>(`/admin/plans/${id}`, { method: 'PUT', body: payload })
  }

  return {
    listPublic,
    listAdmin,
    getMySubscription,
    subscribe,
    createPlan,
    updatePlan,
  }
}
