import { NextRequest } from 'next/server';

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://127.0.0.1:3001';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  const modo = searchParams.get('modo') || 'con-marca';

  if (!id) {
    return Response.json({ error: 'id required' }, { status: 400 });
  }

  try {
    const res = await fetch(`${PDF_SERVICE_URL}/pdf?id=${id}&modo=${modo}`, {
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'PDF service error' }));
      return Response.json(err, { status: res.status });
    }

    const pdf = await res.arrayBuffer();
    const prefix = modo === 'sin-marca' ? 'propiedad' : 'HE';

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${prefix}-${id}-ficha.pdf"`,
      },
    });
  } catch (err) {
    return Response.json(
      { error: 'Error generando PDF' },
      { status: 500 }
    );
  }
}
