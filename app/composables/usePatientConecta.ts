export function usePatientConecta() {
  const open = useState('patient-conecta:open', () => false)
  return {
    open,
    show: () => { open.value = true },
    hide: () => { open.value = false },
  }
}
