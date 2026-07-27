import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import Select from '@/components/Select';
import { CATEGORIAS, rotuloCategoria } from '@/lib/format';
import type { Pessoa } from '@/types/pessoa';

export type ValoresDeFiltro = {
  pessoaId: string;
  tipo: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
};

type FiltrosTransacaoProps = {
  valores: ValoresDeFiltro;
  pessoas: Pessoa[];
  onAlterar: (campo: keyof ValoresDeFiltro, valor: string) => void;
  onLimpar: () => void;
};

export default function FiltrosTransacao({
  valores,
  pessoas,
  onAlterar,
  onLimpar,
}: FiltrosTransacaoProps) {
  return (
    <div className="mt-8 flex flex-wrap items-end gap-6 border-b border-divider pb-6">
      <Select
        label="Pessoa"
        className="w-44"
        value={valores.pessoaId}
        onChange={(evento) => onAlterar('pessoaId', evento.target.value)}
      >
        <option value="">Todas</option>
        {pessoas.map((pessoa) => (
          <option key={pessoa.id} value={pessoa.id}>
            {pessoa.nome}
          </option>
        ))}
      </Select>

      <Select
        label="Tipo"
        className="w-36"
        value={valores.tipo}
        onChange={(evento) => onAlterar('tipo', evento.target.value)}
      >
        <option value="">Todos</option>
        <option value="Receita">Receita</option>
        <option value="Despesa">Despesa</option>
      </Select>

      <Select
        label="Categoria"
        className="w-44"
        value={valores.categoria}
        onChange={(evento) => onAlterar('categoria', evento.target.value)}
      >
        <option value="">Todas</option>
        {CATEGORIAS.map((categoria) => (
          <option key={categoria} value={categoria}>
            {rotuloCategoria[categoria]}
          </option>
        ))}
      </Select>

      <Campo
        label="De"
        mono
        type="date"
        className="w-40"
        value={valores.dataInicio}
        onChange={(evento) => onAlterar('dataInicio', evento.target.value)}
      />
      <Campo
        label="Até"
        mono
        type="date"
        className="w-40"
        value={valores.dataFim}
        onChange={(evento) => onAlterar('dataFim', evento.target.value)}
      />

      <Botao variante="secundario" onClick={onLimpar}>
        Limpar filtros
      </Botao>
    </div>
  );
}
