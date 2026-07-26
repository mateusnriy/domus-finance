import { formatarBRL } from '@/lib/format';

type BarraProporcaoProps = { receitas: number; despesas: number; maximo: number };

export default function BarraProporcao({ receitas, despesas, maximo }: BarraProporcaoProps) {
  const largura = (valor: number) => (maximo > 0 ? `${(valor / maximo) * 100}%` : '0%');

  return (
    <div
      role="img"
      aria-label={`Receitas de ${formatarBRL(receitas)}, despesas de ${formatarBRL(despesas)}`}
      className="flex flex-col gap-1"
    >
      <div className="h-[3px] rounded-full bg-positive/50" style={{ width: largura(receitas) }} />
      <div className="h-[3px] rounded-full bg-negative/50" style={{ width: largura(despesas) }} />
    </div>
  );
}
