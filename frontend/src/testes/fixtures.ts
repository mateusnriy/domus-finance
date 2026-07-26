import type { Pessoa } from '@/types/pessoa';
import type { Transacao } from '@/types/transacao';
import type { ResumoGeral } from '@/types/totais';

export const PESSOAS: Pessoa[] = [
  { id: '1', nome: 'Ana Souza', idade: 34, menorDeIdade: false, quantidadeTransacoes: 3 },
  { id: '2', nome: 'Bruno Lima', idade: 15, menorDeIdade: true, quantidadeTransacoes: 1 },
  { id: '3', nome: 'Carla Nunes', idade: 28, menorDeIdade: false, quantidadeTransacoes: 0 },
];

export const TRANSACOES: Transacao[] = [
  {
    id: '1',
    descricao: 'Salário',
    valor: 4500,
    tipo: 'Receita',
    data: '2026-07-24',
    categoria: null,
    pessoaId: '1',
    pessoaNome: 'Ana Souza',
  },
  {
    id: '2',
    descricao: 'Supermercado',
    valor: 820.5,
    tipo: 'Despesa',
    data: '2026-07-22',
    categoria: 'Alimentacao',
    pessoaId: '1',
    pessoaNome: 'Ana Souza',
  },
];

export const RESUMO: ResumoGeral = {
  pessoas: [
    {
      pessoaId: '1',
      nome: 'Ana Souza',
      idade: 34,
      totalReceitas: 4500,
      totalDespesas: 820.5,
      saldo: 3679.5,
    },
    {
      pessoaId: '2',
      nome: 'Bruno Lima',
      idade: 15,
      totalReceitas: 0,
      totalDespesas: 230,
      saldo: -230,
    },
    {
      pessoaId: '3',
      nome: 'Carla Nunes',
      idade: 28,
      totalReceitas: 0,
      totalDespesas: 0,
      saldo: 0,
    },
  ],
  totalReceitas: 4500,
  totalDespesas: 1050.5,
  saldoLiquido: 3449.5,
  despesasPorCategoria: [
    { categoria: 'Alimentacao', total: 820.5 },
    { categoria: 'Educacao', total: 230 },
  ],
};
