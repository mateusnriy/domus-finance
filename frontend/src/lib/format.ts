export const formatarBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatarData = (iso: string) => {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

export const CATEGORIAS = [
  'Moradia',
  'Alimentacao',
  'Transporte',
  'Saude',
  'Educacao',
  'Lazer',
  'Contas',
  'Outros',
] as const;

export const rotuloCategoria: Record<string, string> = {
  Moradia: 'Moradia',
  Alimentacao: 'Alimentação',
  Transporte: 'Transporte',
  Saude: 'Saúde',
  Educacao: 'Educação',
  Lazer: 'Lazer',
  Contas: 'Contas',
  Outros: 'Outros',
};
