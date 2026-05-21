export interface Perk {
  icon: string
  label: string
}

export interface Plan {
  id: number
  title: string
  color: string
  focus: string
  focus_desc: string
  price: number
  perks: Perk[]
}