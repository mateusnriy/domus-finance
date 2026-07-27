import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PESSOAS } from '@/testes/fixtures';
import { renderizarTela } from '@/testes/utilitarios';
import { MENSAGEM_GENERICA } from '@/lib/erros';

const listar = vi.fn(async () => PESSOAS);
const criar = vi.fn();
const editar = vi.fn();
const excluir = vi.fn();

vi.mock('@/features/pessoas/pessoasService', () => ({
  pessoasService: {
    listar: () => listar(),
    criar: (...args: unknown[]) => criar(...(args as [])),
    editar: (...args: unknown[]) => editar(...(args as [])),
    excluir: (...args: unknown[]) => excluir(...(args as [])),
  },
}));

const { default: PessoasPage } = await import('@/features/pessoas/PessoasPage');

async function renderizarComLista() {
  const resultado = renderizarTela(<PessoasPage />);
  await screen.findByText('Ana Souza');
  return resultado;
}

const abrirFormulario = () => userEvent.click(screen.getByRole('button', { name: '+ Adicionar' }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('pessoas', () => {
  it('cadastra uma pessoa válida e recarrega a lista', async () => {
    await renderizarComLista();
    await abrirFormulario();

    await userEvent.type(screen.getByLabelText('Nome'), 'Diego Alves');
    await userEvent.type(screen.getByLabelText('Idade'), '41');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar pessoa' }));

    await waitFor(() => expect(criar).toHaveBeenCalledWith({ nome: 'Diego Alves', idade: 41 }));
    expect(listar).toHaveBeenCalledTimes(2);
  });

  // RN09: a faixa aceita vai de 0 a 130 anos.
  it('recusa idade fora da faixa permitida', async () => {
    await renderizarComLista();
    await abrirFormulario();

    await userEvent.type(screen.getByLabelText('Nome'), 'Diego Alves');
    await userEvent.type(screen.getByLabelText('Idade'), '200');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar pessoa' }));

    expect(await screen.findByText('A idade deve estar entre 0 e 130.')).toBeInTheDocument();
    expect(criar).not.toHaveBeenCalled();
  });

  it('mostra o estado vazio quando não há pessoas', async () => {
    listar.mockResolvedValueOnce([]);

    renderizarTela(<PessoasPage />);

    expect(await screen.findByText('Nenhuma pessoa cadastrada')).toBeInTheDocument();
  });

  it('mostra a mensagem de erro quando a listagem falha', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    listar.mockRejectedValueOnce(new Error('falha de rede'));

    renderizarTela(<PessoasPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(MENSAGEM_GENERICA);
  });

  it('marca com selo a pessoa menor de idade', async () => {
    await renderizarComLista();

    const linhaDoMenor = screen.getByText('Bruno Lima').closest('tr');
    const linhaDaAdulta = screen.getByText('Ana Souza').closest('tr');

    expect(linhaDoMenor).not.toBeNull();
    expect(within(linhaDoMenor as HTMLElement).getByText('menor')).toBeInTheDocument();
    expect(within(linhaDaAdulta as HTMLElement).queryByText('menor')).not.toBeInTheDocument();
  });

  // RF15 e RN17: o impacto da cascata precisa ser conhecido antes de confirmar.
  it('informa quantas transações a exclusão levará junto', async () => {
    await renderizarComLista();

    await userEvent.click(screen.getByRole('button', { name: 'Excluir Ana Souza' }));

    const dialogo = await screen.findByRole('dialog');

    expect(within(dialogo).getByText('Removerá também 3 transações vinculadas.')).toBeInTheDocument();

    await userEvent.click(within(dialogo).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => expect(excluir).toHaveBeenCalledWith('1'));
  });

  it('não remove nada ao cancelar a exclusão', async () => {
    await renderizarComLista();

    await userEvent.click(screen.getByRole('button', { name: 'Excluir Ana Souza' }));

    const dialogo = await screen.findByRole('dialog');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(excluir).not.toHaveBeenCalled();
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
  });

  // RF18: o mesmo formulário edita, pré-preenchido com os valores atuais.
  it('abre a edição pré-preenchida e salva a alteração', async () => {
    await renderizarComLista();

    await userEvent.click(screen.getByRole('button', { name: 'Editar Ana Souza' }));

    expect(await screen.findByLabelText('Nome')).toHaveValue('Ana Souza');
    expect(screen.getByLabelText('Idade')).toHaveValue(34);

    await userEvent.clear(screen.getByLabelText('Idade'));
    await userEvent.type(screen.getByLabelText('Idade'), '35');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar alteração' }));

    await waitFor(() => expect(editar).toHaveBeenCalledWith('1', { nome: 'Ana Souza', idade: 35 }));
  });
});
