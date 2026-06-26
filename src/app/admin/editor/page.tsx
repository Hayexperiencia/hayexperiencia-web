'use client';
import { useState, useEffect, useRef } from 'react';

type Brand = { slug: string; name: string; slogan: string; palette: string[]; broll: boolean };
type Track = { id: string; name: string };

const NAVY = '#110d3f';
const GOLD = '#ffcd07';

export default function EditorPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [loginErr, setLoginErr] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [music, setMusic] = useState<Track[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [brand, setBrand] = useState('aluna');
  const [zoom, setZoom] = useState(true);
  const [track, setTrack] = useState('tranquility');
  const [job, setJob] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) { setAuth(true); setLoginErr(false); } else setLoginErr(true);
  }

  useEffect(() => {
    if (!auth) return;
    fetch('/api/admin/editor/brands').then((r) => r.json()).then((d) => Array.isArray(d) && setBrands(d)).catch(() => {});
    fetch('/api/admin/editor/music').then((r) => r.json()).then((d) => Array.isArray(d) && setMusic(d)).catch(() => {});
  }, [auth]);

  useEffect(() => () => { if (poll.current) clearInterval(poll.current); }, []);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!video) { setErr('Sube un video primero.'); return; }
    setErr(''); setStatus('uploading'); setPct(0); setMsg('Subiendo video...');
    const fd = new FormData();
    fd.append('video', video);
    fd.append('brand', brand);
    fd.append('zoom', zoom ? 'true' : 'false');
    if (track) fd.append('music', track);
    let d: { job_id?: string; error?: string };
    try {
      const r = await fetch('/api/admin/editor/render', { method: 'POST', body: fd });
      d = await r.json();
      if (!r.ok || !d.job_id) { setErr(d.error || 'No se pudo iniciar el render.'); setStatus(''); return; }
    } catch { setErr('Error de red al subir.'); setStatus(''); return; }
    setJob(d.job_id); setStatus('running'); setMsg('En cola...');
    poll.current = setInterval(async () => {
      try {
        const jr = await fetch(`/api/admin/editor/jobs/${d.job_id}`).then((x) => x.json());
        setPct(jr.progress?.pct ?? 0);
        setMsg(jr.progress?.msg ?? '');
        if (jr.status === 'done') { if (poll.current) clearInterval(poll.current); setStatus('done'); }
        else if (jr.status === 'error') { if (poll.current) clearInterval(poll.current); setStatus(''); setErr(jr.error || 'Error en el render.'); }
      } catch { /* reintenta */ }
    }, 2000);
  }

  function reset() {
    if (poll.current) clearInterval(poll.current);
    setJob(null); setStatus(''); setPct(0); setMsg(''); setVideo(null); setErr('');
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <form onSubmit={login} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
          <h1 className="text-xl font-bold mb-1" style={{ color: NAVY }}>Editor de Reels</h1>
          <p className="text-sm text-gray-500 mb-5">Hay Experiencia</p>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Contraseña"
            className="w-full border rounded-lg px-3 py-2 mb-3" autoFocus />
          {loginErr && <p className="text-red-600 text-sm mb-3">Contraseña incorrecta.</p>}
          <button type="submit" className="w-full font-bold py-2 rounded-lg" style={{ background: GOLD, color: NAVY }}>Entrar</button>
        </form>
      </div>
    );
  }

  const current = brands.find((b) => b.slug === brand);

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: '#f6f6fa' }}>
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold" style={{ color: NAVY }}>
            Editor de Reels <span style={{ color: GOLD }}>·</span> Hay Experiencia
          </h1>
          <p className="text-gray-500 text-sm">Sube un video, elige marca, zoom y música. Te devolvemos un reel 9:16 listo para publicar.</p>
        </header>

        {status === 'done' && job ? (
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="font-bold text-lg mb-4" style={{ color: NAVY }}>Tu reel está listo</p>
            <video src={`/api/admin/editor/jobs/${job}/download`} controls playsInline
              className="w-full max-w-xs mx-auto rounded-xl bg-black" style={{ aspectRatio: '9/16' }} />
            <div className="flex gap-3 mt-5">
              <a href={`/api/admin/editor/jobs/${job}/download`} download
                className="flex-1 text-center font-bold py-3 rounded-lg" style={{ background: GOLD, color: NAVY }}>Descargar</a>
              <button onClick={reset} className="flex-1 font-bold py-3 rounded-lg border" style={{ borderColor: NAVY, color: NAVY }}>Generar otro</button>
            </div>
          </div>
        ) : status === 'running' || status === 'uploading' ? (
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <p className="font-bold text-lg mb-2" style={{ color: NAVY }}>Generando tu reel…</p>
            <p className="text-gray-500 text-sm mb-5">{msg || 'Procesando...'}</p>
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${Math.max(5, pct)}%`, background: GOLD }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{pct > 0 ? `${pct}%` : ''} · esto puede tardar unos minutos</p>
          </div>
        ) : (
          <form onSubmit={generate} className="bg-white rounded-2xl p-6 shadow space-y-5">
            <div>
              <label className="block font-semibold mb-2" style={{ color: NAVY }}>1 · Video</label>
              <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)}
                className="block w-full text-sm border rounded-lg p-2" />
              {video && <p className="text-xs text-gray-500 mt-1">{video.name} · {(video.size / 1048576).toFixed(0)} MB</p>}
            </div>

            <div>
              <label className="block font-semibold mb-2" style={{ color: NAVY }}>2 · Marca</label>
              <div className="grid grid-cols-3 gap-2">
                {brands.map((b) => (
                  <button type="button" key={b.slug} onClick={() => setBrand(b.slug)}
                    className="text-sm py-2 px-2 rounded-lg border font-semibold"
                    style={brand === b.slug ? { background: NAVY, color: '#fff', borderColor: NAVY } : { color: NAVY, borderColor: '#e5e5e0' }}>
                    {b.name}
                  </button>
                ))}
              </div>
              {current && (
                <div className="flex items-center gap-2 mt-2">
                  {current.palette.slice(0, 5).map((c) => <span key={c} className="w-4 h-4 rounded-full border" style={{ background: c }} />)}
                  <span className="text-xs text-gray-400">{current.broll ? 'con b-roll de dron' : 'sin b-roll'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold" style={{ color: NAVY }}>3 · Zoom dinámico</label>
              <button type="button" onClick={() => setZoom(!zoom)}
                className="w-14 h-7 rounded-full transition-colors relative"
                style={{ background: zoom ? GOLD : '#d1d5db' }}>
                <span className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all" style={{ left: zoom ? '30px' : '2px' }} />
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-2" style={{ color: NAVY }}>4 · Música</label>
              <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="">Sin música</option>
                {music.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {err && <p className="text-red-600 text-sm">{err}</p>}
            <button type="submit" className="w-full font-bold py-3 rounded-lg text-lg" style={{ background: GOLD, color: NAVY }}>
              Generar reel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
