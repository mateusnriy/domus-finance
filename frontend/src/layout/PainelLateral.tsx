import { NavLink } from 'react-router-dom';

const ITENS = [
  { para: '/totais', rotulo: 'Totais' },
  { para: '/transacoes', rotulo: 'Transações' },
  { para: '/pessoas', rotulo: 'Pessoas' },
];

const ITEM_BASE =
  'block rounded-[2px] px-3 py-2 text-[10px] tracking-[0.18em] uppercase transition-colors';

export default function PainelLateral() {
  return (
    <aside className="bg-panel md:sticky md:top-0 md:h-screen md:w-[200px] md:shrink-0">
      <div className="flex items-center gap-2 px-3 py-2 md:h-full md:flex-col md:items-stretch md:gap-0 md:p-0">
        <div className="hidden border-b border-white/10 px-5 py-6 md:block">
          <p className="text-2xl font-semibold tracking-[0.25em] text-panelactive uppercase">
            Domus
          </p>
          <p className="text-[10px] tracking-[0.2em] text-paneltext/70 uppercase">finance</p>
        </div>

        <nav aria-label="Navegação principal" className="md:flex-1 md:px-3 md:py-4">
          <ul className="flex gap-1 md:flex-col">
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
          <NavLink to="/login" className={`${ITEM_BASE} text-paneltext hover:text-panelactive`}>
            Sair
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
