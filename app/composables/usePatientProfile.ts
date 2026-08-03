export interface PatientPetProfile {
  id: string
  name: string
  species: string
  breed: string
  avatar_url?: string | null
}

export type PatientProfile =
  | { key: 'human'; kind: 'humana'; label: string; petId: null }
  | { key: string; kind: 'veterinaria'; label: string; petId: string }

export function usePatientProfile() {
  const { user } = useAuth()
  const { api } = useApi()
  const pets = useState<PatientPetProfile[]>('patient-profile:pets', () => [])
  const loaded = useState('patient-profile:loaded', () => false)
  const loading = useState('patient-profile:loading', () => false)
  const activeKey = useCookie<string>('cv_patient_profile', { default: () => 'human' })

  const profiles = computed<PatientProfile[]>(() => [
    {
      key: 'human',
      kind: 'humana',
      label: user.value?.name ? `Titular · ${user.value.name}` : 'Titular',
      petId: null,
    },
    ...pets.value.map(pet => ({
      key: `pet:${pet.id}`,
      kind: 'veterinaria' as const,
      label: pet.name,
      petId: pet.id,
    })),
  ])

  const activeProfile = computed(() =>
    profiles.value.find(profile => profile.key === activeKey.value) ?? profiles.value[0],
  )

  async function loadProfiles(force = false) {
    if ((loaded.value && !force) || loading.value) return
    loading.value = true
    try {
      pets.value = await api<PatientPetProfile[]>('/pets/me')
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

  return { pets, profiles, activeKey, activeProfile, loading, loadProfiles, selectProfile }
}
