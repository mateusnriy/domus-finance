import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import Cartao from '@/components/Cartao';
import { useToast } from '@/components/useToast';
import { pessoasService } from '@/features/pessoas/pessoasService';
import { traduzirErro } from '@/lib/erros';
import type { Pessoa } from '@/types/pessoa';

type Campos = { nome: string; idade: number };

type PessoaFormProps = {
  pessoa: Pessoa | null;
  onSalvo: () => void;
  onCancelar: () => void;
};

export default function PessoaForm({ pessoa, onSalvo, onCancelar }: PessoaFormProps) {
  const { mostrar } = useToast();
  const [erro, setErro] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Campos>({
    defaultValues: { nome: pessoa?.nome ?? '', idade: pessoa?.idade },
  });

  const enviar = async (dados: Campos) => {
    setErro('');
    const carga = { nome: dados.nome, idade: Number(dados.idade) };

    try {
      if (pessoa) {
        await pessoasService.editar(pessoa.id, carga);
        mostrar('Pessoa atualizada.');
      } else {
        await pessoasService.criar(carga);
        mostrar('Pessoa cadastrada.');
      }

      onSalvo();
    } catch (falha) {
      setErro(traduzirErro(falha));
    }
  };

  return (
    <Cartao className="mt-8 p-6">
      <form className="flex flex-wrap items-end gap-6" onSubmit={handleSubmit(enviar)} noValidate>
        <Campo
          label="Nome"
          placeholder="Ana Souza"
          className="min-w-56 flex-1"
          erro={errors.nome?.message}
          {...register('nome', {
            required: 'O nome é obrigatório.',
            maxLength: { value: 150, message: 'O nome deve ter no máximo 150 caracteres.' },
          })}
        />
        <Campo
          label="Idade"
          mono
          type="number"
          placeholder="34"
          className="w-28"
          erro={errors.idade?.message}
          {...register('idade', {
            required: 'A idade é obrigatória.',
            min: { value: 0, message: 'A idade deve estar entre 0 e 130.' },
            max: { value: 130, message: 'A idade deve estar entre 0 e 130.' },
          })}
        />

        <div className="flex gap-3">
          <Botao type="submit" carregando={isSubmitting}>
            {pessoa ? 'Salvar alteração' : 'Salvar pessoa'}
          </Botao>
          <Botao type="button" variante="secundario" onClick={onCancelar}>
            Cancelar
          </Botao>
        </div>

        {erro && (
          <p role="alert" className="w-full text-xs text-negative">
            {erro}
          </p>
        )}
      </form>
    </Cartao>
  );
}
