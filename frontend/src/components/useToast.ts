import { useContext } from 'react';
import { ToastContext } from '@/components/toastContext';

export function useToast() {
  const contexto = useContext(ToastContext);

  if (!contexto) {
    throw new Error('useToast precisa ser usado dentro de ToastProvider.');
  }

  return contexto;
}
