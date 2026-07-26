import { useState } from 'react';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import Cartao from '@/components/Cartao';
import EstadoVazio from '@/components/EstadoVazio';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import SeletorTipo from '@/components/SeletorTipo';
import Tabela from '@/components/Tabela';
import BotaoEditar from '@/components/BotaoEditar';
import BotaoExcluir from '@/components/BotaoExcluir';
import CabecalhoTela from '@/layout/CabecalhoTela';
import { CATEGORIAS, formatarBRL, formatarData, rotuloCategoria } from '@/lib/format';
import type { Pessoa } from '@/types/pessoa';
import type { TipoTransacao, Transacao } from '@/types/transacao';

// Dados estáticos de prévia visual. A carga real da API entra na etapa F5.
const PESSOAS_EXEMPLO: Pessoa[] = [
  { id: '1', nome: 'Ana Souza', idade: 34, menorDeIdade: false, quantidadeTransacoes: 3 },
  { id: '2', nome: 'Bruno Lima', idade: 15, menorDeIdade: true, quantidadeTransacoes: 1 },
  { id: '3', nome: 'Carla Nunes', idade: 28, menorDeIdade: false, quantidadeTransacoes: 0 },
];

const TRANSACOES_EXEMPLO: Transacao[] = [
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
  {
    id: '3',
    descricao: 'Aluguel',
    valor: 1500,
    tipo: 'Despesa',
    data: '2026-07-21',
    categoria: 'Moradia',
    pessoaId: '1',
    pessoaNome: 'Ana Souza',
  },
  {
    id: '4',
    descricao: 'Material escolar',
    valor: 230,
    tipo: 'Despesa',
    data: '2026-07-20',
    categoria: 'Educacao',
    pessoaId: '2',
    pessoaNome: 'Bruno Lima',
  },
];

const CABECALHO = 'px-4 py-3 text-[10px] tracking-[0.2em] text-hint uppercase';

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState(TRANSACOES_EXEMPLO);
  const [formAberto, setFormAberto] = useState(false);
  const [paraExcluir, setParaExcluir] = useState<Transacao | null>(null);

  const [pessoaDoForm, setPessoaDoForm] = useState('1');
  const [tipoDoForm, setTipoDoForm] = useState<TipoTransacao>('Despesa');

  const [filtroPessoa, setFiltroPessoa] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const menorSelecionado =
    PESSOAS_EXEMPLO.find((pessoa) => pessoa.id === pessoaDoForm)?.menorDeIdade ?? false;

  const filtrada = transacoes.filter(
    (transacao) =>
      (!filtroPessoa || transacao.pessoaId === filtroPessoa) &&
      (!filtroTipo || transacao.tipo === filtroTipo) &&
      (!filtroCategoria || transacao.categoria === filtroCategoria),
  );

  const temFiltro = Boolean(filtroPessoa || filtroTipo || filtroCategoria);

  const limparFiltros = () => {
    setFiltroPessoa('');
    setFiltroTipo('');
    setFiltroCategoria('');
  };

  const excluir = () => {
    if (paraExcluir) {
      setTransacoes((atuais) => atuais.filter((transacao) => transacao.id !== paraExcluir.id));
    }
    setParaExcluir(null);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <CabecalhoTela
        titulo="Transações"
        eyebrow={`${filtrada.length} ${filtrada.length === 1 ? 'registro' : 'registros'}${
          temFiltro ? ' · filtrado' : ''
        }`}
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
            className="flex flex-col gap-6"
            onSubmit={(evento) => {
              evento.preventDefault();
              setFormAberto(false);
            }}
          >
            <div className="flex flex-wrap gap-6">
              <Select
                label="Pessoa"
                className="min-w-48 flex-1"
                value={pessoaDoForm}
                onChange={(evento) => setPessoaDoForm(evento.target.value)}
              >
                {PESSOAS_EXEMPLO.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </Select>
              <SeletorTipo
                valor={menorSelecionado ? 'Despesa' : tipoDoForm}
                onChange={setTipoDoForm}
                menorDeIdade={menorSelecionado}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <Campo label="Descrição" placeholder="Supermercado" className="min-w-56 flex-1" />
              <Campo label="Valor" mono placeholder="0,00" className="w-32" />
              <Campo label="Data" type="date" mono className="w-40" />
              <Select label="Categoria" className="w-44" defaultValue="">
                <option value="">Sem categoria</option>
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {rotuloCategoria[categoria]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Botao type="submit">Salvar transação</Botao>
            </div>
          </form>
        </Cartao>
      )}

      <div className="mt-8 flex flex-wrap items-end gap-6 border-b border-divider pb-6">
        <Select
          label="Pessoa"
          className="w-44"
          value={filtroPessoa}
          onChange={(evento) => setFiltroPessoa(evento.target.value)}
        >
          <option value="">Todas</option>
          {PESSOAS_EXEMPLO.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}
        </Select>
        <Select
          label="Tipo"
          className="w-36"
          value={filtroTipo}
          onChange={(evento) => setFiltroTipo(evento.target.value)}
        >
          <option value="">Todos</option>
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
        </Select>
        <Select
          label="Categoria"
          className="w-44"
          value={filtroCategoria}
          onChange={(evento) => setFiltroCategoria(evento.target.value)}
        >
          <option value="">Todas</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria} value={categoria}>
              {rotuloCategoria[categoria]}
            </option>
          ))}
        </Select>
        <Campo label="De" type="date" mono className="w-40" />
        <Campo label="Até" type="date" mono className="w-40" />
        <Botao variante="secundario" onClick={limparFiltros}>
          Limpar filtros
        </Botao>
      </div>

      <div className="mt-8">
        {filtrada.length === 0 ? (
          <EstadoVazio
            mensagem="Nenhuma transação encontrada"
            apoio="Ajuste os filtros ou registre um novo lançamento."
          />
        ) : (
          <Tabela larguraMinima="48rem">
            <thead className="bg-card">
              <tr>
                <th scope="col" className={`${CABECALHO} text-left`}>
                  Data
                </th>
                <th scope="col" className={`${CABECALHO} text-left`}>
                  Pessoa
                </th>
                <th scope="col" className={`${CABECALHO} text-left`}>
                  Categoria
                </th>
                <th scope="col" className={`${CABECALHO} text-left`}>
                  Descrição
                </th>
                <th scope="col" className={`${CABECALHO} text-right`}>
                  Valor
                </th>
                <th scope="col" className={`${CABECALHO} w-24 text-right`}>
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrada.map((transacao) => (
                <tr key={transacao.id} className="border-t border-divider hover:bg-card/50">
                  <td className="px-4 py-4 font-mono">{formatarData(transacao.data)}</td>
                  <td className="px-4 py-4">{transacao.pessoaNome}</td>
                  <td className="px-4 py-4 text-hint">
                    {transacao.categoria ? rotuloCategoria[transacao.categoria] : '—'}
                  </td>
                  <td className="px-4 py-4">{transacao.descricao}</td>
                  <td
                    className={`px-4 py-4 text-right font-mono ${
                      transacao.tipo === 'Receita' ? 'text-positive' : 'text-negative'
                    }`}
                  >
                    {transacao.tipo === 'Receita' ? '+' : '−'} {formatarBRL(transacao.valor)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="flex justify-end">
                      <BotaoEditar
                        rotulo={`Editar ${transacao.descricao}`}
                        onClick={() => setFormAberto(true)}
                      />
                      <BotaoExcluir
                        rotulo={`Excluir ${transacao.descricao}`}
                        onClick={() => setParaExcluir(transacao)}
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
        <p>Excluir o lançamento “{paraExcluir?.descricao}”?</p>
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
