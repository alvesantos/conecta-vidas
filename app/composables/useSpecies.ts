export interface Option {
  label: string
  value: string
}

export const speciesOptions: Option[] = [
  { label: 'Canino', value: 'canino' },
  { label: 'Felino', value: 'felino' },
  { label: 'Anfíbio', value: 'anfibio' },
  { label: 'Ave', value: 'ave' },
  { label: 'Lagomorfo', value: 'lagomorfo' },
  { label: 'Mustelídeo', value: 'mustelideo' },
  { label: 'Organismo aquático', value: 'organismo_aquatico' },
  { label: 'Roedor', value: 'roedor' },
  { label: 'Pássaro', value: 'passaro' },
  { label: 'Réptil', value: 'reptil' },
]

// Mantém compatibilidade com os valores antigos (cachorro/gato).
const speciesLabelMap: Record<string, string> = {
  ...Object.fromEntries(speciesOptions.map((o) => [o.value, o.label])),
  cachorro: 'Canino',
  gato: 'Felino',
}

export function speciesLabel(value?: string | null): string {
  if (!value) return '—'
  return speciesLabelMap[value] ?? value.charAt(0).toUpperCase() + value.slice(1)
}

export function speciesIcon(value?: string | null): string {
  switch (value) {
    case 'felino':
    case 'gato':
      return 'i-mdi-cat'
    case 'canino':
    case 'cachorro':
      return 'i-mdi-dog'
    case 'ave':
    case 'passaro':
      return 'i-mdi-bird'
    case 'roedor':
      return 'i-mdi-rodent'
    case 'reptil':
    case 'anfibio':
      return 'i-mdi-snake'
    case 'organismo_aquatico':
      return 'i-mdi-fish'
    default:
      return 'i-mdi-paw'
  }
}

export const sexOptions: Option[] = [
  { label: 'Macho', value: 'macho' },
  { label: 'Fêmea', value: 'femea' },
  { label: 'Indefinido', value: 'indefinido' },
]

export function sexLabel(value?: string | null): string {
  if (!value) return '—'
  const found = sexOptions.find((o) => o.value === value)
  return found?.label ?? value
}
