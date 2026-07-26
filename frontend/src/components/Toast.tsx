import type { TipoToast } from '@/components/toastContext';

type ToastProps = {
  mensagem: string;
  tipo: TipoToast;
};

export default function Toast({ mensagem, tipo }: ToastProps) {
  const borda = tipo === 'erro' ? 'border-negative text-negative' : 'border-divider text-ink';

  return <div className={`border bg-surface px-4 py-3 text-sm shadow-sm ${borda}`}>{mensagem}</div>;
}
