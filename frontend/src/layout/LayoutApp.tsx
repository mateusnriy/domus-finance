import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PainelLateral from '@/layout/PainelLateral';

export default function LayoutApp() {
  const { pathname } = useLocation();
  const conteudoRef = useRef<HTMLElement>(null);

  // 07-ACESSIBILIDADE §3: ao trocar de tela, o foco vai para o início do
  // conteúdo em vez de permanecer no item de navegação.
  useEffect(() => {
    conteudoRef.current?.focus();
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <PainelLateral />
      <main
        ref={conteudoRef}
        tabIndex={-1}
        className="flex-1 px-4 py-10 focus:outline-none md:px-10"
      >
        <Outlet />
      </main>
    </div>
  );
}
