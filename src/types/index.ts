export type Presenca = 'sim' | 'nao';

export interface Confirmacao {
  id: string;
  nome: string;
  presenca: Presenca;
  quantidade_pessoas: number;
  created_at: string;
  updated_at?: string;
  acompanhantes?: string[] | string;
  status?: 'confirmado' | 'recusado';
}