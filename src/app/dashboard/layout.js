'use client'
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <div className={styles.layout}>
      <aside className={`glass-panel ${styles.sidebar}`}>
        <h2 className={styles.brand}>Driver Sync</h2>
        <nav className={styles.nav}>
          <a href="/dashboard" className={styles.navItem}>Inicio</a>
          <a href="/dashboard/perfil" className={styles.navItem}>Mi Perfil</a>
          <a href="#" onClick={handleLogout} className={styles.navItem}>Cerrar Sesión</a>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h3>Panel de Control</h3>
          <a href="/dashboard/perfil" className={styles.userProfile}>👤 Mi Perfil</a>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}
