import type { ReactNode } from 'react';

type TabelaProps = {
  children: ReactNode;
  larguraMinima?: string;
};

// A rolagem fica contida na tabela, nunca na página (RNF14, 320px).
export default function Tabela({ children, larguraMinima = '34rem' }: TabelaProps) {
  return (
    <div className="overflow-x-auto border border-divider">
      <table className="w-full border-collapse text-sm" style={{ minWidth: larguraMinima }}>
        {children}
      </table>
    </div>
  );
}
