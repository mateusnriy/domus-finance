import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

type CampoProps = {
  label: string;
  erro?: string;
  mono?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const Campo = forwardRef<HTMLInputElement, CampoProps>(function Campo(
  { label, erro, mono = false, id, className = '', ...props },
  ref,
) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const idErro = `${idCampo}-erro`;

  return (
    <div className={className}>
      <label htmlFor={idCampo} className="block text-[10px] tracking-[0.2em] text-hint uppercase">
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        id={idCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={`w-full border-b border-divider bg-transparent py-2 text-sm placeholder:text-hint focus:border-ink focus:outline-none ${mono ? 'font-mono' : ''}`}
      />
      {erro && (
        <p id={idErro} className="mt-1 text-xs text-negative">
          {erro}
        </p>
      )}
    </div>
  );
});

export default Campo;
