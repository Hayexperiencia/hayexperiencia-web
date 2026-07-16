'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import AdminGate from '@/components/admin/AdminGate';

type Project = { id: string; name: string; status: string; duration?: number; cuts?: number; created?: number };
type Cut = { id: number; start: number; end: number; type: string; text: string; confidence: string; reason: string };
type Detail = { id: string; name?: string; status: string; duration?: number; cuts?: Cut[]; clean_text?: string; error?: string; progress?: { pct?: number; msg?: string } };

const NAVY = '#110d3f';
const GOLD = '#ffcd07';
const TYPE_LABEL: Record<string, string> = { muletilla: 'Muletilla', repeticion: 'Repetición', silencio: 'Silencio' };

export default function EditorPage() {
  const [view, setView] = useState<'gallery' | 'new' | 'project'>('gallery');
  const [projects, setProjects] = useState<Project[]>([]);
  const [driveUrl, setDriveUrl] = useState('');
  const [cur, setCur] = useState<Detail | null>(null);
  const [approved, setApproved] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadGallery = useCallback(() => {
    fetch('/api/admin/editor/projects').then((r) => r.json()).then((d) => Array.isArray(d) && setProjects(d)).catch(() => {});
  }, []);

  useEffect(() => { loadGallery(); }, [loadGallery]);
  useEffect(() => () => { if (poll.current) clearInterval(poll.current); }, []);

  function stopPoll() { if (poll.current) { clearInterval(poll.current); poll.current = null; } }

  function openProject(id: string) {
    setView('project'); setErr(''); setCur({ id, status: 'loading' });
    const tick = async () => {
      try {
        const d: Detail = await fetch(`/api/admin/editor/projects/${id}`).then((r) => r.json());
        setCur(d);
        if (d.status === 'analyzed' && d.cuts) setApproved(new Set(d.cuts.map((c) => c.id)));
        if (['analyzed', 'clean', 'error'].includes(d.status)) stopPoll();
      } catch { /* reintenta */ }
    };
    stopPoll(); tick(); poll.current = setInterval(tick, 2500);
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (!driveUrl.trim()) { setErr('Pega el link de Google Drive.'); return; }
    setBusy('Iniciando...');
    try {
      const d = await fetch('/api/admin/editor/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drive_url: driveUrl }) }).then((r) => r.json());
      setBusy(''); setDriveUrl('');
      if (d.project_id) openProject(d.project_id); else setErr(d.error || 'No se pudo crear el proyecto.');
    } catch { setBusy(''); setErr('Error de red.'); }
  }

  function toggleCut(id: number) {
    setApproved((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function generateClean() {
    if (!cur) return;
    setErr(''); setBusy('clean');
    const ids = cur.cuts ? cur.cuts.filter((c) => approved.has(c.id)).map((c) => c.id).join(',') : '';
    try {
      await fetch(`/api/admin/editor/projects/${cur.id}/clean`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cut_ids: ids }) });
      const tick = async () => {
        const d: Detail = await fetch(`/api/admin/editor/projects/${cur.id}`).then((r) => r.json());
        setCur(d);
        if (d.status === 'clean') { stopPoll(); setBusy(''); }
        else if (d.status === 'error') { stopPoll(); setBusy(''); setErr(d.error || 'Error al generar.'); }
      };
      stopPoll(); poll.current = setInterval(tick, 2500);
    } catch { setBusy(''); setErr('Error de red.'); }
  }

  return (
    <AdminGate title="Admin Editor">
    <div className="min-h-screen py-8 px-4" style={{ background: '#f6f6fa' }}>
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold cursor-pointer" style={{ color: NAVY }} onClick={() => { stopPoll(); setView('gallery'); loadGallery(); }}>
            Editor de Reels <span style={{ color: GOLD }}>·</span> HE
          </h1>
          {view === 'gallery' && <button onClick={() => { setView('new'); setErr(''); }} className="font-bold px-4 py-2 rounded-lg text-sm" style={{ background: GOLD, color: NAVY }}>+ Nuevo</button>}
          {view !== 'gallery' && <button onClick={() => { stopPoll(); setView('gallery'); loadGallery(); }} className="text-sm font-semibold" style={{ color: NAVY }}>← Proyectos</button>}
        </header>

        {/* GALERIA */}
        {view === 'gallery' && (
          <div className="space-y-2">
            {projects.length === 0 && <p className="text-gray-500 text-sm bg-white rounded-xl p-6 text-center">Aún no hay proyectos. Crea uno con + Nuevo: solo pega el link de Drive de tu video.</p>}
            {projects.map((p) => (
              <button key={p.id} onClick={() => openProject(p.id)} className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between text-left hover:shadow">
                <div>
                  <p className="font-semibold" style={{ color: NAVY }}>{p.name}</p>
                  <p className="text-xs text-gray-400">{p.duration ? `${Math.round(p.duration)}s · ` : ''}{p.cuts ?? 0} cortes</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={p.status === 'clean' ? { background: '#dcfce7', color: '#166534' } : p.status === 'error' ? { background: '#fee2e2', color: '#991b1b' } : { background: '#fef9c3', color: '#854d0e' }}>{p.status}</span>
              </button>
            ))}
          </div>
        )}

        {/* NUEVO */}
        {view === 'new' && (
          <form onSubmit={createProject} className="bg-white rounded-2xl p-6 shadow space-y-4">
            <div>
              <label className="block font-semibold mb-2" style={{ color: NAVY }}>Link del video en Google Drive</label>
              <input value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." className="w-full border rounded-lg px-3 py-2" autoFocus />
              <p className="text-xs text-gray-400 mt-1">El video debe estar accesible para la cuenta de servicio de HE (compártelo o súbelo al Drive de HE).</p>
            </div>
            {err && <p className="text-red-600 text-sm">{err}</p>}
            <button type="submit" disabled={!!busy} className="w-full font-bold py-3 rounded-lg" style={{ background: GOLD, color: NAVY }}>{busy || 'Analizar video'}</button>
          </form>
        )}

        {/* PROYECTO */}
        {view === 'project' && cur && (
          <div className="space-y-4">
            {['loading', 'analyzing', 'cleaning'].includes(cur.status) && (
              <div className="bg-white rounded-2xl p-8 shadow text-center">
                <p className="font-bold text-lg mb-2" style={{ color: NAVY }}>{cur.status === 'cleaning' ? 'Generando video limpio…' : 'Analizando el video…'}</p>
                <p className="text-gray-500 text-sm mb-4">{cur.progress?.msg || 'Procesando...'}</p>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden"><div className="h-full transition-all" style={{ width: `${Math.max(5, cur.progress?.pct ?? 0)}%`, background: GOLD }} /></div>
              </div>
            )}

            {cur.status === 'error' && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{cur.error || 'Ocurrió un error.'}</div>}

            {cur.status === 'analyzed' && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="font-bold text-lg mb-1" style={{ color: NAVY }}>Revisión de cortes</p>
                  <p className="text-gray-500 text-sm mb-4">Detectamos {cur.cuts?.length ?? 0} cosa(s) para limpiar. Desmarca lo que quieras conservar.</p>
                  {(cur.cuts?.length ?? 0) === 0 && <p className="text-sm text-gray-500">El video ya está limpio (sin muletillas ni repeticiones). Puedes generarlo igual.</p>}
                  <div className="space-y-2">
                    {cur.cuts?.map((c) => (
                      <label key={c.id} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer" style={approved.has(c.id) ? { borderColor: GOLD, background: '#fffbea' } : { borderColor: '#e5e5e0' }}>
                        <input type="checkbox" checked={approved.has(c.id)} onChange={() => toggleCut(c.id)} className="mt-1" />
                        <div className="flex-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full mr-2" style={{ background: NAVY, color: '#fff' }}>{TYPE_LABEL[c.type] || c.type}</span>
                          <span className="text-xs text-gray-400">{c.start.toFixed(1)}s–{c.end.toFixed(1)}s</span>
                          {c.text && <p className="text-sm mt-1 line-through text-gray-500">“{c.text}”</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow">
                  <p className="text-xs font-semibold text-gray-400 mb-1">TEXTO LIMPIO RESULTANTE</p>
                  <p className="text-sm text-gray-700">{cur.clean_text}</p>
                </div>
                {err && <p className="text-red-600 text-sm">{err}</p>}
                <button onClick={generateClean} disabled={!!busy} className="w-full font-bold py-3 rounded-lg text-lg" style={{ background: GOLD, color: NAVY }}>{busy === 'clean' ? 'Generando…' : 'Generar video limpio'}</button>
              </>
            )}

            {cur.status === 'clean' && (
              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="font-bold text-lg mb-4" style={{ color: NAVY }}>Video limpio listo</p>
                <video src={`/api/admin/editor/projects/${cur.id}/video?which=clean`} controls playsInline className="w-full max-w-xs mx-auto rounded-xl bg-black" style={{ aspectRatio: '9/16' }} />
                <div className="flex gap-3 mt-5">
                  <a href={`/api/admin/editor/projects/${cur.id}/video?which=clean`} download className="flex-1 text-center font-bold py-3 rounded-lg" style={{ background: GOLD, color: NAVY }}>Descargar</a>
                  <button onClick={() => openProject(cur.id)} className="flex-1 font-bold py-3 rounded-lg border" style={{ borderColor: NAVY, color: NAVY }}>Revisar cortes</button>
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">Próximo paso (en construcción): editar este video limpio con línea de tiempo — subtítulos, zoom, marca y música.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </AdminGate>
  );
}
