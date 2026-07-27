import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import Cartao from '@/components/Cartao';
import Select from '@/components/Select';
import SeletorTipo from '@/components/SeletorTipo';
import { useToast } from '@/components/useToast';
import { transacoesService } from '@/features/transacoes/transacoesService';
import { CATEGORIAS, rotuloCategoria } from '@/lib/format';
import { traduzirErro } from '@/lib/erros';
import type { Pessoa } from '@/types/pessoa';
import type { CategoriaTransacao, TipoTransacao, Transacao } from '@/types/transacao';

type Campos = {
  pessoaId: string;
  tipo: TipoTransacao;
  descricao: string;
  valor: string;
  data: string;
  categoria: string;
};

type TransacaoFormProps = {
  transacao: Transacao | null;
  pessoas: Pessoa[];
  onSalvo: () => void;
  onCancelar: () => void;
};

const hoje = () => new Date().toISOString().slice(0, 10);

export default function TransacaoForm({
  transacao,
  pessoas,
  onSalvo,
  onCancelar,
}: TransacaoFormProps) {
  const { mostrar } = useToast();
  const [erro, setErro] = useState('');
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Campos>({
    defaultValues: {
      pessoaId: transacao?.pessoaId ?? pessoas[0]?.id ?? '',
      tipo: transacao?.tipo ?? 'Despesa',
      descricao: transacao?.descricao ?? '',
      valor: transacao ? String(transacao.valor) : '',
      data: transacao?.data ?? hoje(),
      categoria: transacao?.categoria ?? '',
    },
  });

  const pessoaId = useWatch({ control, name: 'pessoaId' });
  const menorDeIdade = pessoas.find((pessoa) => pessoa.id === pessoaId)?.menorDeIdade ?? false;

  const enviar = async (dados: Campos) => {
    setErro('');

    const carga = {
      pessoaId: dados.pessoaId,
      // RN03: o servidor rejeita receita de menor; o cliente nem chega a enviar.
      tipo: menorDeIdade ? ('Despesa' as TipoTransacao) : dados.tipo,
      descricao: dados.descricao,
      valor: Number(dados.valor),
      data: dados.data,
      categoria: dados.categoria === '' ? null : (dados.categoria as CategoriaTransacao),
    };

    try {
      if (transacao) {
        await transacoesService.editar(transacao.id, carga);
        mostrar('Transação atualizada.');
      } else {
        await transacoesService.criar(carga);
        mostrar('Transação cadastrada.');
      }

      onSalvo();
    } catch (falha) {
      setErro(traduzirErro(falha));
    }
  };

  return (
    <Cartao className="mt-8 p-6">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(enviar)} noValidate>
        <div className="flex flex-wrap gap-6">
          <Select
            label="Pessoa"
            className="min-w-48 flex-1"
            erro={errors.pessoaId?.message}
            {...register('pessoaId', { required: 'A pessoa é obrigatória.' })}
          >
            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome}
              </option>
            ))}
          </Select>

          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <SeletorTipo
                valor={menorDeIdade ? 'Despesa' : field.value}
                onChange={field.onChange}
                menorDeIdade={menorDeIdade}
              />
            )}
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <Campo
            label="Descrição"
            placeholder="Supermercado"
            className="min-w-56 flex-1"
            erro={errors.descricao?.message}
            {...register('descricao', {
              required: 'A descrição é obrigatória.',
              maxLength: { value: 200, message: 'A descrição deve ter no máximo 200 caracteres.' },
            })}
          />
          <Campo
            label="Valor"
            mono
            type="number"
            step="0.01"
            placeholder="0,00"
            className="w-32"
            erro={errors.valor?.message}
            {...register('valor', {
              required: 'O valor é obrigatório.',
              validate: (valor) => Number(valor) > 0 || 'O valor deve ser maior que zero.',
            })}
          />
          <Campo
            label="Data"
            mono
            type="date"
            max={hoje()}
            className="w-40"
            erro={errors.data?.message}
            {...register('data', {
              required: 'A data é obrigatória.',
              validate: (data) => data <= hoje() || 'A data não pode ser futura.',
            })}
          />
          <Select label="Categoria" className="w-44" {...register('categoria')}>
            <option value="">Sem categoria</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {rotuloCategoria[categoria]}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex gap-3">
          <Botao type="submit" carregando={isSubmitting}>
            {transacao ? 'Salvar alteração' : 'Salvar transação'}
          </Botao>
          <Botao type="button" variante="secundario" onClick={onCancelar}>
            Cancelar
          </Botao>
        </div>

        {erro && (
          <p role="alert" className="text-xs text-negative">
            {erro}
          </p>
        )}
      </form>
    </Cartao>
  );
}
