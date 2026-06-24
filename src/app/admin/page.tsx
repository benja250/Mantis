'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type Section = 'ordenes' | 'productos' | 'inventario' | 'cupones' | 'notificaciones'

/* ─── Login ─── */

function LoginPanel({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recovery, setRecovery] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)

  const sb = createClient()

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { data, error: err } = await sb.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    if (data.user) onLogin(data.user)
  }

  async function handleRecovery(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setRecoverySent(true)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--crema-dark)',
    }}>
      <div style={{
        width: '380px', background: 'var(--crema)', padding: '48px 40px',
        border: '0.5px solid rgba(28,61,46,0.12)',
      }}>
        <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', color: 'var(--verde)', marginBottom: '8px', letterSpacing: '0.1em' }}>
          MANTIS
        </div>
        <p style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--dorado)', marginBottom: '36px' }}>
          Panel de administración
        </p>

        {!recovery ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input className="checkout-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>
                Contraseña
              </label>
              <input className="checkout-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && <p style={{ fontSize: '11px', color: '#C0392B' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '14px',
              fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.24em',
              textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" onClick={() => setRecovery(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '10px', color: '#3a6b52', letterSpacing: '0.1em',
            }}>
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        ) : recoverySent ? (
          <p style={{ fontSize: '13px', color: 'var(--verde)', lineHeight: 1.8 }}>
            Revisa tu email — te enviamos un enlace para recuperar tu contraseña.
          </p>
        ) : (
          <form onSubmit={handleRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: '#3a6b52' }}>Ingresa tu email y te enviamos un enlace de recuperación.</p>
            <div>
              <label style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input className="checkout-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <p style={{ fontSize: '11px', color: '#C0392B' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '14px',
              fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.24em',
              textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <button type="button" onClick={() => setRecovery(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', color: '#3a6b52',
            }}>
              ← Volver
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ─── Sidebar nav ─── */

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'ordenes',        label: 'Órdenes' },
  { id: 'productos',      label: 'Productos' },
  { id: 'inventario',     label: 'Inventario' },
  { id: 'cupones',        label: 'Cupones' },
  { id: 'notificaciones', label: 'Notificaciones' },
]

/* ─── Sección Órdenes ─── */

const ESTADOS_ORDEN = ['pendiente', 'confirmado', 'procesando', 'despachado', 'entregado'] as const
type EstadoOrden = typeof ESTADOS_ORDEN[number]

interface Orden {
  id: string; numero: string; cliente: string; email: string
  total: number; estado: EstadoOrden; es_regalo: boolean; fecha: string
}

const ORDENES_MOCK: Orden[] = [
  { id: '1', numero: 'MTS-001', cliente: 'María González', email: 'maria@correo.cl', total: 18990, estado: 'pendiente', es_regalo: false, fecha: '2026-06-17' },
  { id: '2', numero: 'MTS-002', cliente: 'Ana Soto',       email: 'ana@correo.cl',   total: 37980, estado: 'confirmado', es_regalo: true,  fecha: '2026-06-16' },
  { id: '3', numero: 'MTS-003', cliente: 'Javiera Torres', email: 'javi@correo.cl',  total: 16990, estado: 'despachado', es_regalo: false, fecha: '2026-06-15' },
]

const ESTADO_COLORS: Record<EstadoOrden, string> = {
  pendiente: '#C0392B', confirmado: '#2980b9', procesando: '#8e44ad',
  despachado: '#d35400', entregado: '#27ae60',
}

function SeccionOrdenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>(ORDENES_MOCK)
  const [selected, setSelected] = useState<Orden | null>(null)

  function cambiarEstado(id: string, estado: EstadoOrden) {
    setOrdenes(prev => prev.map(o => o.id === id ? { ...o, estado } : o))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, estado } : null)
  }

  function exportarExcel() {
    const csv = ['Número,Cliente,Email,Total,Estado,Regalo,Fecha',
      ...ordenes.map(o => `${o.numero},${o.cliente},${o.email},${o.total},${o.estado},${o.es_regalo ? 'Sí' : 'No'},${o.fecha}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'ordenes-mantis.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', fontWeight: 300, color: 'var(--verde)' }}>Órdenes</h2>
        <button onClick={exportarExcel} style={{
          background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', color: 'var(--verde)',
          padding: '8px 18px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.18em',
          textTransform: 'uppercase', fontFamily: 'var(--ff-sans)',
        }}>
          Exportar CSV
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(28,61,46,0.08)' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '120px 1fr 160px 100px 160px',
          background: 'var(--crema-dark)', padding: '10px 16px', gap: '12px',
        }}>
          {['N° Orden', 'Cliente', 'Total', 'Regalo', 'Estado'].map(h => (
            <span key={h} style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52' }}>{h}</span>
          ))}
        </div>
        {ordenes.map(o => (
          <div
            key={o.id}
            onClick={() => setSelected(o)}
            style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 160px 100px 160px',
              background: selected?.id === o.id ? 'rgba(28,61,46,0.04)' : 'var(--crema)',
              padding: '14px 16px', gap: '12px', cursor: 'pointer', alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--verde)', fontFamily: 'var(--ff-sans)' }}>{o.numero}</span>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--verde)' }}>{o.cliente}</p>
              <p style={{ fontSize: '10px', color: '#3a6b52' }}>{o.email}</p>
            </div>
            <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '15px', color: 'var(--dorado)' }}>
              ${o.total.toLocaleString('es-CL')}
            </span>
            <span style={{ fontSize: '11px', color: o.es_regalo ? 'var(--dorado)' : '#3a6b52' }}>
              {o.es_regalo ? '🎁 Sí' : 'No'}
            </span>
            <span style={{
              fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: ESTADO_COLORS[o.estado], background: `${ESTADO_COLORS[o.estado]}15`,
              padding: '4px 10px', display: 'inline-block',
            }}>
              {o.estado}
            </span>
          </div>
        ))}
      </div>

      {/* Panel detalle / cambiar estado */}
      {selected && (
        <div style={{
          position: 'fixed', right: '0', top: '0', bottom: '0', width: '380px',
          background: 'var(--crema)', borderLeft: '0.5px solid rgba(28,61,46,0.1)',
          padding: '32px 28px', zIndex: 100, overflowY: 'auto',
        }}>
          <button onClick={() => setSelected(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#3a6b52', padding: '0 0 20px', display: 'block',
          }}>
            × Cerrar
          </button>
          <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--verde)', marginBottom: '16px' }}>
            {selected.numero}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            <p style={{ fontSize: '13px', color: 'var(--verde)' }}>{selected.cliente}</p>
            <p style={{ fontSize: '12px', color: '#3a6b52' }}>{selected.email}</p>
            <p style={{ fontSize: '12px', color: '#3a6b52' }}>{selected.fecha}</p>
            {selected.es_regalo && <p style={{ fontSize: '12px', color: 'var(--dorado)' }}>🎁 Pedido regalo</p>}
            <p style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', color: 'var(--dorado)' }}>
              ${selected.total.toLocaleString('es-CL')}
            </p>
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '12px' }}>
            Cambiar estado
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ESTADOS_ORDEN.map(est => (
              <button
                key={est}
                onClick={() => cambiarEstado(selected.id, est)}
                style={{
                  textAlign: 'left', padding: '12px 16px', cursor: 'pointer',
                  border: selected.estado === est ? '0.5px solid var(--verde)' : '0.5px solid rgba(28,61,46,0.15)',
                  background: selected.estado === est ? 'rgba(28,61,46,0.04)' : 'transparent',
                  fontSize: '12px', color: selected.estado === est ? 'var(--verde)' : '#3a6b52',
                  fontFamily: 'var(--ff-sans)', textTransform: 'capitalize',
                }}
              >
                {est}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Sección Cupones ─── */

interface Cupon {
  id: string; codigo: string; tipo: 'porcentaje' | 'monto'; valor: number; activo: boolean
}

const CUPONES_MOCK: Cupon[] = [
  { id: '1', codigo: 'MANTIS10', tipo: 'porcentaje', valor: 10, activo: true },
  { id: '2', codigo: 'VERANO2026', tipo: 'monto', valor: 5000, activo: false },
]

function SeccionCupones() {
  const [cupones, setCupones] = useState<Cupon[]>(CUPONES_MOCK)
  const [nuevo, setNuevo] = useState({ codigo: '', tipo: 'porcentaje' as 'porcentaje' | 'monto', valor: '' })

  function toggleActivo(id: string) {
    setCupones(prev => prev.map(c => c.id === id ? { ...c, activo: !c.activo } : c))
  }

  function eliminar(id: string) {
    setCupones(prev => prev.filter(c => c.id !== id))
  }

  function agregar() {
    if (!nuevo.codigo || !nuevo.valor) return
    setCupones(prev => [...prev, {
      id: Date.now().toString(), codigo: nuevo.codigo.toUpperCase(),
      tipo: nuevo.tipo, valor: Number(nuevo.valor), activo: true,
    }])
    setNuevo({ codigo: '', tipo: 'porcentaje', valor: '' })
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
        Cupones
      </h2>

      {/* Crear cupón */}
      <div style={{ background: 'var(--crema-dark)', padding: '24px 28px', marginBottom: '28px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '16px' }}>
          Nuevo cupón
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 160px auto', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>Código</label>
            <input className="checkout-input" value={nuevo.codigo} onChange={e => setNuevo(p => ({ ...p, codigo: e.target.value.toUpperCase() }))} placeholder="MANTIS20" />
          </div>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>Tipo</label>
            <div style={{ position: 'relative' }}>
              <select className="checkout-select" value={nuevo.tipo} onChange={e => setNuevo(p => ({ ...p, tipo: e.target.value as 'porcentaje' | 'monto' }))}>
                <option value="porcentaje">Porcentaje</option>
                <option value="monto">Monto fijo</option>
              </select>
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px', color: '#3a6b52' }}>▾</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>
              Valor {nuevo.tipo === 'porcentaje' ? '(%)' : '(CLP)'}
            </label>
            <input className="checkout-input" type="number" value={nuevo.valor} onChange={e => setNuevo(p => ({ ...p, valor: e.target.value }))} placeholder={nuevo.tipo === 'porcentaje' ? '10' : '5000'} />
          </div>
          <button onClick={agregar} style={{
            background: 'var(--verde)', color: 'var(--crema)', border: 'none',
            padding: '12px 20px', cursor: 'pointer', fontFamily: 'var(--ff-sans)',
            fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            + Crear
          </button>
        </div>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(28,61,46,0.08)' }}>
        {cupones.map(c => (
          <div key={c.id} style={{
            display: 'grid', gridTemplateColumns: '160px 140px 120px 1fr auto auto',
            background: 'var(--crema)', padding: '16px 20px', gap: '16px', alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'var(--ff-sans)', fontSize: '13px', color: 'var(--verde)', letterSpacing: '0.08em' }}>{c.codigo}</span>
            <span style={{ fontSize: '12px', color: '#3a6b52', textTransform: 'capitalize' }}>{c.tipo}</span>
            <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '15px', color: 'var(--dorado)' }}>
              {c.tipo === 'porcentaje' ? `${c.valor}%` : `$${c.valor.toLocaleString('es-CL')}`}
            </span>
            <span style={{
              fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: c.activo ? '#27ae60' : '#C0392B',
              background: c.activo ? '#27ae6015' : '#C0392B15',
              padding: '4px 10px', display: 'inline-block', width: 'fit-content',
            }}>
              {c.activo ? 'Activo' : 'Inactivo'}
            </span>
            <button onClick={() => toggleActivo(c.id)} style={{
              background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', cursor: 'pointer',
              padding: '6px 12px', fontSize: '9px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--verde)', fontFamily: 'var(--ff-sans)',
            }}>
              {c.activo ? 'Desactivar' : 'Activar'}
            </button>
            <button onClick={() => eliminar(c.id)} style={{
              background: 'none', border: '0.5px solid rgba(192,57,43,0.3)', cursor: 'pointer',
              padding: '6px 12px', fontSize: '9px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#C0392B', fontFamily: 'var(--ff-sans)',
            }}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Sección Inventario ─── */

interface InventarioItem {
  slug: string; nombre: string; variante: string; stock: number
}

const INVENTARIO_MOCK: InventarioItem[] = [
  { slug: 'pulsera-charm-dorada', nombre: 'Pulsera Charm Dorada', variante: 'S — 15 cm', stock: 5 },
  { slug: 'pulsera-charm-dorada', nombre: 'Pulsera Charm Dorada', variante: 'M — 17 cm', stock: 8 },
  { slug: 'pulsera-charm-dorada', nombre: 'Pulsera Charm Dorada', variante: 'L — 19 cm', stock: 3 },
  { slug: 'pulsera-luna-stars',   nombre: 'Pulsera Luna & Stars', variante: 'S — 15 cm', stock: 4 },
  { slug: 'pulsera-luna-stars',   nombre: 'Pulsera Luna & Stars', variante: 'L — 19 cm', stock: 1 },
]

function SeccionInventario() {
  const [items, setItems] = useState<InventarioItem[]>(INVENTARIO_MOCK)

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
        Inventario
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(28,61,46,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 120px 140px', background: 'var(--crema-dark)', padding: '10px 20px', gap: '12px' }}>
          {['Producto', 'Variante', 'Stock', 'Alerta'].map(h => (
            <span key={h} style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52' }}>{h}</span>
          ))}
        </div>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 200px 120px 140px',
            background: 'var(--crema)', padding: '14px 20px', gap: '12px', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--verde)' }}>{item.nombre}</span>
            <span style={{ fontSize: '12px', color: '#3a6b52' }}>{item.variante}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => setItems(p => p.map((x, j) => j === i ? { ...x, stock: Math.max(0, x.stock - 1) } : x))}
                style={{ background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', width: '24px', height: '24px', cursor: 'pointer', color: 'var(--verde)', fontSize: '14px' }}>−</button>
              <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '16px', color: item.stock <= 3 ? '#C0392B' : 'var(--verde)', minWidth: '20px', textAlign: 'center' }}>
                {item.stock}
              </span>
              <button onClick={() => setItems(p => p.map((x, j) => j === i ? { ...x, stock: x.stock + 1 } : x))}
                style={{ background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', width: '24px', height: '24px', cursor: 'pointer', color: 'var(--verde)', fontSize: '14px' }}>+</button>
            </div>
            <span style={{
              fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: item.stock === 0 ? '#C0392B' : item.stock <= 8 ? '#d35400' : '#27ae60',
            }}>
              {item.stock === 0 ? 'Agotado' : item.stock <= 8 ? `Stock bajo (${item.stock})` : 'OK'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Sección placeholder ─── */
function SeccionProxima({ title }: { title: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ fontFamily: 'var(--ff-serif)', fontSize: '24px', fontWeight: 300, color: 'var(--verde)', marginBottom: '12px' }}>{title}</p>
      <p style={{ fontSize: '11px', color: '#3a6b52' }}>Conectado a Supabase — listo para implementar con datos reales.</p>
    </div>
  )
}

/* ─── Admin shell ─── */

function AdminShell({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [section, setSection] = useState<Section>('ordenes')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        background: 'var(--verde)', padding: '0',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '28px 24px', borderBottom: '0.5px solid rgba(245,240,232,0.1)' }}>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', color: 'var(--crema)', letterSpacing: '0.14em', marginBottom: '4px' }}>
            MANTIS
          </div>
          <p style={{ fontSize: '9px', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Admin
          </p>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {SECTIONS.map(({ id, label }) => (
            <button key={id} onClick={() => setSection(id)} style={{
              width: '100%', textAlign: 'left', background: section === id ? 'rgba(245,240,232,0.1)' : 'none',
              border: 'none', padding: '14px 24px', cursor: 'pointer',
              fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: section === id ? 'var(--crema)' : 'rgba(245,240,232,0.5)',
              transition: 'all 0.15s',
              borderLeft: section === id ? '2px solid var(--dorado)' : '2px solid transparent',
            }}>
              {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 24px', borderTop: '0.5px solid rgba(245,240,232,0.1)' }}>
          <p style={{ fontSize: '10px', color: 'rgba(245,240,232,0.5)', marginBottom: '10px', letterSpacing: '0.06em' }}>
            {user.email}
          </p>
          <button onClick={onLogout} style={{
            background: 'none', border: '0.5px solid rgba(245,240,232,0.2)', color: 'rgba(245,240,232,0.6)',
            padding: '7px 14px', cursor: 'pointer', fontSize: '9px',
            letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)',
          }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '48px', background: 'var(--crema)', overflowY: 'auto' }}>
        {section === 'ordenes'        && <SeccionOrdenes />}
        {section === 'cupones'        && <SeccionCupones />}
        {section === 'inventario'     && <SeccionInventario />}
        {section === 'productos'      && <SeccionProxima title="Gestión de productos" />}
        {section === 'notificaciones' && <SeccionProxima title="Notificaciones" />}
      </div>
    </div>
  )
}

/* ─── Página principal ─── */

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', color: '#3a6b52', letterSpacing: '0.2em' }}>Cargando...</span>
      </div>
    )
  }

  if (!user) return <LoginPanel onLogin={setUser} />

  return <AdminShell user={user} onLogout={handleLogout} />
}
