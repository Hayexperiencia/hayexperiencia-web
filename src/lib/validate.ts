/**
 * Validacion ligera para las APIs publicas del cotizador.
 * Sin dependencias: el proyecto se mantiene minimalista a proposito.
 */
import type { PlanOverrides } from '@/lib/quotation-engine'

export function asPositiveInt(v: unknown): number | null {
  const n = Number(v)
  if (!Number.isInteger(n) || n <= 0 || n > 2_147_483_647) return null
  return n
}

/** Trim + colapsa espacios + corta a maxLen. Devuelve null si queda vacio. */
export function cleanStr(v: unknown, maxLen: number): string | null {
  if (typeof v !== 'string') return null
  const s = v.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLen)
  return s.length > 0 ? s : null
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 200
}

/**
 * Normaliza telefonos colombianos a formato +57XXXXXXXXXX.
 * Acepta: "3001234567", "573001234567", "+57 300 123 4567", "300-123-4567".
 * Devuelve null si no parece un celular/fijo valido de Colombia.
 */
export function normalizePhoneCO(v: string): string | null {
  const digits = v.replace(/\D/g, '')
  if (digits.length === 10) return `+57${digits}`
  if (digits.length === 12 && digits.startsWith('57')) return `+${digits}`
  return null
}

const OVERRIDE_KEYS = ['ci_percentage', 'ci_installments', 'loan_term_years', 'reference_rate_ea'] as const

/** Extrae overrides numericos del body. El motor los acota; aqui solo se tipan. */
export function parseOverrides(raw: unknown): PlanOverrides | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const out: PlanOverrides = {}
  for (const key of OVERRIDE_KEYS) {
    const val = (raw as Record<string, unknown>)[key]
    if (val === undefined || val === null || val === '') continue
    const n = Number(val)
    if (Number.isFinite(n)) out[key] = n
  }
  return Object.keys(out).length > 0 ? out : undefined
}

export interface CleanClientData {
  name: string
  phone: string | null
  email: string | null
  city: string | null
}

/**
 * Valida client_data. Devuelve {error} legible si algo obligatorio falta o
 * es invalido. `requirePhone` aplica al flujo web (gate); Harry puede mandar
 * solo email si el cliente no dio numero.
 */
export function parseClientData(
  raw: unknown,
  opts: { requirePhone?: boolean } = {}
): { data: CleanClientData } | { error: string } {
  if (!raw || typeof raw !== 'object') return { error: 'client_data es requerido' }
  const r = raw as Record<string, unknown>

  const name = cleanStr(r.name, 200)
  if (!name || name.length < 3) return { error: 'client_data.name es requerido (minimo 3 caracteres)' }

  let phone: string | null = null
  const rawPhone = cleanStr(r.phone, 30)
  if (rawPhone) {
    phone = normalizePhoneCO(rawPhone)
    if (!phone) return { error: 'Telefono invalido: usa un celular colombiano de 10 digitos' }
  }
  if (opts.requirePhone && !phone) return { error: 'Telefono es requerido' }

  let email: string | null = null
  const rawEmail = cleanStr(r.email, 200)
  if (rawEmail) {
    if (!isValidEmail(rawEmail)) return { error: 'Email invalido' }
    email = rawEmail.toLowerCase()
  }

  if (!phone && !email) return { error: 'Se requiere telefono o email' }

  return { data: { name, phone, email, city: cleanStr(r.city, 100) } }
}

export const VALID_CHANNELS = ['web', 'harry', 'embed'] as const

export function parseChannel(v: unknown, fallback: string): string {
  const s = typeof v === 'string' ? v : ''
  return (VALID_CHANNELS as readonly string[]).includes(s) ? s : fallback
}
