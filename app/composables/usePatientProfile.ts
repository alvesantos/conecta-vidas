export interface PatientPetProfile {
  id: string
  name: string
  species: string
  breed: string
  avatar_url?: string | null
}
export interface HumanDependentProfile {
  id: string
  name: string
  relationship: string
  birth_date: string
}

export type PatientProfile =
  | { key: string; kind: 'humana'; label: string; petId: null; dependentId: string | null }
  | { key: string; kind: 'veterinaria'; label: string; petId: string; dependentId: null }

export function usePatientProfile() {
  const { user } = useAuth()
  const { api } = useApi()
  const pets = useState<PatientPetProfile[]>('patient-profile:pets', () => [])
  const dependents = useState<HumanDependentProfile[]>('patient-profile:dependents', () => [])
  const loaded = useState('patient-profile:loaded', () => false)
  const loading = useState('patient-profile:loading', () => false)
  const activeKey = useCookie<string>('cv_patient_profile', { default: () => 'human' })

  const profiles = computed<PatientProfile[]>(() => [
    {
      key: 'human',
      kind: 'humana',
      label: user.value?.name ? `Titular · ${user.value.name}` : 'Titular',
      petId: null,
      dependentId: null,
    },
    ...dependents.value.map(dependent => ({
      key: `dependent:${dependent.id}`,
      kind: 'humana' as const,
      label: dependent.name,
      petId: null,
      dependentId: dependent.id,
    })),
    ...pets.value.map(pet => ({
      key: `pet:${pet.id}`,
      kind: 'veterinaria' as const,
      label: pet.name,
      petId: pet.id,
      dependentId: null,
    })),
  ])

  const activeProfile = computed(() =>
    profiles.value.find(profile => profile.key === activeKey.value) ?? profiles.value[0],
  )

  async function loadProfiles(force = false) {
    if ((loaded.value && !force) || loading.value) return
    loading.value = true
    try {
      const [petRows, dependentRows] = await Promise.all([
        api<PatientPetProfile[]>('/pets/me'),
        api<HumanDependentProfile[]>('/patient/dependents'),
      ])
      pets.value = petRows
      dependents.value = dependentRows
      if (!profiles.value.some(profile => profile.key === activeKey.value)) {
        activeKey.value = 'human'
      }
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  function selectProfile(key: string) {
    activeKey.value = profiles.value.some(profile => profile.key === key) ? key : 'human'
  }

  return { pets, dependents, profiles, activeKey, activeProfile, loading, loadProfiles, selectProfile }
}
