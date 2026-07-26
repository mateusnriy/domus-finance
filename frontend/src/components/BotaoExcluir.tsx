type BotaoExcluirProps = {
  rotulo: string;
  onClick: () => void;
};

// Sempre visível, nunca só no hover: a exclusão precisa ser alcançável por
// teclado e por toque (06-design-brief §9).
export default function BotaoExcluir({ rotulo, onClick }: BotaoExcluirProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className="px-2 text-lg leading-none text-divider transition-colors hover:text-negative focus-visible:text-negative"
    >
      ×
    </button>
  );
}
