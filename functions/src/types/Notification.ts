export interface Notification {
  id: string
  identificacao?: string
  login: string
  assunto?: string | null
  subtitulo?: string | null
  conteudo?: string | null
  context?: string | null
  criacao?: string | null
  lidaEm?: string | null
  excluidaEm?: string | null
  ativa?: boolean
  pendente?: boolean
  sonoro?: boolean
  mobile?: boolean
  icone?: string | null
  url_destino?: string | null
  urlDestino?: string | null
  [key: string]: any
}

export default Notification
