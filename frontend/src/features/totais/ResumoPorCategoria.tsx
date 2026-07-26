import EstadoVazio from '@/components/EstadoVazio';
import { formatarBRL, rotuloCategoria } from '@/lib/format';
import type { ResumoCategoria } from '@/types/totais';

type ResumoPorCategoriaProps = { linhas: ResumoCategoria[] };

export default function ResumoPorCategoria({ linhas }: ResumoPorCategoriaProps) {
  return (
    <section className="mt-10">
      <h2 className="text-[10px] tracking-[0.2em] text-hint uppercase">Despesas por categoria</h2>

      {linhas.length === 0 ? (
        <div className="mt-4">
          <EstadoVazio mensagem="Nenhuma despesa registrada" />
        </div>
      ) : (
        <ul className="mt-4 border-t border-divider">
          {linhas.map((linha) => (
            <li
              key={linha.categoria}
              className="flex items-center justify-between border-b border-divider py-3"
            >
              <span className="text-sm">{rotuloCategoria[linha.categoria] ?? linha.categoria}</span>
              <span className="font-mono text-sm">{formatarBRL(linha.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
