import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import AuthProvider from '@/auth/AuthProvider';
import ToastProvider from '@/components/ToastProvider';

type OpcoesDeRender = {
  rota?: string;
  // As telas internas são renderizadas dentro do <main> do LayoutApp; sem ele o
  // axe acusaria conteúdo fora de marco de página que na aplicação real existe.
  comMain?: boolean;
};

export function renderizarTela(ui: ReactNode, { rota = '/', comMain = true }: OpcoesDeRender = {}) {
  const conteudo = comMain ? <main>{ui}</main> : ui;

  return render(
    <MemoryRouter initialEntries={[rota]}>
      <AuthProvider>
        <ToastProvider>{conteudo}</ToastProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

export async function violacoesDeAcessibilidade(container: HTMLElement) {
  const resultado = await axe.run(container);

  return resultado.violations.map(
    (violacao) => `${violacao.id}: ${violacao.help} (${violacao.nodes.length})`,
  );
}
