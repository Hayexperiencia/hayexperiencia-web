import type { Metadata } from 'next';
import CotizadorApp from '@/components/cotizador/CotizadorApp';

export const metadata: Metadata = {
  title: 'Cotizador | Hay Experiencia',
  description: 'Cotiza tu lote, apartamento o villa en los proyectos de Hay Experiencia. Plan de pagos personalizado al instante.',
};

export default async function CotizadorPage(props: { searchParams: Promise<{ proyecto?: string }> }) {
  const searchParams = await props.searchParams;
  const slug = searchParams.proyecto;

  return (
    <main className="flex-1 bg-white">
      <CotizadorApp initialSlug={slug} />
    </main>
  );
}
