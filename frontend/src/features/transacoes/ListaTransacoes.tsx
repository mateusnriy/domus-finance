import BotaoEditar from '@/components/BotaoEditar';
import BotaoExcluir from '@/components/BotaoExcluir';
import Tabela from '@/components/Tabela';
import { formatarBRL, formatarData, rotuloCategoria } from '@/lib/format';
import type { Transacao } from '@/types/transacao';

type ListaTransacoesProps = {
  transacoes: Transacao[];
  onEditar: (transacao: Transacao) => void;
  onExcluir: (transacao: Transacao) => void;
};

const CABECALHO = 'px-4 py-3 text-[10px] tracking-[0.2em] text-hint uppercase';

export default function ListaTransacoes({ transacoes, onEditar, onExcluir }: ListaTransacoesProps) {
  return (
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
        {transacoes.map((transacao) => (
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
                  onClick={() => onEditar(transacao)}
                />
                <BotaoExcluir
                  rotulo={`Excluir ${transacao.descricao}`}
                  onClick={() => onExcluir(transacao)}
                />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </Tabela>
  );
}
