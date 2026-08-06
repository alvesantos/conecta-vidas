export interface ActiveConsultation {
  id: string;
  tutor_name: string;
  pet_name: string | null;
  status: string;
  meet_link: string;
  notes: string;
  notes_visible_to_patient?: boolean;
}

/**
 * Estado global da consulta em andamento.
 *
 * Permite que o veterinário "remote" (minimize) a sala de consulta e navegue
 * para outras telas (ex.: prescrições) sem perder o link do Meet nem as
 * anotações. O estado vive no layout, então persiste entre as páginas.
 */
export function useActiveConsultation() {
  const { api } = useApi();
  const toast = useToast();

  const active = useState<ActiveConsultation | null>('active-consultation', () => null);
  // true = modal aberto em tela cheia; false = remotado (pílula flutuante).
  const isOpen = useState<boolean>('active-consultation-open', () => false);
  const saving = useState<boolean>('active-consultation-saving', () => false);
  const generatingLink = useState<boolean>('active-consultation-generating', () => false);
  const finalizing = useState<boolean>('active-consultation-finalizing', () => false);

  /** Abre a sala de consulta. A API cria a sala aleatória quando solicitado. */
  async function start(consultation: ActiveConsultation, autoGenerateLink = false) {
    active.value = { ...consultation };
    isOpen.value = true;

    if (autoGenerateLink && !active.value.meet_link) {
      await generateLink();
    }
  }

  /** "Remotar": minimiza a sala mantendo tudo salvo. */
  function minimize() {
    isOpen.value = false;
  }

  /** Reabre a sala remotada. */
  function resume() {
    isOpen.value = true;
  }

  async function generateLink() {
    if (!active.value) return;
    generatingLink.value = true;
    try {
      const room = await api<{ meet_link: string }>(`/consultations/${active.value.id}/room`);
      active.value.meet_link = room.meet_link;
      toast.add({ title: 'Sala preparada!', description: 'A videoconferência segura do atendimento está pronta.', color: 'success' });
    } catch {
      toast.add({ title: 'Erro', description: 'Falha ao gerar o link do Meet.', color: 'error' });
    } finally {
      generatingLink.value = false;
    }
  }

  /** Salva as anotações ao vivo (rascunho) sem finalizar a consulta. */
  async function saveNotes() {
    if (!active.value) return;
    saving.value = true;
    try {
      await api(`/vet/consultations/${active.value.id}/session`, {
        method: 'PATCH',
        body: { notes: active.value.notes, notes_visible_to_patient: active.value.notes_visible_to_patient === true },
      });
      toast.add({ title: 'Anotações salvas', description: 'Seu rascunho foi salvo.', color: 'success' });
    } catch {
      toast.add({ title: 'Erro', description: 'Falha ao salvar anotações.', color: 'error' });
    } finally {
      saving.value = false;
    }
  }

  /**
   * Finaliza a consulta: salva as anotações no prontuário do responsável
   * e marca a consulta como realizada. Limpa o estado global ao concluir.
   */
  async function finalize() {
    if (!active.value) return false;
    finalizing.value = true;
    try {
      await api(`/vet/consultations/${active.value.id}/status`, {
        method: 'PATCH',
        body: { status: 'realizada', notes: active.value.notes, notes_visible_to_patient: active.value.notes_visible_to_patient === true },
      });
      toast.add({ title: 'Consulta finalizada', description: 'As anotações foram salvas no prontuário do responsável.', color: 'success' });
      active.value = null;
      isOpen.value = false;
      return true;
    } catch (err: unknown) {
      const fetchErr = err as { data?: { error?: string } };
      toast.add({ title: 'Erro', description: fetchErr?.data?.error ?? 'Erro ao finalizar consulta.', color: 'error' });
      return false;
    } finally {
      finalizing.value = false;
    }
  }

  /** Descarta a sessão sem finalizar (ex.: ao sair). */
  function discard() {
    active.value = null;
    isOpen.value = false;
  }

  return {
    active,
    isOpen,
    saving,
    generatingLink,
    finalizing,
    start,
    minimize,
    resume,
    generateLink,
    saveNotes,
    finalize,
    discard,
  };
}
