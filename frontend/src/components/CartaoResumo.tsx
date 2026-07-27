import Cartao from '@/components/Cartao';
import { formatarBRL } from '@/lib/format';

type CartaoResumoProps = {
  rotulo: string;
  valor: number;
  semantica?: 'positivo' | 'negativo' | 'neutro';
};

const CORES = {
  positivo: 'text-positive',
  negativo: 'text-negative',
  neutro: 'text-ink',
};

export default function CartaoResumo({ rotulo, valor, semantica = 'neutro' }: CartaoResumoProps) {
  return (
    <Cartao className="p-6">
      <p className="text-[10px] tracking-[0.2em] text-hint uppercase">{rotulo}</p>
      <p className={`mt-2 font-mono text-xl ${CORES[semantica]}`}>{formatarBRL(valor)}</p>
    </Cartao>
  );
}
