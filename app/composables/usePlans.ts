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

  function checkout(plan_id: string) {
    return api<{ subscriptionId: string; checkoutUrl: string }>(`/patient/plans/${plan_id}/checkout`, {
      method: 'POST',
    })
  }

  function createPlan(payload: Partial<Plan>) {
    return api<Plan>('/admin/plans', { method: 'POST', body: payload })
  }

  function updatePlan(id: string, payload: Partial<Plan>) {
    return api<Plan>(`/admin/plans/${id}`, { method: 'PUT', body: payload })
  }

  function deletePlan(id: string) {
    return api(`/admin/plans/${id}`, { method: 'DELETE' })
  }

  return {
    listPublic,
    listAdmin,
    getMySubscription,
    checkout,
    createPlan,
    updatePlan,
    deletePlan,
  }
}
