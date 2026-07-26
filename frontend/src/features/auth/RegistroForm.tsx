import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/auth/useAuth';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import { traduzirErro } from '@/lib/erros';

type Campos = { nome: string; email: string; senha: string };

const TAMANHO_MINIMO_SENHA = 8;

export default function RegistroForm() {
  const { registrar } = useAuth();
  const [erro, setErro] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Campos>();

  const enviar = async (dados: Campos) => {
    setErro('');

    try {
      await registrar(dados.nome, dados.email, dados.senha);
    } catch (falha) {
      setErro(traduzirErro(falha));
    }
  };

  return (
    <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(enviar)} noValidate>
      <Campo
        label="Nome"
        placeholder="Maria Souza"
        autoComplete="name"
        erro={errors.nome?.message}
        {...register('nome', {
          required: 'O nome é obrigatório.',
          maxLength: { value: 150, message: 'O nome deve ter no máximo 150 caracteres.' },
        })}
      />
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
        placeholder="Mínimo de 8 caracteres"
        autoComplete="new-password"
        erro={errors.senha?.message}
        {...register('senha', {
          required: 'A senha é obrigatória.',
          minLength: {
            value: TAMANHO_MINIMO_SENHA,
            message: `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`,
          },
        })}
      />

      {erro && (
        <p role="alert" className="text-xs text-negative">
          {erro}
        </p>
      )}

      <Botao type="submit" carregando={isSubmitting} className="mt-2 w-full">
        Criar conta
      </Botao>
    </form>
  );
}
