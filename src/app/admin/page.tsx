'use client'

import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────────────

type Section = 'productos' | 'ordenes' | 'inventario' | 'cupones' | 'notificaciones' | 'resenas' | 'acceso'

type PanelMode =
  | { type: 'nuevo-producto' }
  | { type: 'editar-producto'; producto: Producto }
  | { type: 'ver-orden'; orden: Orden }
  | { type: 'editar-stock'; variante: Variante }
  | { type: 'nuevo-cupon' }
  | { type: 'editar-cupon'; cupon: Cupon }
  | null

interface Producto {
  id: string; slug: string; nombre: string; precio: number
  precio_comparar?: number; badge?: string; activo: boolean; destacado: boolean
  stock_total: number; categoria: string; categoria_id?: string
  categoria_slug?: string; descripcion_corta?: string; imagen_url?: string
}

interface OrdenItem {
  nombre: string; variante?: string; precio: number; cantidad: number; subtotal: number
}

interface Orden {
  id: string; numero: number; cliente_nombre: string; cliente_email: string
  cliente_telefono?: string; direccion?: string; ciudad?: string; region?: string
  courier?: string; total: number; subtotal?: number; descuento?: number
  costo_despacho?: number; cupon_codigo?: string; estado: string
  es_regalo?: boolean; mensaje_regalo?: string; regalo_de?: string; regalo_para?: string; created_at: string; items?: OrdenItem[]
}

interface Cupon {
  id: string; codigo: string; tipo: 'porcentaje' | 'monto_fijo'
  valor: number; minimo_compra: number; usos_actuales: number
  usos_maximos?: number; activo: boolean
}

interface Variante {
  id: string; nombre: string; stock: number
  producto_id: string; producto_nombre: string
}

interface Categoria { id: string; nombre: string; slug: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) { return '$' + n.toLocaleString('es-CL') }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}
function numOrden(n: number) { return 'MAN-' + String(n).padStart(4, '0') }
function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const ESTADOS = ['pendiente', 'confirmado', 'procesando', 'despachado', 'entregado', 'cancelado'] as const
const ESTADO_STYLE: Record<string, { color: string; bg: string }> = {
  pendiente:  { color: '#906f00',  bg: 'rgba(224,200,117,0.2)' },
  confirmado: { color: '#2a5f80',  bg: 'rgba(91,141,184,0.15)' },
  procesando: { color: '#1C3D2E',  bg: 'rgba(46,92,69,0.12)' },
  despachado: { color: '#A07830',  bg: 'rgba(160,120,48,0.15)' },
  entregado:  { color: '#1C3D2E',  bg: 'rgba(46,92,69,0.2)' },
  cancelado:  { color: '#c0392b',  bg: 'rgba(192,57,43,0.12)' },
}

// ── Inline style shortcuts ────────────────────────────────────────────────────

const S = {
  btnPrim: { display:'inline-flex', alignItems:'center', gap:'5px', background:'var(--verde)', color:'var(--crema)', padding:'8px 16px', fontSize:'10px', letterSpacing:'0.17em', textTransform:'uppercase' as const, border:'none', cursor:'pointer', fontFamily:'var(--ff-sans)' },
  btnSec:  { display:'inline-flex', alignItems:'center', gap:'5px', background:'transparent', color:'var(--verde)', padding:'8px 14px', fontSize:'10px', letterSpacing:'0.17em', textTransform:'uppercase' as const, border:'0.5px solid rgba(28,61,46,.22)', cursor:'pointer', fontFamily:'var(--ff-sans)' },
  inp:  { width:'100%', padding:'9px 11px', background:'rgba(28,61,46,.04)', border:'0.5px solid rgba(28,61,46,.17)', color:'var(--verde)', fontSize:'13px', fontFamily:'var(--ff-sans)', outline:'none', marginBottom:'14px' },
  sel:  { width:'100%', padding:'9px 11px', background:'rgba(28,61,46,.04)', border:'0.5px solid rgba(28,61,46,.17)', color:'var(--verde)', fontSize:'13px', fontFamily:'var(--ff-sans)', outline:'none', marginBottom:'14px', appearance:'none' as const },
  ta:   { width:'100%', padding:'9px 11px', background:'rgba(28,61,46,.04)', border:'0.5px solid rgba(28,61,46,.17)', color:'var(--verde)', fontSize:'13px', fontFamily:'var(--ff-sans)', outline:'none', marginBottom:'14px', resize:'vertical' as const, minHeight:'65px' },
  lbl:  { fontSize:'9px', letterSpacing:'0.22em', textTransform:'uppercase' as const, color:'#3a6b52', marginBottom:'5px', display:'block' },
  th:   { fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase' as const, color:'#3a6b52', padding:'10px 13px', textAlign:'left' as const, borderBottom:'0.5px solid rgba(28,61,46,.1)', fontWeight:400, background:'rgba(28,61,46,.02)' },
  td:   { padding:'13px', borderBottom:'0.5px solid rgba(28,61,46,.06)', verticalAlign:'middle' as const },
}

// ── Toggle component ──────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{ width:'36px', height:'19px', borderRadius:'10px', position:'relative', cursor:'pointer', border:'none', background: on ? 'var(--verde)' : 'rgba(28,61,46,.14)', flexShrink:0 }}
    >
      <div style={{ position:'absolute', top:'2px', left: on ? '19px' : '2px', width:'15px', height:'15px', borderRadius:'50%', background: on ? 'var(--dorado-pale)' : '#fff', transition:'left .2s' }} />
    </button>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ num, label, alert, warn, of: ofVal }: { num: string | number; label: string; alert?: boolean; warn?: boolean; of?: number }) {
  return (
    <div style={{ padding:'16px 20px', background:'var(--crema)', borderLeft:`2px solid ${alert ? '#C0392B' : warn ? 'var(--dorado)' : 'transparent'}` }}>
      <div style={{ fontFamily:'var(--ff-serif)', fontSize:'28px', lineHeight:1, marginBottom:'2px', color: alert ? '#C0392B' : warn ? 'var(--dorado)' : 'inherit' }}>
        {num}{ofVal !== undefined && <span style={{ fontSize:'13px', color:'rgba(28,61,46,.3)' }}> / {ofVal}</span>}
      </div>
      <div style={{ fontSize:'9px', letterSpacing:'0.17em', textTransform:'uppercase', color:'#3a6b52' }}>{label}</div>
    </div>
  )
}

// ── LoginPanel ────────────────────────────────────────────────────────────────

function LoginPanel({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recovery, setRecovery] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const sb = createClient()

  async function handleLogin(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const { data, error: err } = await sb.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    if (data.user) onLogin(data.user)
  }

  async function handleRecovery(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const { error: err } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setRecoverySent(true)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#EDE5D4' }}>
      <div style={{ width:'380px', background:'var(--crema)', padding:'48px 40px', border:'0.5px solid rgba(28,61,46,.12)' }}>
        <div style={{ fontFamily:'var(--ff-serif)', fontSize:'28px', color:'var(--verde)', marginBottom:'6px', letterSpacing:'0.1em' }}>MANTIS</div>
        <p style={{ fontSize:'9px', letterSpacing:'0.28em', textTransform:'uppercase', color:'var(--dorado)', marginBottom:'36px' }}>Panel de administración</p>

        {!recovery ? (
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={S.lbl}>Email</label>
              <input style={S.inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label style={S.lbl}>Contraseña</label>
              <input style={S.inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && <p style={{ fontSize:'11px', color:'#C0392B' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...S.btnPrim, justifyContent:'center', padding:'14px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" onClick={() => setRecovery(true)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'10px', color:'#3a6b52', letterSpacing:'0.1em' }}>
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        ) : recoverySent ? (
          <p style={{ fontSize:'13px', color:'var(--verde)', lineHeight:1.8 }}>Revisa tu email — te enviamos un enlace de recuperación.</p>
        ) : (
          <form onSubmit={handleRecovery} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <p style={{ fontSize:'12px', color:'#3a6b52' }}>Ingresa tu email y te enviamos un enlace de recuperación.</p>
            <div>
              <label style={S.lbl}>Email</label>
              <input style={S.inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <p style={{ fontSize:'11px', color:'#C0392B' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...S.btnPrim, justifyContent:'center', padding:'14px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <button type="button" onClick={() => setRecovery(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'10px', color:'#3a6b52' }}>
              ← Volver
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Sección Productos ─────────────────────────────────────────────────────────

function SeccionProductos({
  onSetAction, onAbrirPanel, showToast, showConfirm,
}: {
  onSetAction: (el: React.ReactNode) => void
  onAbrirPanel: (m: PanelMode) => void
  showToast: (msg: string, err?: boolean) => void
  showConfirm: (msg: string, fn: () => void) => void
}) {
  const sb = createClient()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const res = await globalThis.fetch('/api/admin/productos')
    const json = await res.json()
    if (!res.ok) { console.error('[SeccionProductos] error:', json.error); setLoading(false); return }
    setProductos((json.productos ?? []).map((p: any) => ({
      id: p.id, slug: p.slug, nombre: p.nombre, precio: p.precio,
      precio_comparar: p.precio_comparar, badge: p.badge, activo: p.activo, destacado: p.destacado ?? false,
      descripcion_corta: p.descripcion_corta, imagen_url: p.imagen_url ?? '',
      categoria: p.categorias?.nombre ?? '',
      categoria_id: p.categorias?.id ?? '',
      categoria_slug: p.categorias?.slug ?? '',
      categoria_orden: p.categorias?.orden ?? 99,
      stock_total: (p.variantes ?? []).filter((v: any) => v.activa).reduce((s: number, v: any) => s + (v.stock || 0), 0),
    })).sort((a: any, b: any) => a.categoria_orden - b.categoria_orden || a.nombre.localeCompare(b.nombre, 'es')))
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    onSetAction(
      <button style={S.btnPrim} onClick={() => onAbrirPanel({ type: 'nuevo-producto' })}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Nuevo producto
      </button>
    )
    return () => onSetAction(null)
  }, [onSetAction, onAbrirPanel])

  async function patchProducto(id: string, fields: Record<string, unknown>) {
    console.log('[admin] PATCH producto', id, fields)
    const res = await globalThis.fetch('/api/admin/productos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    })
    const json = await res.json()
    console.log('[admin] PATCH resultado:', json)
    if (!res.ok) { showToast(json.error ?? 'Error al actualizar', true); return false }
    return true
  }

  async function toggleActivo(p: Producto) {
    if (!await patchProducto(p.id, { activo: !p.activo })) return
    setProductos(prev => prev.map(x => x.id === p.id ? { ...x, activo: !x.activo } : x))
  }

  async function toggleDestacado(p: Producto) {
    console.log('[admin] toggleDestacado', p.nombre, '→ destacado:', !p.destacado)
    if (!await patchProducto(p.id, { destacado: !p.destacado })) return
    setProductos(prev => prev.map(x => x.id === p.id ? { ...x, destacado: !x.destacado } : x))
  }

  function pedirEliminar(p: Producto) {
    showConfirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`, async () => {
      const res = await globalThis.fetch('/api/admin/productos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id }),
      })
      if (!res.ok) { showToast('Error al eliminar', true); return }
      showToast('Producto eliminado', true)
      fetch()
    })
  }

  const sinStock = productos.filter(p => p.stock_total === 0).length
  const stockBajo = productos.filter(p => p.stock_total > 0 && p.stock_total <= 8).length
  const activos = productos.filter(p => p.activo).length

  if (loading) return <div style={{ padding:'40px', color:'#3a6b52', fontSize:'12px' }}>Cargando productos…</div>

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(28,61,46,.08)', marginBottom:'22px' }}>
        <StatCard num={activos} of={productos.length} label="Productos activos" />
        <StatCard num={sinStock} label="Sin stock" alert={sinStock > 0} />
        <StatCard num={stockBajo} label="Stock bajo (≤8)" warn={stockBajo > 0} />
      </div>

      <div style={{ border:'0.5px solid rgba(28,61,46,.1)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--crema)' }}>
          <thead>
            <tr>
              {['Producto','Categoría','Precio','Stock','Badge','Destacado','Estado',''].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map(p => {
              const sc = p.stock_total === 0 ? '#c0392b' : p.stock_total <= 8 ? '#d35400' : 'var(--verde)'
              return (
                <tr key={p.id} style={{ opacity: p.activo ? 1 : 0.45 }}>
                  <td style={S.td}>
                    <div style={{ fontFamily:'var(--ff-serif)', fontSize:'15px', marginBottom:'2px' }}>{p.nombre}</div>
                    <div style={{ fontSize:'10px', color:'#3a6b52' }}>{p.slug}</div>
                  </td>
                  <td style={{ ...S.td, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#3a6b52' }}>{p.categoria}</td>
                  <td style={S.td}><span style={{ fontFamily:'var(--ff-serif)', fontSize:'16px', color:'var(--dorado)' }}>{fmt(p.precio)}</span></td>
                  <td style={S.td}>
                    <div style={{ fontFamily:'var(--ff-serif)', fontSize:'16px', color: sc }}>{p.stock_total}</div>
                    {p.stock_total === 0 && <div style={{ fontSize:'9px', color:'#c0392b', letterSpacing:'0.1em', textTransform:'uppercase' }}>Sin stock</div>}
                    {p.stock_total > 0 && p.stock_total <= 8 && <div style={{ fontSize:'9px', color:'#d35400', letterSpacing:'0.1em', textTransform:'uppercase' }}>Stock bajo</div>}
                  </td>
                  <td style={S.td}>
                    {p.badge
                      ? <span style={{ fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', padding:'3px 7px', background: p.badge === 'Nuevo' ? 'var(--dorado)' : 'var(--verde)', color:'var(--crema)' }}>{p.badge}</span>
                      : <span style={{ color:'rgba(28,61,46,.3)', fontSize:'10px' }}>—</span>
                    }
                  </td>
                  <td style={S.td}>
                    <button
                      onClick={() => toggleDestacado(p)}
                      title={p.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px', fontSize:'16px', lineHeight:1, opacity: p.destacado ? 1 : 0.25, transition:'opacity .15s' }}
                    >
                      ⭐
                    </button>
                  </td>
                  <td style={S.td}>
                    <button
                      onClick={() => toggleActivo(p)}
                      style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'10px', letterSpacing:'0.09em', padding:'4px 10px', cursor:'pointer', border:'none', fontFamily:'var(--ff-sans)', background: p.activo ? 'rgba(28,61,46,.1)' : 'rgba(28,61,46,.06)', color: p.activo ? 'var(--verde)' : '#3a6b52' }}
                    >
                      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: p.activo ? '#2e5c45' : '#ccc', flexShrink:0 }} />
                      {p.activo ? 'Activo' : 'Oculto'}
                    </button>
                  </td>
                  <td style={S.td}>
                    <div style={{ display:'flex', gap:'2px' }}>
                      <button title="Editar" onClick={() => onAbrirPanel({ type: 'editar-producto', producto: p })} style={{ background:'none', border:'none', cursor:'pointer', padding:'5px 6px', color:'#3a6b52' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 2l2 2L3.5 11H1.5V9L8.5 2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                      </button>
                      <button title="Eliminar" onClick={() => pedirEliminar(p)} style={{ background:'none', border:'none', cursor:'pointer', padding:'5px 6px', color:'#c0392b' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3h9M4 3V2h4v1M4.5 5v4.5M7.5 5v4.5M2 3l.7 7h6.6l.7-7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Sección Órdenes ───────────────────────────────────────────────────────────

function SeccionOrdenes({ onSetAction, onAbrirPanel, showToast }: {
  onSetAction: (el: React.ReactNode) => void
  onAbrirPanel: (m: PanelMode) => void
  showToast: (msg: string, err?: boolean) => void
}) {
  const sb = createClient()
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await globalThis.fetch('/api/admin/ordenes')
      const json = await res.json()
      if (!res.ok) {
        console.error('[admin] ❌ error cargando órdenes:', json.error)
        setLoading(false)
        return
      }
      console.log('[admin] órdenes cargadas:', json.ordenes?.length ?? 0)
      setOrdenes((json.ordenes ?? []).map((o: any) => ({
        ...o,
        es_regalo: o.es_regalo ?? false,
        items: o.orden_items ?? [],
      })))
    } catch (err) {
      console.error('[admin] ❌ excepción cargando órdenes:', err)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    onSetAction(
      <button style={S.btnSec} onClick={() => exportarCSV(ordenes)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1"/><line x1="4" y1="1" x2="4" y2="11" stroke="currentColor" strokeWidth="1"/><line x1="1" y1="4.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1"/><line x1="1" y1="7.5" x2="11" y2="7.5" stroke="currentColor" strokeWidth="1"/></svg>
        Exportar Excel
      </button>
    )
    return () => onSetAction(null)
  }, [onSetAction, ordenes])

  function exportarCSV(rows: Orden[]) {
    const csv = ['Número,Cliente,Email,Total,Estado,Fecha',
      ...rows.map(o => `${numOrden(o.numero)},${o.cliente_nombre},${o.cliente_email},${o.total},${o.estado},${fmtDate(o.created_at)}`)
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8;' }))
    a.download = 'ordenes-mantis.csv'; a.click()
  }

  const pend = ordenes.filter(o => o.estado === 'pendiente').length
  const desp = ordenes.filter(o => o.estado === 'despachado').length
  const activas = ordenes.filter(o => o.estado !== 'cancelado')
  const tot  = activas.reduce((s, o) => s + o.total, 0)

  if (loading) return <div style={{ padding:'40px', color:'#3a6b52', fontSize:'12px' }}>Cargando órdenes…</div>

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(28,61,46,.08)', marginBottom:'22px' }}>
        <StatCard num={activas.length} label="Órdenes activas" />
        <StatCard num={pend} label="Esperando transferencia" warn={pend > 0} />
        <StatCard num={fmt(tot)} label="Ingresos totales" />
      </div>

      <div style={{ border:'0.5px solid rgba(28,61,46,.1)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--crema)' }}>
          <thead>
            <tr>{['Orden','Cliente','Producto','Total','Estado','Fecha','Tracking'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {ordenes.map(o => {
              const est = ESTADO_STYLE[o.estado] ?? { color:'#3a6b52', bg:'rgba(28,61,46,.08)' }
              return (
                <tr key={o.id} onClick={() => onAbrirPanel({ type: 'ver-orden', orden: o })} style={{ cursor:'pointer' }}>
                  <td style={S.td}>
                    <div style={{ fontFamily:'var(--ff-serif)', fontSize:'14px' }}>{numOrden(o.numero)}</div>
                    {o.es_regalo && <div style={{ fontSize:'9px', color:'var(--dorado)', letterSpacing:'0.1em' }}>🎁 REGALO</div>}
                  </td>
                  <td style={S.td}>
                    <div style={{ fontSize:'13px' }}>{o.cliente_nombre}</div>
                    <div style={{ fontSize:'10px', color:'#3a6b52' }}>{o.cliente_email}</div>
                  </td>
                  <td style={{ ...S.td, fontSize:'11px', maxWidth:'150px' }}>
                    {(o.items ?? []).map(i => i.nombre).join(', ') || '—'}
                  </td>
                  <td style={S.td}><span style={{ fontFamily:'var(--ff-serif)', fontSize:'16px', color:'var(--dorado)' }}>{fmt(o.total)}</span></td>
                  <td style={S.td} onClick={e => e.stopPropagation()}>
                    <select
                      value={o.estado}
                      onChange={async e => {
                        const nuevo = e.target.value
                        console.log('[tabla-ordenes] cambiando estado orden', o.id, '→', nuevo)
                        const res = await globalThis.fetch('/api/admin/ordenes', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: o.id, estado: nuevo }),
                        })
                        const json = await res.json()
                        console.log('[tabla-ordenes] respuesta:', res.status, json)
                        if (!res.ok) { showToast(json.error ?? 'Error al actualizar', true); return }
                        setOrdenes(prev => prev.map(x => x.id === o.id ? { ...x, estado: nuevo } : x))
                        showToast('Estado actualizado: ' + nuevo)
                        if (nuevo === 'despachado') {
                          globalThis.fetch('/api/ordenes/despachar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orden_id: o.id }),
                          }).catch(err => console.error('[despachar email]', err))
                        }
                        if (nuevo === 'entregado') {
                          globalThis.fetch('/api/ordenes/solicitar-resena', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orden_id: o.id }),
                          }).catch(err => console.error('[resena email]', err))
                        }
                      }}
                      style={{ fontFamily:'var(--ff-sans)', fontSize:'10px', letterSpacing:'0.09em', textTransform:'uppercase', border:'0.5px solid rgba(28,61,46,.17)', background:'transparent', color:'var(--verde)', padding:'4px 7px', cursor:'pointer', appearance:'none', outline:'none' }}
                    >
                      {ESTADOS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                    </select>
                  </td>
                  <td style={{ ...S.td, fontSize:'10px', color:'#3a6b52' }}>{fmtDate(o.created_at)}</td>
                  <td style={{ ...S.td, fontSize:'10px', color:'#3a6b52' }}>{o.courier ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Sección Inventario ────────────────────────────────────────────────────────

function SeccionInventario({ onSetAction, onAbrirPanel, showToast }: {
  onSetAction: (el: React.ReactNode) => void
  onAbrirPanel: (m: PanelMode) => void
  showToast: (msg: string, err?: boolean) => void
}) {
  const sb = createClient()
  const [variantes, setVariantes] = useState<Variante[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onSetAction(null)
    return () => onSetAction(null)
  }, [onSetAction])

  useEffect(() => {
    async function load() {
      const { data } = await sb
        .from('variantes')
        .select('id, nombre, stock, activa, productos(id, nombre, categorias(orden))')
        .eq('activa', true)
      setVariantes((data ?? []).map((v: any) => ({
        id: v.id, nombre: v.nombre, stock: v.stock, activa: v.activa,
        producto_id: v.productos?.id ?? '', producto_nombre: v.productos?.nombre ?? '',
        categoria_orden: v.productos?.categorias?.orden ?? 99,
      })).sort((a: any, b: any) =>
        a.categoria_orden - b.categoria_orden ||
        a.producto_nombre.localeCompare(b.producto_nombre, 'es') ||
        a.nombre.localeCompare(b.nombre, 'es')
      ))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ padding:'40px', color:'#3a6b52', fontSize:'12px' }}>Cargando inventario…</div>

  return (
    <div style={{ border:'0.5px solid rgba(28,61,46,.1)', overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--crema)' }}>
        <thead>
          <tr>{['Producto','Variante','Stock total','Estado',''].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {variantes.map(v => (
            <tr key={v.id}>
              <td style={S.td}><div style={{ fontFamily:'var(--ff-serif)', fontSize:'15px' }}>{v.producto_nombre}</div></td>
              <td style={{ ...S.td, fontSize:'12px', color:'#3a6b52' }}>{v.nombre}</td>
              <td style={S.td}>
                <span style={{ fontFamily:'var(--ff-serif)', fontSize:'16px', color: v.stock === 0 ? '#c0392b' : v.stock <= 8 ? '#d35400' : 'var(--verde)' }}>
                  {v.stock}
                </span>
              </td>
              <td style={S.td}>
                {v.stock === 0
                  ? <span style={{ fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 8px', background:'rgba(192,57,43,.12)', color:'#c0392b' }}>Sin stock</span>
                  : v.stock <= 8
                  ? <span style={{ fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 8px', background:'rgba(91,141,184,.15)', color:'#2a5f80' }}>Stock bajo</span>
                  : <span style={{ fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 8px', background:'rgba(46,92,69,.2)', color:'var(--verde)' }}>OK</span>
                }
              </td>
              <td style={S.td}>
                <button
                  style={{ ...S.btnSec, fontSize:'9px', padding:'5px 10px' }}
                  onClick={() => onAbrirPanel({ type: 'editar-stock', variante: v })}
                >
                  Actualizar stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Sección Cupones ───────────────────────────────────────────────────────────

function SeccionCupones({ onSetAction, onAbrirPanel, showToast, showConfirm }: {
  onSetAction: (el: React.ReactNode) => void
  onAbrirPanel: (m: PanelMode) => void
  showToast: (msg: string, err?: boolean) => void
  showConfirm: (msg: string, fn: () => void) => void
}) {
  const [cupones, setCupones] = useState<Cupon[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const res = await globalThis.fetch('/api/admin/cupones')
    const json = await res.json()
    if (!res.ok) { console.error('[SeccionCupones] error al cargar:', json.error); setLoading(false); return }
    setCupones(json.cupones ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    onSetAction(
      <button style={S.btnPrim} onClick={() => onAbrirPanel({ type: 'nuevo-cupon' })}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Nuevo cupón
      </button>
    )
    return () => onSetAction(null)
  }, [onSetAction, onAbrirPanel])

  async function toggleActivo(c: Cupon) {
    const res = await globalThis.fetch('/api/admin/cupones', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: c.id, activo: !c.activo }),
    })
    const json = await res.json()
    if (!res.ok) { showToast(json.error ?? 'Error al actualizar', true); return }
    setCupones(prev => prev.map(x => x.id === c.id ? { ...x, activo: !x.activo } : x))
  }

  function pedirEliminar(c: Cupon) {
    showConfirm(`¿Eliminar el cupón "${c.codigo}"?`, async () => {
      const res = await globalThis.fetch('/api/admin/cupones', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: c.id }),
      })
      const json = await res.json()
      if (!res.ok) { showToast(json.error ?? 'Error al eliminar', true); return }
      showToast('Cupón eliminado')
      fetch()
    })
  }

  if (loading) return <div style={{ padding:'40px', color:'#3a6b52', fontSize:'12px' }}>Cargando cupones…</div>

  return (
    <div style={{ border:'0.5px solid rgba(28,61,46,.1)', overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--crema)' }}>
        <thead>
          <tr>{['Código','Tipo','Descuento','Mínimo','Usos','Estado',''].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {cupones.map(c => {
            const desc = c.tipo === 'porcentaje' ? `${c.valor}%` : fmt(c.valor)
            return (
              <tr key={c.id}>
                <td style={S.td}><span style={{ fontFamily:'var(--ff-serif)', fontSize:'17px', letterSpacing:'0.04em' }}>{c.codigo}</span></td>
                <td style={{ ...S.td, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#3a6b52' }}>{c.tipo.replace('_', ' ')}</td>
                <td style={S.td}><span style={{ fontFamily:'var(--ff-serif)', fontSize:'16px', color:'var(--dorado)' }}>{desc}</span></td>
                <td style={{ ...S.td, fontSize:'10px', color:'#3a6b52' }}>{c.minimo_compra > 0 ? fmt(c.minimo_compra) : 'Sin mínimo'}</td>
                <td style={S.td}>
                  <span style={{ fontFamily:'var(--ff-serif)', fontSize:'16px' }}>{c.usos_actuales}</span>
                  <span style={{ fontSize:'10px', color:'#3a6b52', marginLeft:'3px' }}>/ {c.usos_maximos != null ? c.usos_maximos : '∞'}</span>
                </td>
                <td style={S.td}>
                  <button onClick={() => toggleActivo(c)} style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'10px', letterSpacing:'0.09em', padding:'4px 10px', cursor:'pointer', border:'none', fontFamily:'var(--ff-sans)', background: c.activo ? 'rgba(28,61,46,.1)' : 'rgba(28,61,46,.06)', color: c.activo ? 'var(--verde)' : '#3a6b52' }}>
                    <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: c.activo ? '#2e5c45' : '#ccc' }} />
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td style={{ ...S.td, whiteSpace:'nowrap' }}>
                  <button onClick={() => onAbrirPanel({ type: 'editar-cupon', cupon: c })} style={{ background:'none', border:'none', cursor:'pointer', padding:'5px 6px', color:'#3a6b52' }} title="Editar">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={() => pedirEliminar(c)} style={{ background:'none', border:'none', cursor:'pointer', padding:'5px 6px', color:'#c0392b' }} title="Eliminar">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3h9M4 3V2h4v1M4.5 5v4.5M7.5 5v4.5M2 3l.7 7h6.6l.7-7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Sección Notificaciones ────────────────────────────────────────────────────

function SeccionNotificaciones({ onSetAction }: { onSetAction: (el: React.ReactNode) => void }) {
  const sb = createClient()
  const [notifs, setNotifs] = useState<Array<{ tipo: string; titulo: string; sub: string; hora: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onSetAction(null)
    return () => onSetAction(null)
  }, [onSetAction])

  useEffect(() => {
    async function load() {
      const [{ data: ordenes }, { data: variantes }] = await Promise.all([
        sb.from('ordenes').select('numero, cliente_nombre, total, estado, created_at').order('created_at', { ascending: false }).limit(8),
        sb.from('variantes').select('stock, productos(nombre)').eq('activa', true).lte('stock', 8),
      ])
      const items: typeof notifs = []
      ;(ordenes ?? []).forEach((o: any) => {
        if (o.estado === 'pendiente') {
          items.push({ tipo:'nueva', titulo:`Nuevo pedido ${numOrden(o.numero)}`, sub:`${o.cliente_nombre} · ${fmt(o.total)}`, hora: fmtDate(o.created_at) })
        }
      })
      ;(variantes ?? []).forEach((v: any) => {
        if (v.stock === 0) {
          items.push({ tipo:'alerta', titulo:`Stock agotado: ${v.productos?.nombre ?? ''}`, sub:'El producto ha llegado a 0 unidades', hora:'' })
        } else {
          items.push({ tipo:'alerta', titulo:`Stock bajo: ${v.productos?.nombre ?? ''}`, sub:`Solo quedan ${v.stock} unidades`, hora:'' })
        }
      })
      ;(ordenes ?? []).slice(0, 5).forEach((o: any) => {
        if (o.estado !== 'pendiente') {
          items.push({ tipo:'info', titulo:`Orden ${numOrden(o.numero)} · ${o.estado}`, sub:`${o.cliente_nombre} · ${fmt(o.total)}`, hora: fmtDate(o.created_at) })
        }
      })
      setNotifs(items.slice(0, 12))
      setLoading(false)
    }
    load()
  }, [])

  const dotColor = (tipo: string) => tipo === 'nueva' ? 'var(--dorado)' : tipo === 'alerta' ? '#C0392B' : '#5b8db8'

  if (loading) return <div style={{ padding:'40px', color:'#3a6b52', fontSize:'12px' }}>Cargando…</div>

  return (
    <div style={{ maxWidth:'600px' }}>
      {notifs.length === 0 && <p style={{ color:'#3a6b52', fontSize:'13px' }}>Sin notificaciones recientes.</p>}
      {notifs.map((n, i) => (
        <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'14px', padding:'14px 0', borderBottom:'0.5px solid rgba(28,61,46,.08)' }}>
          <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: dotColor(n.tipo), marginTop:'4px', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'13px', fontWeight:400, marginBottom:'2px' }}>{n.titulo}</div>
            <div style={{ fontSize:'11px', color:'#3a6b52', lineHeight:1.6 }}>{n.sub}</div>
          </div>
          {n.hora && <div style={{ fontSize:'10px', color:'rgba(28,61,46,.3)', whiteSpace:'nowrap', paddingLeft:'10px' }}>{n.hora}</div>}
        </div>
      ))}
    </div>
  )
}

// ── Sección Reseñas ───────────────────────────────────────────────────────────

interface ResenaAdmin {
  id: string
  producto_id: string
  producto_nombre?: string
  nombre_cliente: string
  email: string
  calificacion: number
  texto: string
  aprobada: boolean
  destacada: boolean
  fecha: string
}

function SeccionResenas({ onSetAction, showToast }: {
  onSetAction: (el: React.ReactNode) => void
  showToast: (msg: string, err?: boolean) => void
}) {
  const [resenas, setResenas] = useState<ResenaAdmin[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState<'pendientes' | 'aprobadas' | 'todas'>('pendientes')

  const cargar = useCallback(async () => {
    setCargando(true)
    const res = await globalThis.fetch(`/api/admin/resenas?filtro=${filtro}`)
    const json = await res.json()
    setResenas((json.resenas ?? []).map((r: Record<string, unknown>) => ({
      ...r,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      producto_nombre: (r.productos as any)?.nombre ?? 'Producto desconocido',
    })) as ResenaAdmin[])
    setCargando(false)
  }, [filtro])

  useEffect(() => { cargar() }, [cargar])
  useEffect(() => { onSetAction(null); return () => onSetAction(null) }, [onSetAction])

  async function aprobar(id: string) {
    await globalThis.fetch('/api/admin/resenas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, aprobada: true }),
    })
    showToast('Reseña aprobada')
    cargar()
  }

  async function toggleDestacada(r: ResenaAdmin) {
    const nuevo = !r.destacada
    const res = await globalThis.fetch('/api/admin/resenas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id, destacada: nuevo }),
    })
    const json = await res.json()
    if (!res.ok) { showToast(json.error ?? 'Error al actualizar', true); return }
    showToast(nuevo ? 'Reseña destacada en el inicio' : 'Reseña quitada del inicio')
    cargar()
  }

  async function eliminar(id: string) {
    await globalThis.fetch('/api/admin/resenas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    showToast('Reseña eliminada')
    cargar()
  }

  const totalDestacadas = resenas.filter(r => r.destacada).length

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['pendientes', 'aprobadas', 'todas'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              padding: '6px 14px', border: '0.5px solid rgba(28,61,46,0.2)',
              background: filtro === f ? 'var(--verde)' : 'none',
              color: filtro === f ? 'var(--crema)' : 'var(--verde)',
              fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.12em',
              textTransform: 'capitalize', cursor: 'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {cargando ? (
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.4, fontSize: '13px' }}>Cargando...</div>
      ) : resenas.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.4 }}>
          <p style={{ fontSize: '14px', fontFamily: 'var(--ff-serif)' }}>No hay reseñas {filtro === 'pendientes' ? 'pendientes' : filtro === 'aprobadas' ? 'aprobadas' : ''}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resenas.map(r => (
            <div key={r.id} style={{
              background: r.aprobada ? '#f6faf8' : '#fffaf2',
              border: `0.5px solid ${r.aprobada ? 'rgba(28,61,46,0.1)' : 'rgba(160,120,48,0.25)'}`,
              padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '16px', color: 'var(--verde)' }}>{r.nombre_cliente}</span>
                  <span style={{ marginLeft: '8px', fontSize: '11px', color: '#3a6b52', opacity: 0.6 }}>{r.email}</span>
                  <div style={{ marginTop: '2px' }}>
                    <span style={{ color: '#A07830', fontSize: '13px', letterSpacing: '2px' }}>{stars(r.calificacion)}</span>
                    <span style={{ marginLeft: '8px', fontSize: '10px', color: '#3a6b52', opacity: 0.5 }}>
                      {new Date(r.fecha).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                  {r.aprobada && (
                    <button
                      onClick={() => toggleDestacada(r)}
                      title={r.destacada ? 'Quitar del inicio' : totalDestacadas >= 3 ? 'Máximo 3 destacadas' : 'Destacar en el inicio'}
                      style={{
                        background: 'none', border: 'none', cursor: totalDestacadas >= 3 && !r.destacada ? 'not-allowed' : 'pointer',
                        fontSize: '18px', lineHeight: 1, padding: '2px 4px',
                        opacity: r.destacada ? 1 : totalDestacadas >= 3 ? 0.25 : 0.35,
                        transition: 'opacity .15s',
                      }}
                    >
                      ⭐
                    </button>
                  )}
                  {!r.aprobada && (
                    <button
                      onClick={() => aprobar(r.id)}
                      style={{
                        background: 'var(--verde)', color: 'var(--crema)', border: 'none',
                        padding: '6px 14px', fontSize: '10px', letterSpacing: '0.12em',
                        textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--ff-sans)',
                      }}
                    >
                      Aprobar
                    </button>
                  )}
                  <button
                    onClick={() => eliminar(r.id)}
                    style={{
                      background: 'none', color: '#C0392B', border: '0.5px solid #C0392B',
                      padding: '6px 14px', fontSize: '10px', letterSpacing: '0.12em',
                      textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--ff-sans)',
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.7, margin: 0 }}>{r.texto}</p>
              <div style={{ marginTop: '8px', fontSize: '10px', color: '#3a6b52', opacity: 0.5 }}>
                Producto: {r.producto_nombre}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sección Acceso ────────────────────────────────────────────────────────────

function SeccionAcceso({ onSetAction, user }: { onSetAction: (el: React.ReactNode) => void; user: User }) {
  useEffect(() => {
    onSetAction(null)
    return () => onSetAction(null)
  }, [onSetAction])

  const infoBox = (lbl: string, val: string, sub: string, verde = false) => (
    <div style={{ background: verde ? 'var(--verde)' : '#EDE5D4', padding:'22px 24px', marginBottom:'16px' }}>
      <div style={{ fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color: verde ? 'rgba(200,169,110,.6)' : '#3a6b52', marginBottom:'10px' }}>{lbl}</div>
      <div style={{ fontFamily:'var(--ff-serif)', fontSize:'18px', color: verde ? 'var(--crema)' : 'inherit', marginBottom:'4px' }}>{val}</div>
      <div style={{ fontSize:'12px', color: verde ? 'rgba(245,240,232,.4)' : '#3a6b52', lineHeight:1.8 }} dangerouslySetInnerHTML={{ __html: sub }} />
    </div>
  )

  return (
    <div style={{ maxWidth:'500px' }}>
      {infoBox('URL del panel admin', 'mantisjoyas.cl/admin', 'Solo pueden ingresar las cuentas creadas en Supabase.')}
      {infoBox('Recuperación de contraseña', '¿Olvidaste tu contraseña?', 'Desde el login haz clic en "¿Olvidaste tu contraseña?", ingresa tu email y recibirás un link seguro. El link expira en 1 hora.')}
      {infoBox('Cuenta activa', user.email ?? '', 'Administrador principal · Acceso completo', true)}
      {infoBox('Notificaciones automáticas', '', 'Al recibir un pedido se envía notificación al email configurado en variables de entorno de Supabase.')}
    </div>
  )
}

// ── Panel (slide-out) content ─────────────────────────────────────────────────

function PanelBody({
  mode, onClose, showToast, onRefresh,
}: {
  mode: PanelMode
  onClose: () => void
  showToast: (msg: string, err?: boolean) => void
  onRefresh: () => void
}) {
  const sb = createClient()
  const [loading, setPanelLoading] = useState(false)
  const [cats, setCats] = useState<Categoria[]>([])

  // Producto form state
  const prod = mode?.type === 'editar-producto' ? mode.producto : null
  const [pNombre, setPNombre] = useState(prod?.nombre ?? '')
  const [pPrecio, setPPrecio] = useState(String(prod?.precio ?? ''))
  const [pCatId, setPCatId] = useState(prod?.categoria_id ?? '')
  const [pBadge, setPBadge] = useState(prod?.badge ?? '')
  const [pDesc, setPDesc] = useState(prod?.descripcion_corta ?? '')
  const [pActivo, setPActivo] = useState(prod?.activo ?? true)
  // Image state — baseFilename ensures main+preview share the same storage key
  const [baseFilename] = useState(() => String(Date.now()))
  const [pImagenUrl, setPImagenUrl] = useState(prod?.imagen_url ?? '')
  const [pPreviewUrl, setPPreviewUrl] = useState('')
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingPreview, setUploadingPreview] = useState(false)

  // Stock form state
  const var_ = mode?.type === 'editar-stock' ? mode.variante : null
  const [newStock, setNewStock] = useState(String(var_?.stock ?? ''))

  // Cupon form state
  const editingCupon = mode?.type === 'editar-cupon' ? mode.cupon : null
  const [cCodigo, setCCodigo] = useState(editingCupon?.codigo ?? '')
  const [cTipo, setCTipo] = useState<'porcentaje' | 'monto_fijo'>(editingCupon?.tipo ?? 'porcentaje')
  const [cValor, setCValor] = useState(editingCupon ? String(editingCupon.valor) : '')
  const [cMinimo, setCMinimo] = useState(editingCupon ? String(editingCupon.minimo_compra) : '')
  const [cUsos, setCUsos] = useState(editingCupon?.usos_maximos != null ? String(editingCupon.usos_maximos) : '')

  // Orden detail — estado change
  const orden = mode?.type === 'ver-orden' ? mode.orden : null
  const [oEstado, setOEstado] = useState(orden?.estado ?? '')

  useEffect(() => {
    if (mode?.type === 'nuevo-producto' || mode?.type === 'editar-producto') {
      sb.from('categorias').select('id, nombre, slug').order('nombre').then(({ data }) => setCats(data ?? []))
    }
  }, [mode])

  if (!mode) return null

  async function guardarProducto() {
    const m = mode; if (!m) return
    setPanelLoading(true)
    const payload = {
      nombre: pNombre.trim(),
      precio: parseInt(pPrecio) || 0,
      categoria_id: pCatId || null,
      badge: pBadge || null,
      descripcion_corta: pDesc.trim() || null,
      activo: pActivo,
      ...(pImagenUrl ? { imagen_url: pImagenUrl } : {}),
    }
    console.log('[admin] guardarProducto payload:', JSON.stringify(payload))
    if (m.type === 'editar-producto') {
      const res = await globalThis.fetch('/api/admin/productos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: m.producto.id, ...payload }),
      })
      const json = await res.json()
      console.log('[admin] guardarProducto resultado:', json)
      if (!res.ok) { showToast(json.error ?? 'Error al guardar', true); setPanelLoading(false); return }
      showToast('Producto actualizado')
    } else {
      const slug = slugify(pNombre)
      const { error } = await sb.from('productos').insert({ ...payload, slug })
      if (error) { showToast('Error al crear', true); setPanelLoading(false); return }
      showToast('Producto creado')
    }
    setPanelLoading(false)
    onRefresh()
    onClose()
  }

  async function guardarStock() {
    if (!var_) return
    setPanelLoading(true)
    const { error } = await sb.from('variantes').update({ stock: parseInt(newStock) || 0 }).eq('id', var_.id)
    if (error) { showToast('Error al actualizar', true); setPanelLoading(false); return }
    showToast('Stock actualizado')
    setPanelLoading(false)
    onRefresh()
    onClose()
  }

  async function crearCupon() {
    if (!cCodigo.trim() || !cValor) { showToast('Completa todos los campos', true); return }
    const payload: Record<string, unknown> = {
      codigo: cCodigo.toUpperCase().trim(),
      tipo: cTipo,
      valor: parseInt(cValor) || 0,
      minimo_compra: parseInt(cMinimo) || 0,
    }
    if (cUsos.trim()) payload.usos_maximos = parseInt(cUsos) || null
    setPanelLoading(true)
    const res = await globalThis.fetch('/api/admin/cupones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) { showToast(json.error ?? 'Error al crear', true); setPanelLoading(false); return }
    showToast('Cupón creado')
    setPanelLoading(false)
    onRefresh()
    onClose()
  }

  async function editarCupon() {
    if (!editingCupon || !cCodigo.trim() || !cValor) { showToast('Completa todos los campos', true); return }
    const fields: Record<string, unknown> = {
      codigo: cCodigo.toUpperCase().trim(),
      tipo: cTipo,
      valor: parseInt(cValor) || 0,
      minimo_compra: parseInt(cMinimo) || 0,
      usos_maximos: cUsos.trim() ? parseInt(cUsos) || null : null,
    }
    setPanelLoading(true)
    const res = await globalThis.fetch('/api/admin/cupones', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingCupon.id, ...fields }),
    })
    const json = await res.json()
    if (!res.ok) { showToast(json.error ?? 'Error al guardar', true); setPanelLoading(false); return }
    showToast('Cupón actualizado')
    setPanelLoading(false)
    onRefresh()
    onClose()
  }

  async function cambiarEstadoOrden(estado: string) {
    console.log('[cambiarEstadoOrden] llamado con estado:', estado, '| orden:', orden?.id ?? 'null')
    if (!orden) { console.warn('[cambiarEstadoOrden] orden es null, abortando'); return }
    const body = { id: orden.id, estado }
    console.log('[cambiarEstadoOrden] enviando PATCH a /api/admin/ordenes:', body)
    const res = await globalThis.fetch('/api/admin/ordenes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    console.log('[cambiarEstadoOrden] respuesta:', res.status, json)
    if (!res.ok) { showToast(json.error ?? 'Error al actualizar', true); return }
    setOEstado(estado)
    showToast('Estado: ' + estado)
    if (estado === 'despachado') {
      globalThis.fetch('/api/ordenes/despachar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orden_id: orden.id }),
      }).catch(err => console.error('[despachar email]', err))
    }
    if (estado === 'entregado') {
      fetch('/api/ordenes/solicitar-resena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orden_id: orden.id }),
      }).catch(err => console.error('[resena email]', err))
    }
  }

  // Render panel body content
  if (mode.type === 'nuevo-producto' || mode.type === 'editar-producto') {
    const catSlug = cats.find(c => c.id === pCatId)?.slug ?? prod?.categoria_slug ?? ''
    const esDije = catSlug === 'dijes'
    const esPulsera = catSlug === 'pulseras'

    async function uploadMain(file: File) {
      if (file.size > 5 * 1024 * 1024) { showToast('Máx 5MB', true); return }
      setUploadingMain(true)
      const folder = esDije ? 'dijes' : (catSlug || 'general')
      const { error } = await sb.storage
        .from('productos')
        .upload(`${folder}/${baseFilename}`, file, { upsert: true, contentType: file.type })
      if (error) { showToast('Error al subir imagen: ' + error.message, true); setUploadingMain(false); return }
      const { data } = sb.storage.from('productos').getPublicUrl(`${folder}/${baseFilename}`)
      setPImagenUrl(data.publicUrl)
      setUploadingMain(false)
    }

    async function uploadPreview(file: File) {
      if (file.size > 5 * 1024 * 1024) { showToast('Máx 5MB', true); return }
      setUploadingPreview(true)
      const { error } = await sb.storage
        .from('productos')
        .upload(`dijes-preview/${baseFilename}`, file, { upsert: true, contentType: file.type })
      if (error) { showToast('Error al subir preview: ' + error.message, true); setUploadingPreview(false); return }
      const { data } = sb.storage.from('productos').getPublicUrl(`dijes-preview/${baseFilename}`)
      setPPreviewUrl(data.publicUrl)
      setUploadingPreview(false)
    }

    function ZonaImagen({ label, url, uploading, onChange, hint, accept = 'image/*' }: {
      label: string; url: string; uploading: boolean
      onChange: (f: File) => void; hint?: string; accept?: string
    }) {
      return (
        <div style={{ marginBottom: '14px' }}>
          <label style={S.lbl}>{label}</label>
          <label style={{
            border: '0.5px dashed rgba(28,61,46,.22)', padding: '14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            cursor: 'pointer', color: '#3a6b52', textAlign: 'center',
            background: 'var(--crema-dark)', transition: 'background .15s',
          }}>
            <input type="file" accept={accept} style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = '' }} />
            {uploading ? (
              <div style={{ fontSize: '11px', opacity: 0.6 }}>Subiendo…</div>
            ) : url ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <img src={url} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', display: 'block', border: '0.5px solid rgba(28,61,46,.15)' }} />
                <div style={{ fontSize: '9px', color: 'rgba(28,61,46,.45)', letterSpacing: '0.12em' }}>Clic para cambiar</div>
              </div>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 14V6M7 9l3-3 3 3" stroke="#3a6b52" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 14v1.5a2 2 0 002 2h11a2 2 0 002-2V14" stroke="#3a6b52" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <div style={{ fontSize: '11px', letterSpacing: '0.08em' }}>Arrastra o haz clic</div>
                {hint && <div style={{ fontSize: '9px', color: 'rgba(28,61,46,.38)' }}>{hint}</div>}
              </>
            )}
          </label>
        </div>
      )
    }

    return (
      <div>
        <label style={S.lbl}>Nombre del producto</label>
        <input style={S.inp} value={pNombre} onChange={e => setPNombre(e.target.value)} placeholder="Ej: Pulsera Charm Dorada" />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'13px' }}>
          <div>
            <label style={S.lbl}>Categoría</label>
            <select style={S.sel} value={pCatId} onChange={e => setPCatId(e.target.value)}>
              <option value="">Sin categoría</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={S.lbl}>Badge</label>
            <select style={S.sel} value={pBadge} onChange={e => setPBadge(e.target.value)}>
              <option value="">Sin badge</option>
              <option value="Más vendido">Más vendido</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Exclusivo">Exclusivo</option>
            </select>
          </div>
        </div>

        <label style={S.lbl}>Precio (CLP)</label>
        <input style={S.inp} type="number" value={pPrecio} onChange={e => setPPrecio(e.target.value)} placeholder="18990" />

        <label style={S.lbl}>Descripción corta</label>
        <textarea style={S.ta} value={pDesc} onChange={e => setPDesc(e.target.value)} />

        {/* ── Imágenes ── */}
        <div style={{ borderTop: '0.5px solid rgba(28,61,46,.07)', marginTop: '4px', paddingTop: '14px' }}>
          {esDije ? (
            <>
              <ZonaImagen
                label="Imagen normal (con fondo — para card de selección)"
                url={pImagenUrl}
                uploading={uploadingMain}
                onChange={uploadMain}
                hint="JPG o WEBP · Máx 5MB"
              />
              <ZonaImagen
                label="Imagen preview (sin fondo PNG — para preview de pulsera)"
                url={pPreviewUrl}
                uploading={uploadingPreview}
                onChange={uploadPreview}
                accept="image/png"
                hint="Solo PNG transparente · Máx 5MB"
              />
              {pImagenUrl && !pPreviewUrl && (
                <div style={{ fontSize:'10px', color:'#d35400', marginBottom:'10px' }}>
                  ⚠ Sin imagen preview — el dije no se mostrará en el compositor
                </div>
              )}
            </>
          ) : (
            <ZonaImagen
              label={esPulsera ? 'Imagen de la pulsera (también usada en preview de /crear-pulsera)' : 'Imagen del producto'}
              url={pImagenUrl}
              uploading={uploadingMain}
              onChange={uploadMain}
              hint="JPG, PNG o WEBP · Máx 5MB"
            />
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderTop:'0.5px solid rgba(28,61,46,.07)' }}>
          <span style={{ fontSize:'12px', letterSpacing:'0.07em' }}>Visible en la tienda</span>
          <Toggle on={pActivo} onChange={setPActivo} />
        </div>

        <button onClick={guardarProducto} disabled={loading || uploadingMain || uploadingPreview} style={{ ...S.btnPrim, width:'100%', justifyContent:'center', padding:'12px', marginTop:'16px', opacity: (loading || uploadingMain || uploadingPreview) ? 0.7 : 1 }}>
          {loading ? 'Guardando…' : uploadingMain || uploadingPreview ? 'Subiendo imagen…' : mode.type === 'editar-producto' ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    )
  }

  if (mode.type === 'editar-stock' && var_) {
    return (
      <div>
        <div style={{ fontFamily:'var(--ff-serif)', fontSize:'20px', marginBottom:'16px' }}>{var_.producto_nombre}</div>
        <div style={{ fontSize:'12px', color:'#3a6b52', marginBottom:'16px' }}>Variante: {var_.nombre}</div>
        <label style={S.lbl}>Stock actual: {var_.stock}</label>
        <input style={S.inp} type="number" value={newStock} onChange={e => setNewStock(e.target.value)} placeholder="0" />
        <div style={{ fontSize:'12px', color:'#3a6b52', lineHeight:1.8, marginBottom:'16px' }}>
          Actualiza el stock total de esta variante.
        </div>
        <button onClick={guardarStock} disabled={loading} style={{ ...S.btnPrim, width:'100%', justifyContent:'center', padding:'12px' }}>
          {loading ? 'Guardando…' : 'Guardar stock'}
        </button>
      </div>
    )
  }

  if (mode.type === 'ver-orden' && orden) {
    return (
      <div>
        <div style={{ background:'var(--verde)', padding:'22px 24px', marginBottom:'16px' }}>
          <div style={{ fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(200,169,110,.6)', marginBottom:'8px' }}>Número de orden</div>
          <div style={{ fontFamily:'var(--ff-serif)', fontSize:'18px', color:'var(--crema)', marginBottom:'4px' }}>{numOrden(orden.numero)}</div>
          <div style={{ fontSize:'12px', color:'rgba(245,240,232,.4)' }}>{fmtDate(orden.created_at)}{orden.es_regalo ? ' · 🎁 Es un regalo' : ''}</div>
        </div>

        <div style={{ background:'#EDE5D4', padding:'22px 24px', marginBottom:'16px' }}>
          <div style={{ fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#3a6b52', marginBottom:'10px' }}>Cliente</div>
          <div style={{ fontFamily:'var(--ff-serif)', fontSize:'18px', marginBottom:'4px' }}>{orden.cliente_nombre}</div>
          <div style={{ fontSize:'12px', color:'#3a6b52', lineHeight:1.8 }}>
            {orden.cliente_email}<br />
            {orden.cliente_telefono ?? ''}<br />
            {[orden.direccion, orden.ciudad, orden.region].filter(Boolean).join(', ')}
          </div>
        </div>

        {orden.es_regalo && (
          <div style={{ background:'rgba(160,120,48,.1)', border:'0.5px solid rgba(160,120,48,.35)', padding:'22px 24px', marginBottom:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--dorado)', marginBottom:'12px' }}>
              <span>🎁</span> Kit regalo
            </div>
            {(orden.regalo_de || orden.regalo_para) && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom: orden.mensaje_regalo ? '14px' : '0' }}>
                {orden.regalo_de && (
                  <div>
                    <div style={{ fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'#3a6b52', marginBottom:'3px' }}>De</div>
                    <div style={{ fontSize:'13px', color:'var(--verde)' }}>{orden.regalo_de}</div>
                  </div>
                )}
                {orden.regalo_para && (
                  <div>
                    <div style={{ fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'#3a6b52', marginBottom:'3px' }}>Para</div>
                    <div style={{ fontSize:'13px', color:'var(--verde)' }}>{orden.regalo_para}</div>
                  </div>
                )}
              </div>
            )}
            {orden.mensaje_regalo && (
              <>
                <div style={{ fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'#3a6b52', marginBottom:'6px' }}>Mensaje de la tarjeta</div>
                <div style={{ fontSize:'13px', color:'var(--verde)', lineHeight:1.75, fontStyle:'italic' }}>
                  &ldquo;{orden.mensaje_regalo}&rdquo;
                </div>
              </>
            )}
          </div>
        )}

        {(orden.items ?? []).length > 0 && (
          <div style={{ background:'#EDE5D4', padding:'22px 24px', marginBottom:'16px' }}>
            <div style={{ fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#3a6b52', marginBottom:'10px' }}>Productos</div>
            {(orden.items ?? []).map((item, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', paddingBottom:'8px', marginBottom:'8px', borderBottom:'0.5px solid rgba(28,61,46,.08)', fontSize:'12px' }}>
                <div>
                  <div style={{ color:'var(--verde)' }}>{item.nombre}</div>
                  {item.variante && <div style={{ color:'#3a6b52' }}>{item.variante} · ×{item.cantidad}</div>}
                </div>
                <div style={{ fontFamily:'var(--ff-serif)', color:'var(--dorado)' }}>{fmt(item.subtotal)}</div>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--ff-serif)', fontSize:'16px', color:'var(--dorado)' }}>
              <span>Total</span><span>{fmt(orden.total)}</span>
            </div>
          </div>
        )}

        <div style={{ background:'#EDE5D4', padding:'22px 24px', marginBottom:'16px' }}>
          <div style={{ fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#3a6b52', marginBottom:'10px' }}>Despacho</div>
          <div style={{ fontSize:'12px', color:'#3a6b52', lineHeight:1.8 }}>
            Courier: {orden.courier ?? '—'}<br />
            Costo: {orden.costo_despacho != null ? fmt(orden.costo_despacho) : '—'}
            {orden.cupon_codigo && <><br />Cupón: {orden.cupon_codigo}</>}
          </div>
        </div>

        <div style={{ marginBottom:'14px' }}>
          <label style={S.lbl}>Estado del pedido</label>
          <select
            style={{ ...S.sel, marginBottom:'8px' }}
            value={oEstado}
            onChange={e => { setOEstado(e.target.value); cambiarEstadoOrden(e.target.value) }}
          >
            {ESTADOS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
          </select>
          <div style={{ display:'inline-block', fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 8px', background: ESTADO_STYLE[oEstado]?.bg ?? '#eee', color: ESTADO_STYLE[oEstado]?.color ?? '#333' }}>
            {oEstado}
          </div>
        </div>
      </div>
    )
  }

  const cuponForm = (
    <div>
      <label style={S.lbl}>Código del cupón</label>
      <input style={S.inp} value={cCodigo} onChange={e => setCCodigo(e.target.value.toUpperCase())} placeholder="MANTIS10" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'13px' }}>
        <div>
          <label style={S.lbl}>Tipo de descuento</label>
          <select style={S.sel} value={cTipo} onChange={e => setCTipo(e.target.value as typeof cTipo)}>
            <option value="porcentaje">Porcentaje (%)</option>
            <option value="monto_fijo">Monto fijo (CLP)</option>
          </select>
        </div>
        <div>
          <label style={S.lbl}>Valor</label>
          <input style={S.inp} type="number" value={cValor} onChange={e => setCValor(e.target.value)} placeholder={cTipo === 'porcentaje' ? '10' : '5000'} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'13px' }}>
        <div>
          <label style={S.lbl}>Monto mínimo de compra (CLP)</label>
          <input style={S.inp} type="number" value={cMinimo} onChange={e => setCMinimo(e.target.value)} placeholder="15000" />
        </div>
        <div>
          <label style={S.lbl}>Usos máximos (vacío = ilimitado)</label>
          <input style={S.inp} type="number" value={cUsos} onChange={e => setCUsos(e.target.value)} placeholder="100" />
        </div>
      </div>
    </div>
  )

  if (mode.type === 'nuevo-cupon') {
    return (
      <div>
        {cuponForm}
        <button onClick={crearCupon} disabled={loading} style={{ ...S.btnPrim, width:'100%', justifyContent:'center', padding:'12px', marginTop:'4px' }}>
          {loading ? 'Creando…' : 'Crear cupón'}
        </button>
      </div>
    )
  }

  if (mode.type === 'editar-cupon') {
    return (
      <div>
        {cuponForm}
        <button onClick={editarCupon} disabled={loading} style={{ ...S.btnPrim, width:'100%', justifyContent:'center', padding:'12px', marginTop:'4px' }}>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    )
  }

  return null
}

// ── Admin Shell ───────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<Section, string> = {
  productos: 'Productos', ordenes: 'Órdenes', inventario: 'Inventario',
  cupones: 'Cupones', notificaciones: 'Notificaciones', resenas: 'Reseñas', acceso: 'Acceso al panel',
}

const NAV_ICONS: Record<Section, React.ReactNode> = {
  productos: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x=".8" y=".8" width="5.4" height="5.4" rx=".7" stroke="currentColor" strokeWidth="1.1"/><rect x="7.8" y=".8" width="5.4" height="5.4" rx=".7" stroke="currentColor" strokeWidth="1.1"/><rect x=".8" y="7.8" width="5.4" height="5.4" rx=".7" stroke="currentColor" strokeWidth="1.1"/><rect x="7.8" y="7.8" width="5.4" height="5.4" rx=".7" stroke="currentColor" strokeWidth="1.1"/></svg>,
  ordenes:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.1"/><line x1="4" y1="4.5" x2="10" y2="4.5" stroke="currentColor" strokeWidth="1"/><line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1"/><line x1="4" y1="9.5" x2="7.5" y2="9.5" stroke="currentColor" strokeWidth="1"/></svg>,
  inventario:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4.5v5L7 13 1 9.5v-5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M7 1v12M1 4.5l6 3.5L13 4.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  cupones:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 1.5H13V6.5L7 12.5a1.4 1.4 0 01-2 0L1 8.5a1.4 1.4 0 010-2L7 1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><circle cx="10.5" cy="4" r=".9" fill="currentColor"/></svg>,
  notificaciones:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5a4 4 0 014 4v2l1 2H2l1-2v-2a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M5.5 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.1"/></svg>,
  resenas:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.6 3.2 3.5.5-2.5 2.4.6 3.5L7 9.5l-3.2 1.6.6-3.5-2.5-2.4 3.5-.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  acceso:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.1"/><path d="M2 12.5c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
}

function AdminShell({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [section, setSection] = useState<Section>('productos')
  const [topbarAction, setTopbarAction] = useState<React.ReactNode>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null)
  const [confirm, setConfirm] = useState<{ msg: string; onOk: () => void } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const abrirPanel = useCallback((mode: PanelMode) => { setPanelMode(mode); setPanelOpen(true) }, [])
  function cerrarPanel() { setPanelOpen(false); setTimeout(() => setPanelMode(null), 300) }

  function showToast(msg: string, err = false) {
    setToast({ msg, err })
    setTimeout(() => setToast(null), 2300)
  }

  function showConfirm(msg: string, fn: () => void) {
    setConfirm({ msg, onOk: fn })
  }

  function handleConfirmOk() {
    confirm?.onOk()
    setConfirm(null)
  }

  const panelTitle: Record<string, string> = {
    'nuevo-producto': 'Nuevo producto',
    'editar-producto': 'Editar producto',
    'ver-orden': 'Detalle de orden',
    'editar-stock': 'Actualizar stock',
    'nuevo-cupon': 'Nuevo cupón',
    'editar-cupon': 'Editar cupón',
  }

  const sectionProps = { onSetAction: setTopbarAction, onAbrirPanel: abrirPanel, showToast, showConfirm }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'var(--ff-sans)' }}>
      {/* ── Sidebar ── */}
      <div style={{ width:'220px', background:'var(--verde)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'24px 20px 16px' }}>
          <div style={{ fontFamily:'var(--ff-serif)', fontSize:'19px', fontWeight:600, letterSpacing:'0.14em', color:'var(--crema)', lineHeight:1 }}>MANTIS</div>
          <span style={{ fontSize:'8px', letterSpacing:'0.26em', color:'var(--dorado)', textTransform:'uppercase', marginTop:'2px', display:'block' }}>Panel de administración</span>
          <div style={{ height:'0.5px', background:'rgba(245,240,232,.1)', margin:'12px 0' }} />
          <span style={{ fontSize:'9px', letterSpacing:'0.24em', color:'rgba(245,240,232,.3)', textTransform:'uppercase', display:'block', marginBottom:'5px' }}>Gestión</span>
        </div>

        <nav style={{ flex:1, paddingBottom:'8px' }}>
          {(['productos','ordenes','inventario','cupones','notificaciones','resenas'] as Section[]).map(id => (
            <button
              key={id}
              onClick={() => setSection(id)}
              style={{
                display:'flex', alignItems:'center', gap:'9px', padding:'10px 20px',
                fontSize:'11px', letterSpacing:'0.11em', textTransform:'uppercase',
                cursor:'pointer', width:'100%', textAlign:'left', fontFamily:'var(--ff-sans)',
                background: section === id ? 'rgba(245,240,232,.07)' : 'none',
                border:'none',
                borderLeft: section === id ? '2px solid var(--dorado)' : '2px solid transparent',
                color: section === id ? 'var(--crema)' : 'rgba(245,240,232,.4)',
                transition:'all .2s',
              }}
            >
              {NAV_ICONS[id]}{SECTION_LABELS[id]}
            </button>
          ))}
          <div style={{ height:'0.5px', background:'rgba(245,240,232,.1)', margin:'8px 0' }} />
          <span style={{ fontSize:'9px', letterSpacing:'0.24em', color:'rgba(245,240,232,.3)', textTransform:'uppercase', display:'block', padding:'0 20px', marginBottom:'5px' }}>Acceso</span>
          <button
            onClick={() => setSection('acceso')}
            style={{
              display:'flex', alignItems:'center', gap:'9px', padding:'10px 20px',
              fontSize:'11px', letterSpacing:'0.11em', textTransform:'uppercase',
              cursor:'pointer', width:'100%', textAlign:'left', fontFamily:'var(--ff-sans)',
              background: section === 'acceso' ? 'rgba(245,240,232,.07)' : 'none',
              border:'none',
              borderLeft: section === 'acceso' ? '2px solid var(--dorado)' : '2px solid transparent',
              color: section === 'acceso' ? 'var(--crema)' : 'rgba(245,240,232,.4)',
              transition:'all .2s',
            }}
          >
            {NAV_ICONS.acceso}Acceso admin
          </button>
        </nav>

        <div style={{ padding:'16px 20px', borderTop:'0.5px solid rgba(245,240,232,.07)' }}>
          <div style={{ fontSize:'10px', color:'rgba(245,240,232,.35)', letterSpacing:'0.07em', marginBottom:'9px', lineHeight:1.6 }}>
            Sesión como<br /><strong style={{ color:'rgba(245,240,232,.55)' }}>{user.email}</strong>
          </div>
          <button
            onClick={onLogout}
            style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'10px', letterSpacing:'0.13em', color:'rgba(245,240,232,.26)', textTransform:'uppercase', cursor:'pointer', background:'none', border:'none', fontFamily:'var(--ff-sans)' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M5 11.5H3a1 1 0 01-1-1V2.5a1 1 0 011-1h2M9 9.5l3-3-3-3M12 6.5H5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Topbar */}
        <div style={{ padding:'15px 30px', borderBottom:'0.5px solid rgba(28,61,46,.1)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--crema)', flexShrink:0 }}>
          <div style={{ fontFamily:'var(--ff-serif)', fontSize:'23px', fontWeight:300 }}>{SECTION_LABELS[section]}</div>
          <div style={{ display:'flex', gap:'8px' }}>{topbarAction}</div>
        </div>

        {/* Content */}
        <div style={{ padding:'22px 30px', overflowY:'auto', flex:1 }}>
          {section === 'productos'      && <SeccionProductos   key={`p-${refreshKey}`} {...sectionProps} />}
          {section === 'ordenes'        && <SeccionOrdenes     key={`o-${refreshKey}`} {...sectionProps} />}
          {section === 'inventario'     && <SeccionInventario  key={`i-${refreshKey}`} {...sectionProps} />}
          {section === 'cupones'        && <SeccionCupones     key={`c-${refreshKey}`} {...sectionProps} />}
          {section === 'notificaciones' && <SeccionNotificaciones key={`n-${refreshKey}`} onSetAction={setTopbarAction} />}
          {section === 'resenas'        && <SeccionResenas key={`r-${refreshKey}`} onSetAction={setTopbarAction} showToast={showToast} />}
          {section === 'acceso'         && <SeccionAcceso key="ac" onSetAction={setTopbarAction} user={user} />}
        </div>
      </div>

      {/* ── Slide panel overlay ── */}
      {panelOpen && (
        <div onClick={cerrarPanel} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.3)', zIndex:200 }} />
      )}

      {/* ── Slide panel ── */}
      <div style={{
        position:'fixed', top:0, right:0, height:'100vh', width:'420px',
        background:'var(--crema)', zIndex:201,
        transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform .3s cubic-bezier(0.4,0,0.2,1)',
        display:'flex', flexDirection:'column',
        boxShadow:'-4px 0 24px rgba(0,0,0,.1)',
      }}>
        <div style={{ padding:'18px 22px', borderBottom:'0.5px solid rgba(28,61,46,.1)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div style={{ fontFamily:'var(--ff-serif)', fontSize:'21px' }}>{panelMode ? panelTitle[panelMode.type] : ''}</div>
          <button onClick={cerrarPanel} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--verde)', fontSize:'19px', lineHeight:1, padding:0 }}>×</button>
        </div>
        <div style={{ padding:'20px 22px', overflowY:'auto', flex:1 }}>
          {panelMode && (
            <PanelBody
              mode={panelMode}
              onClose={cerrarPanel}
              showToast={showToast}
              onRefresh={() => setRefreshKey(k => k + 1)}
            />
          )}
        </div>
        {panelMode?.type !== 'ver-orden' && (
          <div style={{ padding:'14px 22px', borderTop:'0.5px solid rgba(28,61,46,.1)', display:'flex', gap:'9px', flexShrink:0 }}>
            <button onClick={cerrarPanel} style={{ ...S.btnSec, flex:1, justifyContent:'center' }}>Cancelar</button>
          </div>
        )}
      </div>

      {/* ── Confirm dialog ── */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'var(--crema)', padding:'30px 34px', maxWidth:'330px', width:'90%' }}>
            <div style={{ fontFamily:'var(--ff-serif)', fontSize:'21px', marginBottom:'7px' }}>Confirmar acción</div>
            <p style={{ fontSize:'12px', color:'#3a6b52', lineHeight:1.7, marginBottom:'18px' }}>{confirm.msg}</p>
            <div style={{ display:'flex', gap:'9px' }}>
              <button onClick={handleConfirmOk} style={{ flex:1, background:'#C0392B', color:'#fff', padding:'10px', fontSize:'10px', letterSpacing:'0.17em', textTransform:'uppercase', border:'none', cursor:'pointer', fontFamily:'var(--ff-sans)' }}>Confirmar</button>
              <button onClick={() => setConfirm(null)} style={{ flex:1, background:'transparent', border:'0.5px solid rgba(28,61,46,.2)', color:'var(--verde)', padding:'10px', fontSize:'10px', letterSpacing:'0.17em', textTransform:'uppercase', cursor:'pointer', fontFamily:'var(--ff-sans)' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <div style={{
        position:'fixed', bottom:'22px', left:'50%',
        transform: toast ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
        background: toast?.err ? '#C0392B' : 'var(--verde)',
        color:'var(--crema)', padding:'9px 20px', fontSize:'10px',
        letterSpacing:'0.17em', textTransform:'uppercase', zIndex:500,
        opacity: toast ? 1 : 0, transition:'all .3s', pointerEvents:'none',
      }}>
        {toast?.msg}
      </div>
    </div>
  )
}

// ── Admin Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const sb = createClient()

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await sb.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#EDE5D4' }}>
        <span style={{ fontSize:'12px', color:'#3a6b52', letterSpacing:'0.2em' }}>Cargando…</span>
      </div>
    )
  }

  if (!user) return <LoginPanel onLogin={setUser} />
  return <AdminShell user={user} onLogout={handleLogout} />
}
