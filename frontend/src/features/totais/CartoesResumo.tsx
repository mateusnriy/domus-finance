import CartaoResumo from '@/components/CartaoResumo';

type CartoesResumoProps = {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
};

export default function CartoesResumo({
  totalReceitas,
  totalDespesas,
  saldoLiquido,
}: CartoesResumoProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <CartaoResumo rotulo="Receitas" valor={totalReceitas} semantica="positivo" />
      <CartaoResumo rotulo="Despesas" valor={totalDespesas} semantica="negativo" />
      <CartaoResumo
        rotulo="Saldo"
        valor={saldoLiquido}
        semantica={saldoLiquido < 0 ? 'negativo' : 'positivo'}
      />
    </div>
  );
}
