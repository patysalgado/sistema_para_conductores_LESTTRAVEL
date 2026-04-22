'use client'
import { useState, useEffect } from 'react'
import styles from './ServiceForm.module.css'

export default function ServiceForm({ onClose, initialData = null, onSave }) {
  const [formData, setFormData] = useState({
    conductor: '',
    fecha_servicio: '',
    hora_servicio: '',
    fecha_limite: '',
    precio: '',
    origen: '',
    destino: '',
    combustible: 0,
    gastos: 0,
    observaciones: '',
    estado: 'Pendiente'
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        fecha_servicio: initialData.fecha_servicio.split('T')[0],
        fecha_limite: initialData.fecha_limite.split('T')[0],
      })
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user'))
    
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch('/api/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, creado_por_id: user.id })
    })

    const data = await res.json()

    if (res.ok) {
      onSave()
      onClose()
    } else {
      alert('Error: ' + (data.error || 'No se pudo guardar el servicio'))
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={`glass-panel ${styles.modal}`}>
        <h2>{initialData ? 'Editar' : 'Registrar'} Servicio</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.group}>
              <label>Conductor</label>
              <input type="text" className="input-field" required value={formData.conductor}
                onChange={(e) => setFormData({...formData, conductor: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Precio ($)</label>
              <input type="number" className="input-field" required value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Fecha Servicio</label>
              <input type="date" className="input-field" required value={formData.fecha_servicio}
                onChange={(e) => setFormData({...formData, fecha_servicio: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Hora del Servicio</label>
              <input type="time" className="input-field" value={formData.hora_servicio || ''}
                onChange={(e) => setFormData({...formData, hora_servicio: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Fecha Límite</label>
              <input type="date" className="input-field" required value={formData.fecha_limite}
                onChange={(e) => setFormData({...formData, fecha_limite: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Origen</label>
              <input type="text" className="input-field" required value={formData.origen}
                onChange={(e) => setFormData({...formData, origen: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Destino</label>
              <input type="text" className="input-field" required value={formData.destino}
                onChange={(e) => setFormData({...formData, destino: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Combustible ($)</label>
              <input type="number" className="input-field" value={formData.combustible || 0}
                onChange={(e) => setFormData({...formData, combustible: e.target.value})} />
            </div>
            <div className={styles.group}>
              <label>Gastos Extras ($)</label>
              <input type="number" className="input-field" value={formData.gastos || 0}
                onChange={(e) => setFormData({...formData, gastos: e.target.value})} />
            </div>
            {initialData && (
              <div className={styles.group}>
                <label>Estado</label>
                <select className="input-field" value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En curso">En curso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            )}
          </div>
          <div className={styles.group}>
            <label>Observaciones</label>
            <textarea className="input-field" rows="3" value={formData.observaciones || ''}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}></textarea>
          </div>
          
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
