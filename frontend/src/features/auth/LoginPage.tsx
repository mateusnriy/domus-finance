import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import Cartao from '@/components/Cartao';

type Aba = 'entrar' | 'registrar';

const ABA_BASE = 'border-b-2 pb-2 text-[10px] tracking-[0.2em] uppercase transition-colors';

export default function LoginPage() {
  const [aba, setAba] = useState<Aba>('entrar');
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="text-2xl font-semibold tracking-[0.25em] uppercase">
            Domus <span className="text-hint">finance</span>
          </p>
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
              className={`${ABA_BASE} ${
                aba === 'entrar' ? 'border-ink text-ink' : 'border-transparent text-hint'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setAba('registrar')}
              className={`${ABA_BASE} ${
                aba === 'registrar' ? 'border-ink text-ink' : 'border-transparent text-hint'
              }`}
            >
              Registrar
            </button>
          </div>

          <form
            className="mt-6 flex flex-col gap-5"
            onSubmit={(evento) => {
              evento.preventDefault();
              navigate('/totais');
            }}
          >
            {aba === 'registrar' && <Campo label="Nome" placeholder="Maria Souza" />}
            <Campo label="E-mail" type="email" placeholder="seu@email.com" />
            <Campo label="Senha" type="password" placeholder="••••••••" />
            <Botao type="submit" className="mt-2 w-full">
              {aba === 'entrar' ? 'Entrar' : 'Criar conta'}
            </Botao>
          </form>
        </Cartao>

        <p className="mt-6 text-center text-xs text-hint">
          {aba === 'entrar' ? 'Sem conta? Use a aba Registrar.' : 'Já tem conta? Use a aba Entrar.'}
        </p>
      </div>
    </main>
  );
}
