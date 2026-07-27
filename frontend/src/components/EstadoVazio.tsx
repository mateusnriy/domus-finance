type EstadoVazioProps = {
  mensagem: string;
  apoio?: string;
};

export default function EstadoVazio({ mensagem, apoio }: EstadoVazioProps) {
  return (
    <div className="border border-dashed border-divider py-16 text-center">
      <p className="text-[10px] tracking-[0.2em] text-hint uppercase">{mensagem}</p>
      {apoio && <p className="mt-2 text-sm text-hint">{apoio}</p>}
    </div>
  );
}
