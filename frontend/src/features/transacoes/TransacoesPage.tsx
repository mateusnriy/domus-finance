import { useMemo, useState } from 'react';
import Botao from '@/components/Botao';
import Carregando from '@/components/Carregando';
import EstadoVazio from '@/components/EstadoVazio';
import Modal from '@/components/Modal';
import { useToast } from '@/components/useToast';
import CabecalhoTela from '@/layout/CabecalhoTela';
import { usePessoas } from '@/features/pessoas/usePessoas';
import FiltrosTransacao from '@/features/transacoes/FiltrosTransacao';
import type { ValoresDeFiltro } from '@/features/transacoes/FiltrosTransacao';
import ListaTransacoes from '@/features/transacoes/ListaTransacoes';
import TransacaoForm from '@/features/transacoes/TransacaoForm';
import { transacoesService } from '@/features/transacoes/transacoesService';
import { useTransacoes } from '@/features/transacoes/useTransacoes';
import { traduzirErro } from '@/lib/erros';
import type { CategoriaTransacao, TipoTransacao, Transacao } from '@/types/transacao';

const FILTRO_VAZIO: ValoresDeFiltro = {
  pessoaId: '',
  tipo: '',
  categoria: '',
  dataInicio: '',
  dataFim: '',
};

export default function TransacoesPage() {
  const { mostrar } = useToast();
  const { pessoas } = usePessoas();
  const [filtros, setFiltros] = useState<ValoresDeFiltro>(FILTRO_VAZIO);

  const filtroDaBusca = useMemo(
    () => ({
      pessoaId: filtros.pessoaId || undefined,
      tipo: (filtros.tipo || undefined) as TipoTransacao | undefined,
      categoria: (filtros.categoria || undefined) as CategoriaTransacao | undefined,
      dataInicio: filtros.dataInicio || undefined,
      dataFim: filtros.dataFim || undefined,
    }),
    [filtros],
  );

  const { transacoes, carregando, erro, recarregar } = useTransacoes(filtroDaBusca);

  const [formAberto, setFormAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<Transacao | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Transacao | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const temFiltro = Object.values(filtros).some(Boolean);

  const fecharForm = () => {
    setFormAberto(false);
    setEmEdicao(null);
  };

  const aoSalvar = () => {
    fecharForm();
    void recarregar();
  };

  const editar = (transacao: Transacao) => {
    setEmEdicao(transacao);
    setFormAberto(true);
  };

  const excluir = async () => {
    if (!paraExcluir) return;

    setExcluindo(true);

    try {
      await transacoesService.excluir(paraExcluir.id);
      mostrar('Transação excluída.');
      setParaExcluir(null);
      void recarregar();
    } catch (falha) {
      mostrar(traduzirErro(falha), 'erro');
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <CabecalhoTela
        titulo="Transações"
        eyebrow={`${transacoes.length} ${transacoes.length === 1 ? 'registro' : 'registros'}${
          temFiltro ? ' · filtrado' : ''
        }`}
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
        <TransacaoForm
          key={emEdicao?.id ?? 'nova'}
          transacao={emEdicao}
          pessoas={pessoas}
          onSalvo={aoSalvar}
          onCancelar={fecharForm}
        />
      )}

      <FiltrosTransacao
        valores={filtros}
        pessoas={pessoas}
        onAlterar={(campo, valor) => setFiltros((atuais) => ({ ...atuais, [campo]: valor }))}
        onLimpar={() => setFiltros(FILTRO_VAZIO)}
      />

      <div className="mt-8">
        {carregando && <Carregando />}

        {!carregando && erro && (
          <p role="alert" className="text-sm text-negative">
            {erro}
          </p>
        )}

        {!carregando && !erro && transacoes.length === 0 && (
          <EstadoVazio
            mensagem="Nenhuma transação encontrada"
            apoio={
              temFiltro
                ? 'Ajuste os filtros para ver outros lançamentos.'
                : 'Registre o primeiro lançamento da casa.'
            }
          />
        )}

        {!carregando && !erro && transacoes.length > 0 && (
          <ListaTransacoes transacoes={transacoes} onEditar={editar} onExcluir={setParaExcluir} />
        )}
      </div>

      <Modal
        aberto={paraExcluir !== null}
        titulo="Confirmar exclusão"
        onFechar={() => setParaExcluir(null)}
      >
        <p>Excluir o lançamento “{paraExcluir?.descricao}”?</p>
        <p className="mt-2 text-hint">A ação é irreversível.</p>

        <div className="mt-6 flex gap-3">
          <Botao variante="destrutivo" carregando={excluindo} onClick={excluir}>
            Excluir
          </Botao>
          <Botao variante="secundario" onClick={() => setParaExcluir(null)}>
            Cancelar
          </Botao>
        </div>
      </Modal>
    </div>
  );
}
