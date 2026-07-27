import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PESSOAS, TRANSACOES } from '@/testes/fixtures';
import { renderizarTela } from '@/testes/utilitarios';
import { MENSAGEM_GENERICA } from '@/lib/erros';
import type { FiltroTransacoes } from '@/types/transacao';

// O mock aplica os filtros como o servidor faria: sem isso, "a lista reflete o
// filtro" não seria verificável, apenas a chamada ao serviço.
const listar = vi.fn(async (filtro: FiltroTransacoes = {}) =>
  TRANSACOES.filter(
    (transacao) =>
      (!filtro.pessoaId || transacao.pessoaId === filtro.pessoaId) &&
      (!filtro.tipo || transacao.tipo === filtro.tipo) &&
      (!filtro.categoria || transacao.categoria === filtro.categoria) &&
      (!filtro.dataInicio || transacao.data >= filtro.dataInicio) &&
      (!filtro.dataFim || transacao.data <= filtro.dataFim),
  ),
);
const criar = vi.fn();
const editar = vi.fn();
const excluir = vi.fn();

vi.mock('@/features/transacoes/transacoesService', () => ({
  transacoesService: {
    listar: (...args: unknown[]) => listar(...(args as [FiltroTransacoes])),
    criar: (...args: unknown[]) => criar(...(args as [])),
    editar: (...args: unknown[]) => editar(...(args as [])),
    excluir: (...args: unknown[]) => excluir(...(args as [])),
  },
}));

vi.mock('@/features/pessoas/pessoasService', () => ({
  pessoasService: {
    listar: vi.fn(async () => PESSOAS),
    criar: vi.fn(),
    editar: vi.fn(),
    excluir: vi.fn(),
  },
}));

const { default: TransacoesPage } = await import('@/features/transacoes/TransacoesPage');

async function renderizarComLista() {
  const resultado = renderizarTela(<TransacoesPage />);
  await screen.findByText('Supermercado');
  return resultado;
}

// Formulário e filtros repetem os rótulos "Pessoa" e "Categoria"; as consultas
// do formulário precisam ser escopadas ao <form>.
async function localizarFormulario() {
  const salvar = await screen.findByRole('button', { name: /^Salvar/ });
  return salvar.closest('form') as HTMLElement;
}

async function abrirFormulario() {
  await userEvent.click(screen.getByRole('button', { name: '+ Adicionar' }));
  return localizarFormulario();
}

const linhaDe = (descricao: string) => screen.getByText(descricao).closest('tr') as HTMLTableRowElement;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('transações', () => {
  // RN03: menor de idade não recebe a opção de receita.
  it('trava o tipo em despesa ao escolher uma pessoa menor de idade', async () => {
    await renderizarComLista();
    const formulario = await abrirFormulario();

    expect(within(formulario).getByRole('radio', { name: 'Receita' })).toBeInTheDocument();

    await userEvent.selectOptions(within(formulario).getByLabelText('Pessoa'), '2');

    expect(within(formulario).queryByRole('radio', { name: 'Receita' })).not.toBeInTheDocument();
    expect(
      within(formulario).getByText('(menores só registram despesas)'),
    ).toBeInTheDocument();
  });

  // RN20 e RN03: a edição revalida a regra do menor, e o cliente não oferece receita.
  it('mantém a despesa ao editar um lançamento de pessoa menor', async () => {
    await renderizarComLista();

    await userEvent.click(screen.getByRole('button', { name: 'Editar Material escolar' }));
    const formulario = await localizarFormulario();

    expect(within(formulario).queryByRole('radio', { name: 'Receita' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Salvar alteração' }));

    await waitFor(() =>
      expect(editar).toHaveBeenCalledWith('3', expect.objectContaining({ tipo: 'Despesa' })),
    );
  });

  // RN06: o valor precisa ser maior que zero.
  it('recusa valor menor ou igual a zero', async () => {
    await renderizarComLista();
    const formulario = await abrirFormulario();

    await userEvent.type(within(formulario).getByLabelText('Descrição'), 'Padaria');
    await userEvent.type(within(formulario).getByLabelText('Valor'), '0');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar transação' }));

    expect(await screen.findByText('O valor deve ser maior que zero.')).toBeInTheDocument();
    expect(criar).not.toHaveBeenCalled();
  });

  // RN18: a data do fato não pode estar no futuro.
  it('recusa data futura', async () => {
    await renderizarComLista();
    const formulario = await abrirFormulario();

    await userEvent.type(within(formulario).getByLabelText('Descrição'), 'Padaria');
    await userEvent.type(within(formulario).getByLabelText('Valor'), '25');
    fireEvent.change(within(formulario).getByLabelText('Data'), {
      target: { value: '2099-12-31' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Salvar transação' }));

    expect(await screen.findByText('A data não pode ser futura.')).toBeInTheDocument();
    expect(criar).not.toHaveBeenCalled();
  });

  // RN19: a categoria é opcional e vai como nula quando não escolhida.
  it('envia categoria nula quando nenhuma é escolhida', async () => {
    await renderizarComLista();
    const formulario = await abrirFormulario();

    await userEvent.type(within(formulario).getByLabelText('Descrição'), 'Padaria');
    await userEvent.type(within(formulario).getByLabelText('Valor'), '25');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar transação' }));

    await waitFor(() =>
      expect(criar).toHaveBeenCalledWith(expect.objectContaining({ categoria: null })),
    );
  });

  it('envia a categoria escolhida', async () => {
    await renderizarComLista();
    const formulario = await abrirFormulario();

    await userEvent.type(within(formulario).getByLabelText('Descrição'), 'Padaria');
    await userEvent.type(within(formulario).getByLabelText('Valor'), '25');
    await userEvent.selectOptions(within(formulario).getByLabelText('Categoria'), 'Alimentacao');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar transação' }));

    await waitFor(() =>
      expect(criar).toHaveBeenCalledWith(expect.objectContaining({ categoria: 'Alimentacao' })),
    );
  });

  it('filtra a lista por tipo', async () => {
    await renderizarComLista();

    await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'Receita');

    await waitFor(() => expect(screen.queryByText('Supermercado')).not.toBeInTheDocument());
    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(listar).toHaveBeenLastCalledWith(expect.objectContaining({ tipo: 'Receita' }));
  });

  it('combina os filtros de categoria e de período', async () => {
    await renderizarComLista();

    await userEvent.selectOptions(screen.getByLabelText('Categoria'), 'Alimentacao');
    fireEvent.change(screen.getByLabelText('De'), { target: { value: '2026-07-21' } });

    await waitFor(() =>
      expect(listar).toHaveBeenLastCalledWith(
        expect.objectContaining({ categoria: 'Alimentacao', dataInicio: '2026-07-21' }),
      ),
    );

    expect(screen.getByText('Supermercado')).toBeInTheDocument();
    expect(screen.queryByText('Material escolar')).not.toBeInTheDocument();
    expect(screen.queryByText('Salário')).not.toBeInTheDocument();
  });

  it('mostra o estado vazio quando o filtro não encontra nada', async () => {
    await renderizarComLista();

    await userEvent.selectOptions(screen.getByLabelText('Categoria'), 'Saude');

    expect(await screen.findByText('Nenhuma transação encontrada')).toBeInTheDocument();
    expect(screen.getByText('Ajuste os filtros para ver outros lançamentos.')).toBeInTheDocument();
  });

  it('mostra a mensagem de erro quando a listagem falha', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    listar.mockRejectedValueOnce(new Error('falha de rede'));

    renderizarTela(<TransacoesPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(MENSAGEM_GENERICA);
  });

  it('distingue receita de despesa pelo sinal e pela cor', async () => {
    await renderizarComLista();

    // A coluna de valor é a única portadora do sinal; a cor é o segundo sinal
    // exigido pelo caso, e só é observável pela classe semântica.
    const receita = linhaDe('Salário').cells[4];
    const despesa = linhaDe('Supermercado').cells[4];

    expect(receita.textContent).toMatch(/^\+/);
    expect(receita).toHaveClass('text-positive');
    expect(despesa.textContent).toMatch(/^−/);
    expect(despesa).toHaveClass('text-negative');
  });

  // RF20: a exclusão passa pelo modal antes de remover o lançamento.
  it('exclui um lançamento após a confirmação', async () => {
    await renderizarComLista();

    await userEvent.click(screen.getByRole('button', { name: 'Excluir Supermercado' }));

    const dialogo = await screen.findByRole('dialog');

    expect(within(dialogo).getByText(/Supermercado/)).toBeInTheDocument();

    await userEvent.click(within(dialogo).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => expect(excluir).toHaveBeenCalledWith('2'));
    expect(listar).toHaveBeenCalledTimes(2);
  });
});
