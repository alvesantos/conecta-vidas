export interface Perk {
  icon: string
  label: string
}

export interface Plan {
  id: string | number
  title: string
  color: string
  focus: string
  focus_desc: string
  price: number | string
  perks: Perk[]
  is_active?: boolean
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  paid_value: number | string
  status: 'active' | 'canceled'
  started_at?: string
  plan_title?: string
  plan_price?: number | string
}
