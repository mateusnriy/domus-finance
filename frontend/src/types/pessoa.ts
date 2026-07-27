export type Pessoa = {
  id: string;
  nome: string;
  idade: number;
  menorDeIdade: boolean;
  quantidadeTransacoes: number;
};

export type SalvarPessoaRequest = { nome: string; idade: number };
