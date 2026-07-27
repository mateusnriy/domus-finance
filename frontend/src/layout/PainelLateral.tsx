import { NavLink } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

const ITENS = [
  { para: '/totais', rotulo: 'Totais' },
  { para: '/transacoes', rotulo: 'Transações' },
  { para: '/pessoas', rotulo: 'Pessoas' },
];

// min-h-10 garante alvo de toque confortável (07-ACESSIBILIDADE §9).
const ITEM_BASE =
  'flex min-h-10 items-center rounded-[2px] px-3 text-[10px] tracking-[0.18em] uppercase transition-colors';

export default function PainelLateral() {
  const { sair } = useAuth();

  return (
    <aside className="bg-panel md:sticky md:top-0 md:h-screen md:w-[200px] md:shrink-0">
      {/* No mobile a faixa quebra em vez de estourar a largura da página a 320px. */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 md:h-full md:flex-col md:flex-nowrap md:items-stretch md:gap-0 md:p-0">
        <div className="hidden border-b border-white/10 px-5 py-6 md:block">
          <p className="text-2xl font-semibold tracking-[0.25em] text-panelactive uppercase">
            Domus
          </p>
          <p className="text-[10px] tracking-[0.2em] text-paneltext/70 uppercase">finance</p>
        </div>

        <nav aria-label="Navegação principal" className="md:flex-1 md:px-3 md:py-4">
          <ul className="flex flex-wrap gap-1 md:flex-col">
            {ITENS.map((item) => (
              <li key={item.para}>
                <NavLink
                  to={item.para}
                  className={({ isActive }) =>
                    `${ITEM_BASE} ${
                      isActive
                        ? 'bg-white/10 text-panelactive'
                        : 'text-paneltext hover:bg-white/5 hover:text-panelactive'
                    }`
                  }
                >
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto md:ml-0 md:border-t md:border-white/10 md:p-3">
          <button
            type="button"
            onClick={sair}
            className={`${ITEM_BASE} w-full text-left text-paneltext hover:bg-white/5 hover:text-panelactive`}
          >
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
