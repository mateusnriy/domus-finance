import { createContext } from 'react';

export type TipoToast = 'sucesso' | 'erro';

export type ContextoToast = {
  mostrar: (mensagem: string, tipo?: TipoToast) => void;
};

export const ToastContext = createContext<ContextoToast | null>(null);
