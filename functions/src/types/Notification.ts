export interface Notification {
  id: string;
  identificacao?: string;
  login: string;
  assunto?: string | null;
  subtitulo?: string | null;
  conteudo?: string | null;
  context?: string | null;
  criacao?: string | null;
  lida_em?: string | null;
  excluida_em?: string | null;
  ativa?: boolean;
  pendente?: boolean;
  sonoro?: boolean;
  mobile?: boolean;
  icone?: string | null;
  url_destino?: string | null;
  [key: string]: unknown;
}

export default Notification;
