import type { ReactNode } from 'react';

type SeloProps = { children: ReactNode };

export default function Selo({ children }: SeloProps) {
  return (
    <span className="border border-divider px-1.5 py-0.5 text-[9px] tracking-wider text-hint uppercase">
      {children}
    </span>
  );
}
