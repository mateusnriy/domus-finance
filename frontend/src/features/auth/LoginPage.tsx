import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import Cartao from '@/components/Cartao';
import LoginForm from '@/features/auth/LoginForm';
import RegistroForm from '@/features/auth/RegistroForm';

const ABAS = [
  { id: 'entrar', rotulo: 'Entrar' },
  { id: 'registrar', rotulo: 'Registrar' },
] as const;

type Aba = (typeof ABAS)[number]['id'];

const ABA_BASE = 'border-b-2 pb-2 text-[10px] tracking-[0.2em] uppercase transition-colors';

export default function LoginPage() {
  const [aba, setAba] = useState<Aba>('entrar');

  // Padrão de abas: setas percorrem a lista e movem o foco junto da seleção.
  const aoTeclar = (evento: KeyboardEvent<HTMLButtonElement>) => {
    if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;

    evento.preventDefault();

    const atual = ABAS.findIndex((item) => item.id === aba);
    const passo = evento.key === 'ArrowRight' ? 1 : -1;
    const proxima = ABAS[(atual + passo + ABAS.length) % ABAS.length];

    setAba(proxima.id);
    document.getElementById(`aba-${proxima.id}`)?.focus();
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-[0.25em] uppercase">
            Domus <span className="text-hint">finance</span>
          </h1>
          <hr className="mx-auto mt-4 w-16 border-divider" />
          <p className="mt-4 text-[10px] tracking-[0.2em] text-hint uppercase">
            Controle financeiro da casa
          </p>
        </div>

        <Cartao className="mt-8 p-8">
          <div
            role="tablist"
            aria-label="Autenticação"
            className="flex gap-6 border-b border-divider"
          >
            {ABAS.map((item) => (
              <button
                key={item.id}
                id={`aba-${item.id}`}
                type="button"
                role="tab"
                aria-selected={aba === item.id}
                aria-controls={`painel-${item.id}`}
                tabIndex={aba === item.id ? 0 : -1}
                onClick={() => setAba(item.id)}
                onKeyDown={aoTeclar}
                className={`${ABA_BASE} ${
                  aba === item.id ? 'border-ink text-ink' : 'border-transparent text-hint'
                }`}
              >
                {item.rotulo}
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`}>
            {aba === 'entrar' ? <LoginForm /> : <RegistroForm />}
          </div>
        </Cartao>

        <p className="mt-6 text-center text-xs text-hint">
          {aba === 'entrar' ? 'Sem conta? Use a aba Registrar.' : 'Já tem conta? Use a aba Entrar.'}
        </p>
      </div>
    </main>
  );
}
