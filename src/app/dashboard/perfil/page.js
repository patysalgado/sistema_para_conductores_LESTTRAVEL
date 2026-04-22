'use client'
import { useEffect, useState } from 'react'
import styles from '../dashboard.module.css'

export default function Perfil() {
  const [user, setUser] = useState(null)
  const [services, setServices] = useState([])
  const [phone, setPhone] = useState('')
  const [phone2, setPhone2] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'))
    setUser(savedUser)
    if (savedUser) {
      fetchServices(savedUser)
      // Cargar teléfonos actuales (En un sistema real los traeríamos de la API)
      setPhone(savedUser.telefono_notificacion || '')
      setPhone2(savedUser.telefono_notificacion_2 || '')
    }
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    const res = await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: user.id, 
        telefono_notificacion: phone,
        telefono_notificacion_2: phone2 
      })
    })

    if (res.ok) {
      const updated = await res.json()
      localStorage.setItem('user', JSON.stringify({ ...user, ...updated }))
      alert('Perfil actualizado correctamente')
    } else {
      alert('Error al actualizar el perfil')
    }
    setSaving(false)
  }

  const fetchServices = async (currentUser) => {
    const res = await fetch(`/api/services?userId=${currentUser.id}&rol=${currentUser.rol}`)
    const data = await res.json()
    setServices(data)
  }

  if (!user) return <p>Cargando...</p>

  const totalRecaudado = services.reduce((acc, s) => acc + s.precio, 0)
  const totalCombustible = services.reduce((acc, s) => acc + s.combustible, 0)
  const totalNeto = totalRecaudado - totalCombustible - services.reduce((acc, s) => acc + s.gastos, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className={`glass-panel`}>
        <h1 className={styles.pageTitle}>Mi Perfil</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Nombre</label>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user.nombre}</p>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Email</label>
            <p style={{ fontSize: '1.1rem' }}>{user.email}</p>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Teléfono Principal (WhatsApp)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: 593999999999" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Teléfono Secundario (WhatsApp)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: 593888888888" 
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={handleSaveProfile} 
            className="btn-primary" 
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button 
            onClick={async () => {
              if (!phone) return alert('Pon un número primero');
              const res = await fetch('/api/user/test-whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
              });
              const data = await res.json();
              alert(data.message || data.error);
            }} 
            className="btn-secondary"
            style={{ backgroundColor: '#25d366', color: 'white', border: 'none' }}
          >
            Enviar Mensaje de Prueba
          </button>
        </div>
      </div>

      <div className={`glass-panel`}>
        <h3 style={{ marginBottom: '1.5rem' }}>Resumen de Ganancias y Combustible</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h4>Total Recaudado</h4>
            <span className={styles.statValue}>${totalRecaudado.toFixed(2)}</span>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '1px solid var(--border)' }}>
            <h4>Total Combustible</h4>
            <span className={styles.statValue} style={{ color: 'var(--danger)' }}>${totalCombustible.toFixed(2)}</span>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '1px solid var(--border)' }}>
            <h4>Ganancia Neta</h4>
            <span className={styles.statValue} style={{ color: 'var(--success)' }}>${totalNeto.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={`glass-panel`}>
        <h3 style={{ marginBottom: '1.5rem' }}>Hoja de Servicios</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ruta</th>
              <th>Precio</th>
              <th>Combustible</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{new Date(s.fecha_servicio).toLocaleDateString('es-EC', { timeZone: 'UTC' })} {s.hora_servicio}</td>
                <td>{s.origen} → {s.destino}</td>
                <td>${s.precio.toFixed(2)}</td>
                <td>${s.combustible.toFixed(2)}</td>
                <td><span className={`badge ${s.estado.toLowerCase().replace(' ', '-')}`}>{s.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
