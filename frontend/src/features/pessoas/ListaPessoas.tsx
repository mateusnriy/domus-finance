import BotaoEditar from '@/components/BotaoEditar';
import BotaoExcluir from '@/components/BotaoExcluir';
import Selo from '@/components/Selo';
import Tabela from '@/components/Tabela';
import type { Pessoa } from '@/types/pessoa';

type ListaPessoasProps = {
  pessoas: Pessoa[];
  onEditar: (pessoa: Pessoa) => void;
  onExcluir: (pessoa: Pessoa) => void;
};

const CABECALHO = 'px-4 py-3 text-[10px] tracking-[0.2em] text-hint uppercase';

export default function ListaPessoas({ pessoas, onEditar, onExcluir }: ListaPessoasProps) {
  return (
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
                <BotaoEditar rotulo={`Editar ${pessoa.nome}`} onClick={() => onEditar(pessoa)} />
                <BotaoExcluir rotulo={`Excluir ${pessoa.nome}`} onClick={() => onExcluir(pessoa)} />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </Tabela>
  );
}
