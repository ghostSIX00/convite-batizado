import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { Confirmacao, Presenca } from '@/types';

export interface ParametrosConfirmacao {
  nome: string;
  presenca: Presenca | string;
  quantidade?: number;
  quantidade_pessoas?: number;
  acompanhantes?: string[] | string;
  status?: string;
}

/**
 * Registra ou atualiza a confirmação de presença no Supabase.
 * Utiliza prioritariamente a RPC security definer 'confirmar_presenca',
 * garantindo permissão para convidados anônimos e evitando duplicidade por nome.
 */
export async function enviarConfirmacao(dados: ParametrosConfirmacao): Promise<void> {
  const supabase = getSupabaseBrowser();

  const nome = (dados.nome || '').trim().replace(/\s+/g, ' ');
  const presenca: Presenca = dados.presenca === 'nao' || dados.status === 'recusado' ? 'nao' : 'sim';
  const quantidade =
    presenca === 'sim'
      ? Math.max(1, Number(dados.quantidade ?? dados.quantidade_pessoas ?? 1))
      : 0;

  // 1) Método recomendado: RPC confirmar_presenca (definida em supabase/schema.sql)
  const { error: rpcError } = await supabase.rpc('confirmar_presenca', {
    p_nome: nome,
    p_presenca: presenca,
    p_quantidade: quantidade,
  });

  if (!rpcError) {
    return;
  }

  const rpcInfo = {
    message: rpcError.message,
    details: rpcError.details,
    hint: rpcError.hint,
    code: rpcError.code,
  };

  console.warn('Tentativa via RPC confirmar_presenca falhou, tentando fallback direto:', rpcInfo);

  // 2) Fallback para inserção/atualização direta caso a RPC não tenha sido criada ainda
  const { error: insertError } = await supabase
    .from('confirmacoes')
    .upsert(
      [
        {
          nome,
          presenca,
          quantidade_pessoas: quantidade,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'nome_key' }
    );

  if (insertError) {
    const insertInfo = {
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code,
    };

    console.error('Erro ao salvar confirmação no Supabase:', {
      rpcError: rpcInfo,
      insertError: insertInfo,
    });

    const mensagem =
      rpcError.message ||
      insertError.message ||
      'Não foi possível registrar a confirmação. Verifique a configuração do banco.';

    throw new Error(mensagem);
  }
}

// Alias para compatibilidade
export const salvarConfirmacao = enviarConfirmacao;

/**
 * Busca todas as confirmações para exibição no painel administrativo (/admin)
 */
export async function listarConfirmacoes(): Promise<Confirmacao[]> {
  const supabase = getSupabaseBrowser();

  const { data, error } = await supabase
    .from('confirmacoes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar confirmações no Supabase:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(error.message);
  }

  return (data || []) as Confirmacao[];
}

// Alias para compatibilidade
export const buscarConfirmacoes = listarConfirmacoes;

/**
 * Exclui uma confirmação pelo ID no painel administrativo
 */
export async function excluirConfirmacao(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowser();

  const { error } = await supabase
    .from('confirmacoes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir confirmação:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(error.message);
  }

  return true;
}

// Alias para compatibilidade
export const deletarConfirmacao = excluirConfirmacao;