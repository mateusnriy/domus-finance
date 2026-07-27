export type TipoTransacao = 'Despesa' | 'Receita';

export type CategoriaTransacao =
  'Moradia' | 'Alimentacao' | 'Transporte' | 'Saude' | 'Educacao' | 'Lazer' | 'Contas' | 'Outros';

export type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
  categoria: CategoriaTransacao | null;
  pessoaId: string;
  pessoaNome: string;
};

export type SalvarTransacaoRequest = {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
  categoria: CategoriaTransacao | null;
  pessoaId: string;
};

export type FiltroTransacoes = {
  pessoaId?: string;
  tipo?: TipoTransacao;
  categoria?: CategoriaTransacao;
  dataInicio?: string;
  dataFim?: string;
};
