type BotaoExcluirProps = {
  rotulo: string;
  onClick: () => void;
};

// Sempre visível, nunca só no hover: a exclusão precisa ser alcançável por
// teclado e por toque (06-design-brief §9). O glifo usa hint, e não divider
// como no design de referência: divider dá 1.48:1 sobre o papel, longe do
// mínimo de 3:1 para controle de interface (RNF13).
export default function BotaoExcluir({ rotulo, onClick }: BotaoExcluirProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className="inline-flex h-10 w-10 items-center justify-center text-lg leading-none text-hint transition-colors hover:text-negative focus-visible:text-negative"
    >
      ×
    </button>
  );
}
