'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        // Guardar sesión simple en localStorage para este demo
        localStorage.setItem('user', JSON.stringify(data))
        router.push('/dashboard')
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.loginBox}`}>
        <h1 className={styles.title}>Driver Sync</h1>
        <p className={styles.subtitle}>Inicia sesión para gestionar los servicios.</p>
        
        <form className={styles.form} onSubmit={handleLogin}>
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
          
          <div className={styles.formGroup}>
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="correo@ejemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Ingresar al Sistema'}
          </button>

          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', textAlign: 'center' }}>
            ¿Eres un conductor nuevo? <a href="/register" style={{ color: '#60a5fa' }}>Regístrate aquí</a>
          </p>
        </form>
      </div>
      
      {/* Background decoration */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
    </div>
  )
}
