'use client'
import { useState, useEffect } from 'react'
import styles from './dashboard.module.css'
import ServiceForm from '@/components/ServiceForm'

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [services, setServices] = useState([])
  const [editingService, setEditingService] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'))
    setUser(savedUser)
    fetchServices(savedUser)
  }, [])

  const fetchServices = async (currentUser) => {
    if (!currentUser) return
    const res = await fetch(`/api/services?userId=${currentUser.id}&rol=${currentUser.rol}`)
    const data = await res.json()
    setServices(data)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingService(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este viaje?')) return
    const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchServices(user)
    } else {
      alert('Error al eliminar')
    }
  }

  if (!user) return <p>Cargando...</p>

  const stats = {
    pendiente: services.filter(s => s.estado === 'Pendiente').length,
    enCurso: services.filter(s => s.estado === 'En curso').length,
    completado: services.filter(s => s.estado === 'Completado').length
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className={styles.pageTitle}>Resumen para {user.nombre}</h1>
        {user.rol === 'admin' && <span className="badge en-curso">ADMINISTRADOR</span>}
      </div>
      
      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <h4>Pendientes</h4>
          <span className={styles.statValue}>{stats.pendiente}</span>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <h4>En Curso</h4>
          <span className={styles.statValue}>{stats.enCurso}</span>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <h4>Completados</h4>
          <span className={styles.statValue}>{stats.completado}</span>
        </div>
      </div>

      <div className={`glass-panel ${styles.tableContainer}`}>
        <div className={styles.tableHeader}>
          <h3>{user.rol === 'admin' ? 'Todos los Servicios' : 'Mis Servicios'}</h3>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Servicio</button>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Conductor</th>
              <th>Ruta</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.conductor}</td>
                <td>{service.origen} → {service.destino}</td>
                <td>{new Date(service.fecha_servicio).toLocaleDateString('es-EC', { timeZone: 'UTC' })}</td>
                <td>
                  <span className={`badge ${service.estado.toLowerCase().replace(' ', '-')}`}>
                    {service.estado}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button onClick={() => handleEdit(service)} style={{ color: '#60a5fa', fontWeight: '600' }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(service.id)} style={{ color: '#ef4444', fontWeight: '600' }}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No hay servicios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ServiceForm 
          onClose={handleCloseModal} 
          initialData={editingService}
          onSave={() => fetchServices(user)}
        />
      )}
    </div>
  )
}
