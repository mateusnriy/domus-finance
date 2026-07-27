import { useState } from 'react';
import Botao from '@/components/Botao';
import Modal from '@/components/Modal';
import { useToast } from '@/components/useToast';
import { pessoasService } from '@/features/pessoas/pessoasService';
import { traduzirErro } from '@/lib/erros';
import type { Pessoa } from '@/types/pessoa';

type ConfirmarExclusaoProps = {
  pessoa: Pessoa | null;
  onFechar: () => void;
  onExcluida: () => void;
};

export default function ConfirmarExclusao({
  pessoa,
  onFechar,
  onExcluida,
}: ConfirmarExclusaoProps) {
  const { mostrar } = useToast();
  const [excluindo, setExcluindo] = useState(false);

  const confirmar = async () => {
    if (!pessoa) return;

    setExcluindo(true);

    try {
      await pessoasService.excluir(pessoa.id);
      mostrar('Pessoa excluída.');
      onExcluida();
    } catch (falha) {
      mostrar(traduzirErro(falha), 'erro');
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <Modal aberto={pessoa !== null} titulo="Confirmar exclusão" onFechar={onFechar}>
      <p>Excluir {pessoa?.nome}?</p>

      {/* RF15: o impacto da cascata precisa ser conhecido antes de confirmar. */}
      {pessoa && pessoa.quantidadeTransacoes > 0 && (
        <p className="mt-2 text-negative">
          Removerá também {pessoa.quantidadeTransacoes}{' '}
          {pessoa.quantidadeTransacoes === 1 ? 'transação vinculada.' : 'transações vinculadas.'}
        </p>
      )}

      <p className="mt-2 text-hint">A ação é irreversível.</p>

      <div className="mt-6 flex gap-3">
        <Botao variante="destrutivo" carregando={excluindo} onClick={confirmar}>
          Excluir
        </Botao>
        <Botao variante="secundario" onClick={onFechar}>
          Cancelar
        </Botao>
      </div>
    </Modal>
  );
}
