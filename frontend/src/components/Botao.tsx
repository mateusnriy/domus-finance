import type { ButtonHTMLAttributes, ReactNode } from 'react';

type BotaoProps = {
  variante?: 'primario' | 'destrutivo' | 'secundario';
  carregando?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANTES = {
  primario: 'bg-panel text-panelactive hover:bg-accent',
  destrutivo: 'bg-negative text-white',
  secundario: 'border border-divider text-hint hover:text-ink hover:border-ink',
};

export default function Botao({
  variante = 'primario',
  carregando = false,
  disabled,
  className = '',
  children,
  ...props
}: BotaoProps) {
  return (
    <button
      {...props}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={`px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </button>
  );
}
