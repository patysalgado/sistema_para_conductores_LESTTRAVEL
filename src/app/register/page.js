'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../page.module.css' // Reutilizamos estilos de login

export default function Register() {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    const data = await res.json()
    if (res.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.')
      router.push('/')
    } else {
      setError(data.error)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.loginBox}`}>
        <h1 className={styles.title}>Registro de Conductor</h1>
        <p className={styles.subtitle}>Crea tu cuenta para empezar a trabajar.</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
          <div className={styles.formGroup}>
            <label>Nombre Completo</label>
            <input type="text" className="input-field" required 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label>Correo Electrónico</label>
            <input type="email" className="input-field" required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input type="password" className="input-field" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
          
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem' }}>
            ¿Ya tienes cuenta? <a href="/" style={{ color: '#60a5fa' }}>Inicia sesión aquí</a>
          </p>
        </form>
      </div>
    </div>
  )
}
