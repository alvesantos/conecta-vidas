export interface Perk {
  icon: string
  label: string
}

export interface Plan {
  title: string
  focus: string
  focus_desc: string
  price: number
  perks: Perk[]
}