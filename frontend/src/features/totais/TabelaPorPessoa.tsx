import BarraProporcao from '@/components/BarraProporcao';
import Selo from '@/components/Selo';
import Tabela from '@/components/Tabela';
import { formatarBRL } from '@/lib/format';
import type { ResumoPessoa } from '@/types/totais';

type TabelaPorPessoaProps = {
  pessoas: ResumoPessoa[];
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
};

const CABECALHO = 'px-4 py-3 text-[10px] tracking-[0.2em] text-hint uppercase';

const corDoSaldo = (valor: number) => {
  if (valor > 0) return 'text-positive';
  if (valor < 0) return 'text-negative';
  return 'text-ink';
};

export default function TabelaPorPessoa({
  pessoas,
  totalReceitas,
  totalDespesas,
  saldoLiquido,
}: TabelaPorPessoaProps) {
  // As barras são escaladas pelo maior valor entre as pessoas, o que torna as
  // linhas comparáveis entre si (RF16).
  const maximo = Math.max(
    ...pessoas.map((pessoa) => Math.max(pessoa.totalReceitas, pessoa.totalDespesas)),
    0,
  );

  return (
    <Tabela larguraMinima="40rem">
      <thead className="bg-card">
        <tr>
          <th scope="col" className={`${CABECALHO} text-left`}>
            Pessoa
          </th>
          <th scope="col" className={`${CABECALHO} text-right`}>
            Receitas
          </th>
          <th scope="col" className={`${CABECALHO} text-right`}>
            Despesas
          </th>
          <th scope="col" className={`${CABECALHO} text-right`}>
            Saldo
          </th>
        </tr>
      </thead>
      <tbody>
        {pessoas.map((pessoa) => {
          const temAtividade = pessoa.totalReceitas > 0 || pessoa.totalDespesas > 0;

          return (
            <tr key={pessoa.pessoaId} className="border-t border-divider hover:bg-card/50">
              <td className="px-4 py-4">
                <span className="flex items-center gap-2">
                  {pessoa.nome}
                  <span className="font-mono text-hint">{pessoa.idade}a</span>
                  {pessoa.idade < 18 && <Selo>menor</Selo>}
                </span>
                {temAtividade && (
                  <div className="mt-2 max-w-56">
                    <BarraProporcao
                      receitas={pessoa.totalReceitas}
                      despesas={pessoa.totalDespesas}
                      maximo={maximo}
                    />
                  </div>
                )}
              </td>
              <td className="px-4 py-4 text-right align-top font-mono">
                {formatarBRL(pessoa.totalReceitas)}
              </td>
              <td className="px-4 py-4 text-right align-top font-mono">
                {formatarBRL(pessoa.totalDespesas)}
              </td>
              <td
                className={`px-4 py-4 text-right align-top font-mono ${corDoSaldo(pessoa.saldo)}`}
              >
                {formatarBRL(pessoa.saldo)}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="border-t-2 border-ink bg-card">
          <td className="px-4 py-4 text-[10px] tracking-[0.2em] uppercase">Total geral</td>
          <td className="px-4 py-4 text-right font-mono">{formatarBRL(totalReceitas)}</td>
          <td className="px-4 py-4 text-right font-mono">{formatarBRL(totalDespesas)}</td>
          <td className={`px-4 py-4 text-right font-mono ${corDoSaldo(saldoLiquido)}`}>
            {formatarBRL(saldoLiquido)}
          </td>
        </tr>
      </tfoot>
    </Tabela>
  );
}
