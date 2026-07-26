import { useState } from 'react';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import Cartao from '@/components/Cartao';
import EstadoVazio from '@/components/EstadoVazio';
import Modal from '@/components/Modal';
import Selo from '@/components/Selo';
import Tabela from '@/components/Tabela';
import BotaoEditar from '@/components/BotaoEditar';
import BotaoExcluir from '@/components/BotaoExcluir';
import CabecalhoTela from '@/layout/CabecalhoTela';
import type { Pessoa } from '@/types/pessoa';

// Dados estáticos de prévia visual. A carga real da API entra na etapa F4.
const PESSOAS_EXEMPLO: Pessoa[] = [
  { id: '1', nome: 'Ana Souza', idade: 34, menorDeIdade: false, quantidadeTransacoes: 3 },
  { id: '2', nome: 'Bruno Lima', idade: 15, menorDeIdade: true, quantidadeTransacoes: 1 },
  { id: '3', nome: 'Carla Nunes', idade: 28, menorDeIdade: false, quantidadeTransacoes: 0 },
];

const CABECALHO = 'px-4 py-3 text-[10px] tracking-[0.2em] text-hint uppercase';

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState(PESSOAS_EXEMPLO);
  const [formAberto, setFormAberto] = useState(false);
  const [paraExcluir, setParaExcluir] = useState<Pessoa | null>(null);

  const excluir = () => {
    if (paraExcluir) {
      setPessoas((atuais) => atuais.filter((pessoa) => pessoa.id !== paraExcluir.id));
    }
    setParaExcluir(null);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <CabecalhoTela
        titulo="Pessoas"
        eyebrow={`${pessoas.length} ${pessoas.length === 1 ? 'morador' : 'moradores'}`}
        acao={
          <Botao
            variante={formAberto ? 'secundario' : 'primario'}
            onClick={() => setFormAberto((aberto) => !aberto)}
          >
            {formAberto ? 'Cancelar' : '+ Adicionar'}
          </Botao>
        }
      />

      {formAberto && (
        <Cartao className="mt-8 p-6">
          <form
            className="flex flex-wrap items-end gap-6"
            onSubmit={(evento) => {
              evento.preventDefault();
              setFormAberto(false);
            }}
          >
            <Campo label="Nome" placeholder="Ana Souza" className="min-w-56 flex-1" />
            <Campo label="Idade" mono placeholder="34" className="w-24" />
            <Botao type="submit">Salvar pessoa</Botao>
          </form>
        </Cartao>
      )}

      <div className="mt-8">
        {pessoas.length === 0 ? (
          <EstadoVazio
            mensagem="Nenhuma pessoa cadastrada"
            apoio="Adicione os moradores da casa para começar."
          />
        ) : (
          <Tabela>
            <thead className="bg-card">
              <tr>
                <th scope="col" className={`${CABECALHO} text-left`}>
                  Nome
                </th>
                <th scope="col" className={`${CABECALHO} text-right`}>
                  Idade
                </th>
                <th scope="col" className={`${CABECALHO} text-right`}>
                  Lançamentos
                </th>
                <th scope="col" className={`${CABECALHO} w-24 text-right`}>
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id} className="border-t border-divider hover:bg-card/50">
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-2">
                      {pessoa.nome}
                      {pessoa.menorDeIdade && <Selo>menor</Selo>}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-mono">{pessoa.idade}</td>
                  <td className="px-4 py-4 text-right font-mono">{pessoa.quantidadeTransacoes}</td>
                  <td className="px-4 py-4">
                    <span className="flex justify-end">
                      <BotaoEditar
                        rotulo={`Editar ${pessoa.nome}`}
                        onClick={() => setFormAberto(true)}
                      />
                      <BotaoExcluir
                        rotulo={`Excluir ${pessoa.nome}`}
                        onClick={() => setParaExcluir(pessoa)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Tabela>
        )}
      </div>

      <Modal
        aberto={paraExcluir !== null}
        titulo="Confirmar exclusão"
        onFechar={() => setParaExcluir(null)}
      >
        <p>Excluir {paraExcluir?.nome}?</p>
        {paraExcluir && paraExcluir.quantidadeTransacoes > 0 && (
          <p className="mt-2 text-negative">
            Removerá também {paraExcluir.quantidadeTransacoes}{' '}
            {paraExcluir.quantidadeTransacoes === 1
              ? 'transação vinculada.'
              : 'transações vinculadas.'}
          </p>
        )}
        <p className="mt-2 text-hint">A ação é irreversível.</p>
        <div className="mt-6 flex gap-3">
          <Botao variante="destrutivo" onClick={excluir}>
            Excluir
          </Botao>
          <Botao variante="secundario" onClick={() => setParaExcluir(null)}>
            Cancelar
          </Botao>
        </div>
      </Modal>
    </div>
  );
}
