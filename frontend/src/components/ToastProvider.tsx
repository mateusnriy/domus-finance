import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Toast from '@/components/Toast';
import { ToastContext } from '@/components/toastContext';
import type { TipoToast } from '@/components/toastContext';

const DURACAO_MS = 4000;

type ItemToast = {
  id: number;
  mensagem: string;
  tipo: TipoToast;
};

type ToastProviderProps = { children: ReactNode };

export default function ToastProvider({ children }: ToastProviderProps) {
  const [itens, setItens] = useState<ItemToast[]>([]);
  const proximoId = useRef(0);

  const mostrar = useCallback((mensagem: string, tipo: TipoToast = 'sucesso') => {
    const id = proximoId.current;
    proximoId.current += 1;

    setItens((atuais) => [...atuais, { id, mensagem, tipo }]);
    setTimeout(() => setItens((atuais) => atuais.filter((item) => item.id !== id)), DURACAO_MS);
  }, []);

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {itens.map((item) => (
          <Toast key={item.id} mensagem={item.mensagem} tipo={item.tipo} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
