import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

type ModalProps = {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
};

const SELETOR_FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ aberto, titulo, onFechar, children }: ModalProps) {
  const dialogoRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLElement | null>(null);
  const idTitulo = useId();

  // O foco precisa voltar ao elemento que abriu o diálogo, então ele é guardado
  // antes de mover o foco para dentro.
  useEffect(() => {
    if (!aberto) return;

    gatilhoRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogoRef.current?.focus();

    return () => gatilhoRef.current?.focus();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onFechar();
        return;
      }

      if (evento.key !== 'Tab') return;

      const focaveis = dialogoRef.current?.querySelectorAll<HTMLElement>(SELETOR_FOCAVEIS);
      if (!focaveis || focaveis.length === 0) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div
        ref={dialogoRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        className="w-full max-w-sm border border-divider bg-surface p-8 shadow-lg focus:outline-none"
      >
        <h2 id={idTitulo} className="text-[10px] tracking-[0.2em] text-hint uppercase">
          {titulo}
        </h2>
        <div className="mt-4 text-sm">{children}</div>
      </div>
    </div>
  );
}
