type BotaoEditarProps = {
  rotulo: string;
  onClick: () => void;
};

// Par do BotaoExcluir: sempre visível, alcançável por teclado e por toque.
export default function BotaoEditar({ rotulo, onClick }: BotaoEditarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className="px-2 text-divider transition-colors hover:text-ink focus-visible:text-ink"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.2 2.3l2.5 2.5L5.4 13 2.5 13.5l0.5-2.9 8.2-8.3z" />
        <path d="M10 3.5l2.5 2.5" />
      </svg>
    </button>
  );
}
