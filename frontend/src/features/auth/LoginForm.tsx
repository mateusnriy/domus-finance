import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/auth/useAuth';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import { MENSAGEM_CREDENCIAL_INVALIDA } from '@/lib/erros';

type Campos = { email: string; senha: string };

export default function LoginForm() {
  const { entrar } = useAuth();
  const [erro, setErro] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Campos>();

  // RN13: qualquer falha de autenticação usa a mesma mensagem, sem distinguir
  // e-mail inexistente de senha incorreta.
  const enviar = async (dados: Campos) => {
    setErro('');

    try {
      await entrar(dados.email, dados.senha);
    } catch (falha) {
      console.error(falha);
      setErro(MENSAGEM_CREDENCIAL_INVALIDA);
    }
  };

  return (
    <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(enviar)} noValidate>
      <Campo
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        erro={errors.email?.message}
        {...register('email', { required: 'O e-mail é obrigatório.' })}
      />
      <Campo
        label="Senha"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        erro={errors.senha?.message}
        {...register('senha', { required: 'A senha é obrigatória.' })}
      />

      {erro && (
        <p role="alert" className="text-xs text-negative">
          {erro}
        </p>
      )}

      <Botao type="submit" carregando={isSubmitting} className="mt-2 w-full">
        Entrar
      </Botao>
    </form>
  );
}
