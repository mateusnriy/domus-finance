import BarraProporcao from '@/components/BarraProporcao';
import CartaoResumo from '@/components/CartaoResumo';
import Selo from '@/components/Selo';
import Tabela from '@/components/Tabela';
import CabecalhoTela from '@/layout/CabecalhoTela';
import { formatarBRL, rotuloCategoria } from '@/lib/format';
import type { ResumoGeral } from '@/types/totais';

// Dados estáticos de prévia visual. A carga real da API entra na etapa F6.
const RESUMO_EXEMPLO: ResumoGeral = {
  pessoas: [
    {
      pessoaId: '1',
      nome: 'Ana Souza',
      idade: 34,
      totalReceitas: 4500,
      totalDespesas: 2320.5,
      saldo: 2179.5,
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
  totalDespesas: 2550.5,
  saldoLiquido: 1949.5,
  despesasPorCategoria: [
    { categoria: 'Moradia', total: 1500 },
    { categoria: 'Alimentacao', total: 820.5 },
    { categoria: 'Educacao', total: 230 },
  ],
};

const CABECALHO = 'px-4 py-3 text-[10px] tracking-[0.2em] text-hint uppercase';

const corDoSaldo = (valor: number) => {
  if (valor > 0) return 'text-positive';
  if (valor < 0) return 'text-negative';
  return 'text-ink';
};

export default function TotaisPage() {
  const resumo = RESUMO_EXEMPLO;

  const maximo = Math.max(
    ...resumo.pessoas.map((pessoa) => Math.max(pessoa.totalReceitas, pessoa.totalDespesas)),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <CabecalhoTela titulo="Totais" eyebrow="Consolidado da residência" />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <CartaoResumo rotulo="Receitas" valor={resumo.totalReceitas} semantica="positivo" />
        <CartaoResumo rotulo="Despesas" valor={resumo.totalDespesas} semantica="negativo" />
        <CartaoResumo
          rotulo="Saldo"
          valor={resumo.saldoLiquido}
          semantica={resumo.saldoLiquido < 0 ? 'negativo' : 'positivo'}
        />
      </div>

      <section className="mt-10">
        <h2 className="text-[10px] tracking-[0.2em] text-hint uppercase">Por pessoa</h2>

        <div className="mt-4">
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
              {resumo.pessoas.map((pessoa) => {
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
                <td className="px-4 py-4 text-right font-mono">
                  {formatarBRL(resumo.totalReceitas)}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {formatarBRL(resumo.totalDespesas)}
                </td>
                <td className={`px-4 py-4 text-right font-mono ${corDoSaldo(resumo.saldoLiquido)}`}>
                  {formatarBRL(resumo.saldoLiquido)}
                </td>
              </tr>
            </tfoot>
          </Tabela>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[10px] tracking-[0.2em] text-hint uppercase">Despesas por categoria</h2>

        <ul className="mt-4 border-t border-divider">
          {resumo.despesasPorCategoria.map((linha) => (
            <li
              key={linha.categoria}
              className="flex items-center justify-between border-b border-divider py-3"
            >
              <span className="text-sm">{rotuloCategoria[linha.categoria] ?? linha.categoria}</span>
              <span className="font-mono text-sm">{formatarBRL(linha.total)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
