export interface PrescriptionAnimal {
  name?: string | null
  species?: string | null
  breed?: string | null
  sex?: string | null
  size?: string | null
  weight?: number | string | null
  coat?: string | null
  coatColor?: string | null
  birthDate?: string | null
}

export interface PrescriptionDocData {
  vetName?: string | null
  vetCrmv?: string | null
  /** Data da prescrição (yyyy-mm-dd ou ISO). */
  date: string
  content: string
  responsibleName?: string | null
  responsibleCpf?: string | null
  responsibleEmail?: string | null
  responsibleAddress?: string | null
  animal?: PrescriptionAnimal | null
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

function petAge(birthDate?: string | null): string {
  if (!birthDate) return ''
  const birth = new Date(birthDate)
  const now = new Date()
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`
  const years = Math.floor(months / 12)
  return `${years} ${years === 1 ? 'ano' : 'anos'}`
}

function escapeHtml(value?: string | null): string {
  if (value == null) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function field(label: string, value: string): string {
  return `<div style="width: 48%; font-size: 13px; color: #374151; margin-bottom: 6px;"><strong>${label}:</strong> ${value}</div>`
}

/** Monta o HTML interno do documento da prescrição (folha A4). Layout amigável ao html2canvas (flex). */
export function buildPrescriptionHtml(data: PrescriptionDocData): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const a = data.animal

  const animalBlock = a
    ? [
        field('Nome', escapeHtml(a.name)),
        field('Espécie', escapeHtml(speciesLabel(a.species))),
        field('Raça', escapeHtml(a.breed)),
        field('Sexo', escapeHtml(sexLabel(a.sex))),
        field('Porte', `<span style="text-transform: capitalize;">${escapeHtml(a.size)}</span>`),
        field('Peso', a.weight ? `${escapeHtml(String(a.weight))} kg` : '—'),
        field('Pelagem', `${escapeHtml(a.coat)}${a.coatColor ? ` (${escapeHtml(a.coatColor)})` : ''}`),
        field('Idade', escapeHtml(petAge(a.birthDate))),
      ].join('')
    : '<div style="font-size: 13px; color: #374151;">Nenhum animal selecionado.</div>'

  const responsibleBlock = [
    field('Nome', escapeHtml(data.responsibleName)),
    field('CPF', escapeHtml(data.responsibleCpf) || '—'),
    field('E-mail', escapeHtml(data.responsibleEmail) || '—'),
    field('Endereço', escapeHtml(data.responsibleAddress) || '—'),
  ].join('')

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0d9488; margin: 0;">Prescrição Veterinária</h1>
        <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">ConectaVet</p>
      </div>
      <img src="${origin}/icon-com-texto.png" alt="ConectaVet" crossorigin="anonymous" style="height: 80px; width: auto; object-fit: contain;" />
    </div>

    <h2 style="font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 8px;">Dados do Animal</h2>
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 20px;">${animalBlock}</div>

    <h2 style="font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 8px;">Dados do Responsável</h2>
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 20px;">${responsibleBlock}</div>

    <h6 style="font-size: 15px; font-weight: 700; color: #0d9488; margin: 24px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">
      Instruções Gerais do Tratamento
    </h6>
    <div style="font-size: 14px; color: #1f2937; white-space: pre-wrap; line-height: 1.6; min-height: 200px;">${escapeHtml(data.content)}</div>

    <div style="margin-top: 64px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div style="font-size: 13px; color: #374151; line-height: 1.5;">
        <strong>${escapeHtml(data.vetName)}</strong><br />
        ${data.vetCrmv ? `CRMV: ${escapeHtml(data.vetCrmv)}<br />` : ''}
        <span style="font-size: 11px; color: #6b7280;">Médico(a) Veterinário(a)</span>
      </div>
      <div style="font-size: 13px; color: #374151;">
        ${formatDate(data.date)}
      </div>
    </div>`
}

function fileName(data: PrescriptionDocData): string {
  const base = (data.animal?.name || data.responsibleName || 'prescricao')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `prescricao-${base || 'conectavet'}.pdf`
}

/** Gera e baixa um arquivo PDF da prescrição. */
export async function downloadPrescriptionPdf(data: PrescriptionDocData): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const container = document.createElement('div')
  Object.assign(container.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: '794px',
    background: '#ffffff',
    padding: '48px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: '#1f2937',
  } as Partial<CSSStyleDeclaration>)
  container.innerHTML = buildPrescriptionHtml(data)
  document.body.appendChild(container)

  // aguarda imagens (logo) carregarem antes de capturar
  await Promise.all(
    Array.from(container.querySelectorAll('img')).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }),
    ),
  )

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    while (heightLeft > 0) {
      position -= pageHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(fileName(data))
  } finally {
    document.body.removeChild(container)
  }
}
