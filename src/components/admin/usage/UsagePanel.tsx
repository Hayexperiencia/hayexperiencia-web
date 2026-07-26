'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'

// ---------------------------------------------------------------- tipos

type Window = { label: string; pct: number; resets_at: string | null }

type Snapshot = {
  generated_at: string
  age_seconds?: number
  stale?: boolean
  claude_max: {
    ok: boolean
    plan: string | null
    windows: Window[]
    error?: string | null
    extra_usage?: { enabled: boolean; used_usd: number; limit_usd: number }
  }
  codex: {
    ok: boolean
    plan: string | null
    account: string | null
    windows: Window[]
    error?: string | null
  }
  openrouter: {
    ok: boolean
    account: { total_usd: number; used_usd: number; remaining_usd: number; pct: number | null } | null
    keys: Array<{
      label: string
      limit_usd?: number | null
      remaining_usd?: number | null
      usage_daily?: number
      usage_weekly?: number
      usage_monthly?: number
      error?: string
    }>
    error?: string | null
  }
  claude_tokens: {
    ok: boolean
    days: Array<{ day: string; tokens: number; cost: number; models: Record<string, { tokens: number; cost: number; msgs: number }> }>
    today: { day: string; tokens: number; cost: number; models: Record<string, { tokens: number; cost: number; msgs: number }> }
    total_tokens: number
    total_cost: number
    window_days: number
  }
}

// ------------------------------------------------------------- utilidades

/** Estado por umbral. Tres niveles: el par warning/serious no se distingue bien. */
function severity(pct: number): 'good' | 'warning' | 'critical' {
  if (pct >= 85) return 'critical'
  if (pct >= 60) return 'warning'
  return 'good'
}

const SEVERITY_LABEL = { good: 'Holgado', warning: 'Ojo', critical: 'Al tope' } as const

function compact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function usd(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return `$${n.toFixed(2)}`
}

/** "en 3h 20m" — cuánto falta para que la ventana se reinicie. */
function untilReset(iso: string | null): string | null {
  if (!iso) return null
  const ms = new Date(iso).getTime() - Date.now()
  if (Number.isNaN(ms)) return null
  if (ms <= 0) return 'reiniciando'
  const mins = Math.round(ms / 60_000)
  if (mins < 60) return `en ${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h < 24) return m ? `en ${h}h ${m}m` : `en ${h}h`
  const d = Math.floor(h / 24)
  return `en ${d}d ${h % 24}h`
}

function resetClock(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// ------------------------------------------------------------ componentes

/** Barra de cuota. El relleno lleva la severidad; el track es un paso claro del mismo ramp. */
function Meter({ label, pct, hint, big = false }: { label: string; pct: number; hint?: string | null; big?: boolean }) {
  const sev = severity(pct)
  const width = Math.max(0, Math.min(100, pct))
  return (
    <div className="usage-meter">
      <div className="usage-meter-head">
        <span className="usage-meter-label">{label}</span>
        <span className={`usage-meter-value sev-${sev}`}>{pct.toFixed(0)}%</span>
      </div>
      <div className={`usage-track${big ? ' usage-track-big' : ''}`}>
        <div className={`usage-fill sev-${sev}`} style={{ width: `${width}%` }} />
      </div>
      {hint ? <div className="usage-meter-hint">{hint}</div> : null}
    </div>
  )
}

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="usage-tile">
      <div className="usage-tile-label">{label}</div>
      <div className="usage-tile-value">{value}</div>
      {sub ? <div className="usage-tile-sub">{sub}</div> : null}
    </div>
  )
}

/** Columnas de tokens por día. Una sola serie → sin leyenda; label directo solo en hoy. */
function TokensChart({ days }: { days: Snapshot['claude_tokens']['days'] }) {
  const [hover, setHover] = useState<number | null>(null)
  if (!days.length) return <p className="usage-empty">Sin datos de tokens todavía.</p>

  const max = Math.max(...days.map(d => d.tokens), 1)
  const last = days.length - 1
  const active = hover ?? last
  const shown = days[active]

  return (
    <div>
      <div className="usage-chart-readout">
        <span className="usage-chart-readout-value">{compact(shown.tokens)} tokens</span>
        <span className="usage-chart-readout-meta">
          {new Date(`${shown.day}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
          {' · '}~{usd(shown.cost)} equivalente
        </span>
      </div>
      <div className="usage-chart" onMouseLeave={() => setHover(null)}>
        {days.map((d, i) => (
          <button
            key={d.day}
            type="button"
            className={`usage-col${i === active ? ' is-active' : ''}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onClick={() => setHover(i)}
            aria-label={`${d.day}: ${d.tokens.toLocaleString('es-CO')} tokens`}
          >
            <span className="usage-col-bar" style={{ height: `${Math.max(2, (d.tokens / max) * 100)}%` }} />
          </button>
        ))}
      </div>
      <div className="usage-chart-axis">
        <span>{new Date(`${days[0].day}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
        <span>hoy</span>
      </div>
    </div>
  )
}

function Card({ title, meta, children }: { title: string; meta?: string | null; children: ReactNode }) {
  return (
    <section className="usage-card">
      <header className="usage-card-head">
        <h2 className="usage-card-title">{title}</h2>
        {meta ? <span className="usage-card-meta">{meta}</span> : null}
      </header>
      {children}
    </section>
  )
}

function ErrorNote({ children }: { children: ReactNode }) {
  return <p className="usage-error">⚠ {children}</p>
}

// ------------------------------------------------------------------ panel

export default function UsagePanel() {
  const [data, setData] = useState<Snapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTable, setShowTable] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/usage', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
      setData(json)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [load])

  if (loading && !data) return <div className="usage-root"><p className="usage-empty">Cargando consumo…</p></div>
  if (error && !data) return <div className="usage-root"><ErrorNote>{error}</ErrorNote></div>
  if (!data) return null

  const claude = data.claude_max
  const codex = data.codex
  const or = data.openrouter
  const tokens = data.claude_tokens

  const session = claude.windows.find(w => w.label.startsWith('Sesion')) ?? claude.windows[0]
  const others = claude.windows.filter(w => w !== session)
  const orPct = or.account?.pct ?? null
  const todayModels = Object.entries(tokens.today?.models ?? {}).sort((a, b) => b[1].tokens - a[1].tokens)

  const updated = new Date(data.generated_at).toLocaleTimeString('es-CO', {
    timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false,
  })

  return (
    <div className="usage-root">
      <div className="usage-head">
        <div>
          <h1 className="usage-h1">Consumo de IA</h1>
          <p className="usage-sub">
            Actualizado {updated}
            {data.stale ? ' · datos viejos' : ''}
          </p>
        </div>
        <button type="button" className="usage-refresh" onClick={load}>Actualizar</button>
      </div>

      {error ? <ErrorNote>{error} (mostrando el último dato bueno)</ErrorNote> : null}

      {/* Hero: la ventana que primero te frena en el día a día. */}
      {session ? (
        <section className="usage-hero">
          <div className="usage-hero-label">Claude · {session.label}</div>
          <div className={`usage-hero-value sev-${severity(session.pct)}`}>{session.pct.toFixed(0)}%</div>
          <div className="usage-hero-meta">
            {SEVERITY_LABEL[severity(session.pct)]}
            {session.resets_at ? ` · reinicia ${untilReset(session.resets_at)} (${resetClock(session.resets_at)})` : ''}
          </div>
          <div className="usage-track usage-track-big usage-hero-track">
            <div className={`usage-fill sev-${severity(session.pct)}`} style={{ width: `${Math.min(100, session.pct)}%` }} />
          </div>
        </section>
      ) : null}

      <Card title="Claude Max" meta={claude.plan ? `plan ${claude.plan}` : null}>
        {claude.error ? <ErrorNote>{claude.error}</ErrorNote> : null}
        {others.map(w => (
          <Meter
            key={w.label}
            label={w.label}
            pct={w.pct}
            hint={w.resets_at ? `reinicia ${untilReset(w.resets_at)} · ${resetClock(w.resets_at)}` : null}
          />
        ))}
        {!claude.windows.length && !claude.error ? <p className="usage-empty">Sin ventanas reportadas.</p> : null}
        {claude.extra_usage?.enabled ? (
          <p className="usage-note">
            Créditos extra activos: {usd(claude.extra_usage.used_usd)} de {usd(claude.extra_usage.limit_usd)}.
          </p>
        ) : null}
      </Card>

      <Card title="Codex · ChatGPT" meta={codex.plan ? `plan ${codex.plan}` : null}>
        {codex.error ? <ErrorNote>{codex.error}</ErrorNote> : null}
        {codex.windows.map(w => (
          <Meter
            key={w.label}
            label={w.label}
            pct={w.pct}
            hint={w.resets_at ? `reinicia ${untilReset(w.resets_at)} · ${resetClock(w.resets_at)}` : null}
          />
        ))}
        {codex.account ? <p className="usage-note">Cuenta {codex.account}</p> : null}
      </Card>

      <Card title="OpenRouter" meta={or.account ? `saldo de cuenta` : null}>
        {or.error ? <ErrorNote>{or.error}</ErrorNote> : null}
        {or.account ? (
          <>
            <div className="usage-tiles">
              <StatTile label="Saldo disponible" value={usd(or.account.remaining_usd)} sub={`de ${usd(or.account.total_usd)} cargados`} />
              <StatTile label="Consumido" value={usd(or.account.used_usd)} sub={orPct !== null ? `${orPct.toFixed(0)}% del total` : undefined} />
            </div>
            {orPct !== null ? <Meter label="Créditos consumidos" pct={orPct} hint="Al 100% Harry deja de responder" /> : null}
          </>
        ) : null}
        {or.keys.filter(k => !k.error).length ? (
          <div className="usage-keys">
            {or.keys.filter(k => !k.error).map(k => (
              <div key={k.label} className="usage-key-row">
                <span className="usage-key-name">{k.label}</span>
                <span className="usage-key-nums">
                  hoy {usd(k.usage_daily ?? 0)} · semana {usd(k.usage_weekly ?? 0)} · mes {usd(k.usage_monthly ?? 0)}
                  {k.limit_usd ? ` (tope ${usd(k.limit_usd)}/mes)` : ''}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <Card title="Tokens de Claude Code" meta={`últimos ${tokens.window_days} días`}>
        <div className="usage-tiles">
          <StatTile label="Hoy" value={compact(tokens.today?.tokens ?? 0)} sub={`~${usd(tokens.today?.cost ?? 0)} si fuera API`} />
          <StatTile label={`${tokens.window_days} días`} value={compact(tokens.total_tokens)} sub={`~${usd(tokens.total_cost)} si fuera API`} />
        </div>
        <TokensChart days={tokens.days} />
        <p className="usage-note">
          Con plan Max no se factura: el valor en dólares es lo que costaría por API.
        </p>
        <button type="button" className="usage-toggle" onClick={() => setShowTable(v => !v)}>
          {showTable ? 'Ocultar' : 'Ver'} desglose por modelo (hoy)
        </button>
        {showTable ? (
          <table className="usage-table">
            <thead>
              <tr><th>Modelo</th><th>Tokens</th><th>Mensajes</th><th>Equivalente</th></tr>
            </thead>
            <tbody>
              {todayModels.length ? todayModels.map(([model, m]) => (
                <tr key={model}>
                  <td>{model}</td>
                  <td>{m.tokens.toLocaleString('es-CO')}</td>
                  <td>{m.msgs.toLocaleString('es-CO')}</td>
                  <td>{usd(m.cost)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4}>Sin actividad hoy.</td></tr>
              )}
            </tbody>
          </table>
        ) : null}
      </Card>

      <style dangerouslySetInnerHTML={{ __html: `
        .usage-root {
          --surface: #fcfcfb;
          --plane: #f9f9f7;
          --ink: #0b0b0b;
          --ink-2: #52514e;
          --muted: #898781;
          --border: rgba(11, 11, 11, 0.1);
          --track: #e8e7e2;
          --series: #2a78d6;
          --good: #0ca30c;
          --warning: #fab219;
          --critical: #d03b3b;
          color-scheme: light;
          background: var(--plane);
          color: var(--ink);
          font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
          padding: 1rem;
          max-width: 46rem;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        @media (prefers-color-scheme: dark) {
          .usage-root {
            --surface: #1a1a19;
            --plane: #0d0d0d;
            --ink: #ffffff;
            --ink-2: #c3c2b7;
            --muted: #898781;
            --border: rgba(255, 255, 255, 0.1);
            --track: #2c2c2a;
            --series: #3987e5;
            color-scheme: dark;
          }
        }
        .usage-h1 { font-size: 1.125rem; font-weight: 600; margin: 0; }
        .usage-sub { font-size: 0.75rem; color: var(--muted); margin: 0.15rem 0 0; }
        .usage-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .usage-refresh {
          font-size: 0.75rem; color: var(--ink-2); background: var(--surface);
          border: 1px solid var(--border); border-radius: 999px; padding: 0.35rem 0.75rem; cursor: pointer;
        }

        /* Hero: exactamente uno por vista. */
        .usage-hero {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 1.1rem 1rem 1.25rem;
        }
        .usage-hero-label { font-size: 0.8125rem; color: var(--ink-2); }
        .usage-hero-value { font-size: 3rem; line-height: 1.05; font-weight: 600; margin: 0.15rem 0 0.2rem; }
        .usage-hero-meta { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.75rem; }
        .usage-hero-track { margin-top: 0.25rem; }

        .usage-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 0.9rem 1rem 1rem;
        }
        .usage-card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.75rem; }
        .usage-card-title { font-size: 0.9375rem; font-weight: 600; margin: 0; }
        .usage-card-meta { font-size: 0.75rem; color: var(--muted); }

        .usage-meter + .usage-meter { margin-top: 0.85rem; }
        .usage-meter-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }
        .usage-meter-label { font-size: 0.8125rem; color: var(--ink-2); }
        .usage-meter-value { font-size: 0.9375rem; font-weight: 600; color: var(--ink); }
        .usage-meter-hint { font-size: 0.6875rem; color: var(--muted); margin-top: 0.3rem; }
        .usage-track {
          height: 8px; border-radius: 999px; background: var(--track);
          overflow: hidden; margin-top: 0.35rem;
        }
        .usage-track-big { height: 12px; }
        .usage-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
        .usage-fill.sev-good { background: var(--good); }
        .usage-fill.sev-warning { background: var(--warning); }
        .usage-fill.sev-critical { background: var(--critical); }
        .usage-hero-value.sev-good { color: var(--good); }
        .usage-hero-value.sev-warning { color: var(--ink); }
        .usage-hero-value.sev-critical { color: var(--critical); }

        .usage-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.9rem; }
        .usage-tile { background: var(--plane); border-radius: 10px; padding: 0.65rem 0.7rem; }
        .usage-tile-label { font-size: 0.6875rem; color: var(--muted); }
        .usage-tile-value { font-size: 1.375rem; font-weight: 600; margin-top: 0.1rem; }
        .usage-tile-sub { font-size: 0.6875rem; color: var(--muted); margin-top: 0.1rem; }

        .usage-chart-readout { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
        .usage-chart-readout-value { font-size: 0.9375rem; font-weight: 600; }
        .usage-chart-readout-meta { font-size: 0.6875rem; color: var(--muted); }
        .usage-chart { display: flex; align-items: flex-end; gap: 2px; height: 90px; }
        .usage-col {
          flex: 1; height: 100%; display: flex; align-items: flex-end;
          background: none; border: 0; padding: 0; cursor: pointer;
        }
        .usage-col-bar {
          width: 100%; max-width: 24px; margin: 0 auto; display: block;
          background: var(--series); border-radius: 4px 4px 0 0; opacity: 0.45;
          transition: opacity 0.15s ease;
        }
        .usage-col:hover .usage-col-bar, .usage-col.is-active .usage-col-bar { opacity: 1; }
        .usage-chart-axis { display: flex; justify-content: space-between; font-size: 0.6875rem; color: var(--muted); margin-top: 0.3rem; }

        .usage-keys { margin-top: 0.9rem; display: flex; flex-direction: column; gap: 0.4rem; }
        .usage-key-row { display: flex; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; font-size: 0.75rem; }
        .usage-key-name { color: var(--ink-2); font-weight: 500; }
        .usage-key-nums { color: var(--muted); }

        .usage-note { font-size: 0.6875rem; color: var(--muted); margin: 0.75rem 0 0; }
        .usage-empty { font-size: 0.8125rem; color: var(--muted); }
        .usage-error {
          font-size: 0.75rem; color: var(--critical); background: var(--surface);
          border: 1px solid var(--border); border-radius: 10px; padding: 0.6rem 0.75rem; margin: 0;
        }
        .usage-toggle {
          margin-top: 0.75rem; font-size: 0.75rem; color: var(--ink-2);
          background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline;
        }
        .usage-table { width: 100%; border-collapse: collapse; margin-top: 0.6rem; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
        .usage-table th, .usage-table td { text-align: right; padding: 0.35rem 0.25rem; border-bottom: 1px solid var(--border); }
        .usage-table th:first-child, .usage-table td:first-child { text-align: left; }
        .usage-table th { color: var(--muted); font-weight: 500; }
      ` }} />
    </div>
  )
}
