import type { ReactNode } from 'react';

type CartaoProps = {
  children: ReactNode;
  className?: string;
};

export default function Cartao({ children, className = '' }: CartaoProps) {
  return <div className={`border border-divider bg-card ${className}`}>{children}</div>;
}
