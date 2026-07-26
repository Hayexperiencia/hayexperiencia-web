import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Proxy al servicio hei-usage del host (systemd, puerto 3012), que agrega el
 * consumo de las 3 cuentas de IA: Claude Max (ventanas 5h/semana), Codex /
 * ChatGPT Plus (ventana semanal) y OpenRouter (saldo + gasto por key), más el
 * consumo de tokens de Claude Code leído de los logs locales.
 *
 * El token nunca llega al browser: la llamada sale del server component.
 */
export async function GET() {
  const base = process.env.USAGE_SERVICE_URL || 'http://host.docker.internal:3012'
  const token = process.env.USAGE_SERVICE_TOKEN || ''

  try {
    const res = await fetch(`${base}/api/usage`, {
      headers: token ? { 'x-usage-key': token } : {},
      cache: 'no-store',
      signal: AbortSignal.timeout(45_000),
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: `El servicio de consumo respondió ${res.status}` },
        { status: 502 },
      )
    }
    return NextResponse.json(await res.json(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: `No se pudo consultar el servicio de consumo: ${reason}` },
      { status: 502 },
    )
  }
}
