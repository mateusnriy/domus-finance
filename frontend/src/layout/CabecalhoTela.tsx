import type { ReactNode } from 'react';

type CabecalhoTelaProps = {
  titulo: string;
  eyebrow: string;
  acao?: ReactNode;
};

export default function CabecalhoTela({ titulo, eyebrow, acao }: CabecalhoTelaProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{titulo}</h1>
        <p className="mt-1 text-[10px] tracking-[0.2em] text-hint uppercase">{eyebrow}</p>
      </div>
      {acao}
    </header>
  );
}
