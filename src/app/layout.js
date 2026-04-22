import './globals.css'

export const metadata = {
  title: 'Sistema de Registro de Conductores',
  description: 'Gestión de viajes y conductores',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  )
}
