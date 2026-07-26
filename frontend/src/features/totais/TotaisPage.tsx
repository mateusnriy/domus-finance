import Carregando from '@/components/Carregando';
import EstadoVazio from '@/components/EstadoVazio';
import CabecalhoTela from '@/layout/CabecalhoTela';
import CartoesResumo from '@/features/totais/CartoesResumo';
import ResumoPorCategoria from '@/features/totais/ResumoPorCategoria';
import TabelaPorPessoa from '@/features/totais/TabelaPorPessoa';
import { useTotais } from '@/features/totais/useTotais';

export default function TotaisPage() {
  const { resumo, carregando, erro } = useTotais();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <CabecalhoTela titulo="Totais" eyebrow="Consolidado da residência" />

      {carregando && <Carregando />}

      {!carregando && erro && (
        <p role="alert" className="mt-8 text-sm text-negative">
          {erro}
        </p>
      )}

      {!carregando && !erro && resumo && resumo.pessoas.length === 0 && (
        <div className="mt-8">
          <EstadoVazio
            mensagem="Nada a consolidar"
            apoio="Cadastre os moradores e seus lançamentos para ver os totais."
          />
        </div>
      )}

      {!carregando && !erro && resumo && resumo.pessoas.length > 0 && (
        <>
          <CartoesResumo
            totalReceitas={resumo.totalReceitas}
            totalDespesas={resumo.totalDespesas}
            saldoLiquido={resumo.saldoLiquido}
          />

          <section className="mt-10">
            <h2 className="text-[10px] tracking-[0.2em] text-hint uppercase">Por pessoa</h2>
            <div className="mt-4">
              <TabelaPorPessoa
                pessoas={resumo.pessoas}
                totalReceitas={resumo.totalReceitas}
                totalDespesas={resumo.totalDespesas}
                saldoLiquido={resumo.saldoLiquido}
              />
            </div>
          </section>

          <ResumoPorCategoria linhas={resumo.despesasPorCategoria} />
        </>
      )}
    </div>
  );
}
