export type UserType = 'tutor' | 'medico' | 'veterinario' | 'admin'
export type PortalKey = 'cliente' | 'medico' | 'veterinario' | 'adm'

export interface PortalNavItem {
  label: string
  to: string
  icon: string
  badge?: 'aprovacoes-pendentes'
}

export interface PortalNavGroup {
  label: string | null
  items: PortalNavItem[]
}

export interface PortalDef {
  key: PortalKey
  label: string
  loginLabel: string
  icon: string
  base: string
  home: string
  allowedTypes: UserType[]
  accent: string
  nav: PortalNavGroup[]
}

export const PORTALS: Record<PortalKey, PortalDef> = {
  cliente: {
    key: 'cliente',
    label: 'Portal do Cliente',
    loginLabel: 'Cliente',
    icon: 'i-heroicons-user-circle',
    base: '/painel/cliente',
    home: '/painel/cliente',
    allowedTypes: ['tutor', 'admin'],
    accent: '#01193A',
    nav: [
      { label: null, items: [{ label: 'Dashboard', to: '/painel/cliente', icon: 'i-heroicons-squares-2x2' }] },
      { label: 'Cuidado', items: [
        { label: 'Agendar', to: '/painel/cliente/agendar', icon: 'i-heroicons-plus-circle' },
        { label: 'Consultas', to: '/painel/cliente/consultas', icon: 'i-heroicons-calendar-days' },
        { label: 'Prontuários', to: '/painel/cliente/prontuarios', icon: 'i-heroicons-clipboard-document-list' },
        { label: 'Receitas', to: '/painel/cliente/receitas', icon: 'i-heroicons-document-text' },
      ] },
      { label: 'Cadastros', items: [
        { label: 'Perfil', to: '/painel/cliente/perfil', icon: 'i-heroicons-identification' },
        { label: 'Dependentes', to: '/painel/cliente/dependentes', icon: 'i-heroicons-user-group' },
        { label: 'Pets', to: '/painel/cliente/pets', icon: 'i-mdi-paw' },
      ] },
      { label: 'Conta', items: [
        { label: 'Assinatura', to: '/painel/cliente/assinatura', icon: 'i-heroicons-credit-card' },
        { label: 'Maffy Store', to: '/maffy-store', icon: 'i-heroicons-shopping-bag' },
      ] },
    ],
  },
  medico: {
    key: 'medico',
    label: 'Portal Médico',
    loginLabel: 'Médico',
    icon: 'i-mdi-doctor',
    base: '/painel/medico',
    home: '/painel/medico',
    allowedTypes: ['medico', 'admin'],
    accent: '#16A34A',
    nav: [
      { label: null, items: [{ label: 'Dashboard', to: '/painel/medico', icon: 'i-heroicons-squares-2x2' }] },
      { label: 'Atendimento', items: [
        { label: 'Consultas', to: '/painel/medico/consultas', icon: 'i-mdi-stethoscope' },
        { label: 'Prontuários', to: '/painel/medico/prontuarios', icon: 'i-heroicons-clipboard-document-list' },
        { label: 'Disponibilidade', to: '/painel/medico/agenda', icon: 'i-heroicons-calendar-days' },
      ] },
      { label: 'Documentos', items: [
        { label: 'Receitas', to: '/painel/medico/receitas', icon: 'i-heroicons-document-text' },
      ] },
      { label: 'Conta', items: [
        { label: 'Financeiro', to: '/painel/medico/financeiro', icon: 'i-heroicons-banknotes' },
      ] },
      { label: null, items: [{ label: 'Histórico', to: '/painel/medico/historico', icon: 'i-heroicons-clock' }] },
    ],
  },
  veterinario: {
    key: 'veterinario',
    label: 'Portal Veterinário',
    loginLabel: 'Veterinário',
    icon: 'i-mdi-stethoscope',
    base: '/painel/veterinario',
    home: '/painel/veterinario/consultas',
    allowedTypes: ['veterinario', 'admin'],
    accent: '#014496',
    nav: [
      { label: null, items: [{ label: 'Dashboard', to: '/painel/veterinario', icon: 'i-heroicons-squares-2x2' }] },
      { label: 'Atendimento', items: [
        { label: 'Consultas', to: '/painel/veterinario/consultas', icon: 'i-mdi-stethoscope' },
        { label: 'Prontuários', to: '/painel/veterinario/prontuarios', icon: 'i-heroicons-clipboard-document-list' },
        { label: 'Disponibilidade', to: '/painel/veterinario/agenda', icon: 'i-heroicons-calendar-days' },
      ] },
      { label: 'Documentos', items: [
        { label: 'Prescrições', to: '/painel/veterinario/prescricoes', icon: 'i-heroicons-document-text' },
      ] },
      { label: 'Conta', items: [
        { label: 'Financeiro', to: '/painel/veterinario/financeiro', icon: 'i-heroicons-banknotes' },
        { label: 'Configurações', to: '/painel/veterinario/configuracoes', icon: 'i-heroicons-cog-6-tooth' },
      ] },
      { label: null, items: [{ label: 'Histórico', to: '/painel/veterinario/historico', icon: 'i-heroicons-clock' }] },
    ],
  },
  adm: {
    key: 'adm',
    label: 'Portal Administrativo',
    loginLabel: 'Administrativo',
    icon: 'i-heroicons-shield-check',
    base: '/painel/adm',
    home: '/painel/adm',
    allowedTypes: ['admin'],
    accent: '#475569',
    nav: [
      { label: null, items: [{ label: 'Dashboard', to: '/painel/adm', icon: 'i-heroicons-squares-2x2' }] },
      { label: 'Pessoas', items: [
        { label: 'Aprovações', to: '/painel/adm/aprovacoes', icon: 'i-heroicons-user-plus', badge: 'aprovacoes-pendentes' },
        { label: 'Clientes', to: '/painel/adm/clientes', icon: 'i-heroicons-users' },
        { label: 'Médicos', to: '/painel/adm/medicos', icon: 'i-mdi-doctor' },
        { label: 'Veterinários', to: '/painel/adm/veterinarios', icon: 'i-mdi-stethoscope' },
      ] },
      { label: 'Operação', items: [
        { label: 'Fila de Atendimento', to: '/painel/adm/fila', icon: 'i-heroicons-bolt' },
        { label: 'Consultas', to: '/painel/adm/consultas', icon: 'i-heroicons-calendar-days' },
        { label: 'Pets', to: '/painel/adm/pets', icon: 'i-mdi-paw' },
      ] },
      { label: 'Gestão', items: [
        { label: 'Planos', to: '/painel/adm/planos', icon: 'i-heroicons-credit-card' },
        { label: 'Financeiro', to: '/painel/adm/financeiro', icon: 'i-heroicons-banknotes' },
        { label: 'Configurações', to: '/painel/adm/configuracoes', icon: 'i-heroicons-cog-6-tooth' },
      ] },
    ],
  },
}

export const PORTAL_KEYS = Object.keys(PORTALS) as PortalKey[]

export function isPortalKey(value: unknown): value is PortalKey {
  return typeof value === 'string' && value in PORTALS
}

export function portalForUser(type: UserType): PortalDef {
  if (type === 'medico') return PORTALS.medico
  if (type === 'veterinario') return PORTALS.veterinario
  if (type === 'admin') return PORTALS.adm
  return PORTALS.cliente
}

export function userTypeLabel(type: UserType): string {
  if (type === 'medico') return 'Médico'
  if (type === 'veterinario') return 'Veterinário'
  if (type === 'admin') return 'Administrador'
  return 'Cliente'
}

export function portalsForUser(type: UserType): PortalDef[] {
  return PORTAL_KEYS.map(key => PORTALS[key])
    .filter(portal => portal.allowedTypes.includes(type))
}
