import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';

type SelectProps = {
  label: string;
  erro?: string;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, erro, id, className = '', children, ...props },
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
      <div className="relative">
        <select
          {...props}
          ref={ref}
          id={idCampo}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
          className="w-full appearance-none border-b border-divider bg-transparent py-2 pr-6 text-sm focus:border-ink focus:outline-none"
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute top-1/2 right-1 h-2 w-3 -translate-y-1/2 fill-none stroke-hint"
        >
          <path d="M1 1l5 5 5-5" strokeWidth="1.5" />
        </svg>
      </div>
      {erro && (
        <p id={idErro} className="mt-1 text-xs text-negative">
          {erro}
        </p>
      )}
    </div>
  );
});

export default Select;
