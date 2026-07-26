type CarregandoProps = { rotulo?: string };

export default function Carregando({ rotulo = 'Carregando' }: CarregandoProps) {
  return (
    <p role="status" className="py-8 text-center text-[10px] tracking-[0.2em] text-hint uppercase">
      {rotulo}
    </p>
  );
}
