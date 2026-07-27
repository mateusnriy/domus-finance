import { useId } from 'react';
import type { TipoTransacao } from '@/types/transacao';

type SeletorTipoProps = {
  valor: TipoTransacao;
  onChange: (tipo: TipoTransacao) => void;
  menorDeIdade?: boolean;
};

export default function SeletorTipo({ valor, onChange, menorDeIdade = false }: SeletorTipoProps) {
  const nome = useId();

  // RN03: menor de idade não recebe a opção de receita — o tipo é fixo em despesa.
  if (menorDeIdade) {
    return (
      <div>
        <p className="text-[10px] tracking-[0.2em] text-hint uppercase">Tipo</p>
        <p className="py-2 text-sm">
          Despesa <span className="text-hint">(menores só registram despesas)</span>
        </p>
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="text-[10px] tracking-[0.2em] text-hint uppercase">Tipo</legend>
      <div className="flex gap-6 py-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={nome}
            value="Receita"
            checked={valor === 'Receita'}
            onChange={() => onChange('Receita')}
            className="accent-positive"
          />
          Receita
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={nome}
            value="Despesa"
            checked={valor === 'Despesa'}
            onChange={() => onChange('Despesa')}
            className="accent-negative"
          />
          Despesa
        </label>
      </div>
    </fieldset>
  );
}
