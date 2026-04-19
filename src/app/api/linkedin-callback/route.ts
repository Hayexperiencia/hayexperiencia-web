import { NextRequest, NextResponse } from 'next/server';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function page(body: string): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LinkedIn OAuth — Hay Experiencia</title>
<style>
  body { font-family: ui-sans-serif, system-ui, sans-serif; max-width: 640px; margin: 48px auto; padding: 0 16px; color: #111; }
  h1 { margin: 0 0 16px 0; font-size: 22px; }
  code { background: #f3f4f6; padding: 12px; border-radius: 8px; display: block; word-break: break-all; font-size: 14px; }
  .ok { color: #065f46; }
  .err { color: #991b1b; }
  .hint { color: #6b7280; font-size: 14px; margin-top: 24px; }
  button { margin-top: 12px; padding: 10px 16px; font-size: 14px; border-radius: 8px; border: 1px solid #111; background: #111; color: white; cursor: pointer; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');
  const errorDescription = request.nextUrl.searchParams.get('error_description');

  if (error) {
    const html = page(`
      <h1 class="err">Autorizacion LinkedIn fallo</h1>
      <p><strong>Error:</strong> ${escapeHtml(error)}</p>
      ${errorDescription ? `<p>${escapeHtml(errorDescription)}</p>` : ''}
      <p class="hint">Vuelve a correr <code>python3 linkedin_helper.py auth</code> y reintenta.</p>
    `);
    return new NextResponse(html, {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (!code || !state) {
    const html = page(`
      <h1 class="err">Parametros incompletos</h1>
      <p>Esta URL solo funciona como callback del flujo OAuth de LinkedIn.</p>
    `);
    return new NextResponse(html, {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const html = page(`
    <h1 class="ok">Autorizacion recibida</h1>
    <p>Copia este codigo y pegalo en la terminal donde corre <code>linkedin_helper.py auth</code>:</p>
    <code id="code">${escapeHtml(code)}</code>
    <button onclick="navigator.clipboard.writeText(document.getElementById('code').textContent); this.textContent='Copiado';">Copiar</button>
    <p class="hint">State: <code>${escapeHtml(state)}</code></p>
    <p class="hint">El codigo expira en 30 segundos. Si tardas, reinicia el flujo.</p>
  `);

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
