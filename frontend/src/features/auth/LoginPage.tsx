import { useState } from 'react';
import Cartao from '@/components/Cartao';
import LoginForm from '@/features/auth/LoginForm';
import RegistroForm from '@/features/auth/RegistroForm';

type Aba = 'entrar' | 'registrar';

const ABA_BASE = 'border-b-2 pb-2 text-[10px] tracking-[0.2em] uppercase transition-colors';

export default function LoginPage() {
  const [aba, setAba] = useState<Aba>('entrar');

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
          <div className="flex gap-6 border-b border-divider">
            <button
              type="button"
              onClick={() => setAba('entrar')}
              aria-current={aba === 'entrar' ? 'page' : undefined}
              className={`${ABA_BASE} ${
                aba === 'entrar' ? 'border-ink text-ink' : 'border-transparent text-hint'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setAba('registrar')}
              aria-current={aba === 'registrar' ? 'page' : undefined}
              className={`${ABA_BASE} ${
                aba === 'registrar' ? 'border-ink text-ink' : 'border-transparent text-hint'
              }`}
            >
              Registrar
            </button>
          </div>

          {aba === 'entrar' ? <LoginForm /> : <RegistroForm />}
        </Cartao>

        <p className="mt-6 text-center text-xs text-hint">
          {aba === 'entrar' ? 'Sem conta? Use a aba Registrar.' : 'Já tem conta? Use a aba Entrar.'}
        </p>
      </div>
    </main>
  );
}
