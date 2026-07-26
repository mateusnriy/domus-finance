import { useState } from 'react';
import Botao from '@/components/Botao';
import Carregando from '@/components/Carregando';
import EstadoVazio from '@/components/EstadoVazio';
import CabecalhoTela from '@/layout/CabecalhoTela';
import ConfirmarExclusao from '@/features/pessoas/ConfirmarExclusao';
import ListaPessoas from '@/features/pessoas/ListaPessoas';
import PessoaForm from '@/features/pessoas/PessoaForm';
import { usePessoas } from '@/features/pessoas/usePessoas';
import type { Pessoa } from '@/types/pessoa';

export default function PessoasPage() {
  const { pessoas, carregando, erro, recarregar } = usePessoas();
  const [formAberto, setFormAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<Pessoa | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Pessoa | null>(null);

  const fecharForm = () => {
    setFormAberto(false);
    setEmEdicao(null);
  };

  const aoSalvar = () => {
    fecharForm();
    void recarregar();
  };

  const editar = (pessoa: Pessoa) => {
    setEmEdicao(pessoa);
    setFormAberto(true);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <CabecalhoTela
        titulo="Pessoas"
        eyebrow={`${pessoas.length} ${pessoas.length === 1 ? 'morador' : 'moradores'}`}
        acao={
          <Botao
            variante={formAberto ? 'secundario' : 'primario'}
            onClick={() => (formAberto ? fecharForm() : setFormAberto(true))}
          >
            {formAberto ? 'Cancelar' : '+ Adicionar'}
          </Botao>
        }
      />

      {formAberto && (
        // A chave força um formulário novo ao alternar entre criar e editar,
        // para os valores padrão do modo anterior não persistirem.
        <PessoaForm
          key={emEdicao?.id ?? 'nova'}
          pessoa={emEdicao}
          onSalvo={aoSalvar}
          onCancelar={fecharForm}
        />
      )}

      <div className="mt-8">
        {carregando && <Carregando />}

        {!carregando && erro && (
          <p role="alert" className="text-sm text-negative">
            {erro}
          </p>
        )}

        {!carregando && !erro && pessoas.length === 0 && (
          <EstadoVazio
            mensagem="Nenhuma pessoa cadastrada"
            apoio="Adicione os moradores da casa para começar."
          />
        )}

        {!carregando && !erro && pessoas.length > 0 && (
          <ListaPessoas pessoas={pessoas} onEditar={editar} onExcluir={setParaExcluir} />
        )}
      </div>

      <ConfirmarExclusao
        pessoa={paraExcluir}
        onFechar={() => setParaExcluir(null)}
        onExcluida={() => {
          setParaExcluir(null);
          void recarregar();
        }}
      />
    </div>
  );
}
