export interface ActiveConsultation {
  id: string;
  tutor_name: string;
  pet_name: string | null;
  status: string;
  meet_link: string;
  notes: string;
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

  function buildMeetLink(id: string) {
    return `https://meet.jit.si/ConectaVet-${id}`;
  }

  /** Abre a sala de consulta. Gera o link automaticamente se solicitado. */
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
      const link = buildMeetLink(active.value.id);
      const updated = await api<{ meet_link: string }>(`/vet/consultations/${active.value.id}/session`, {
        method: 'PATCH',
        body: { meet_link: link },
      });
      active.value.meet_link = updated.meet_link ?? link;
      toast.add({ title: 'Link gerado!', description: 'A sala de videoconferência foi criada e salva.', color: 'success' });
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
        body: { notes: active.value.notes },
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
        body: { status: 'realizada', notes: active.value.notes },
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
