export type ResumoPessoa = {
  pessoaId: string;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

export type ResumoCategoria = { categoria: string; total: number };

export type ResumoGeral = {
  pessoas: ResumoPessoa[];
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
  despesasPorCategoria: ResumoCategoria[];
};
