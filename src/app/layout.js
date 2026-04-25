import './globals.css'

export const metadata = {
  title: 'Sistema de Registro de Conductores',
  description: 'Gestión de viajes y conductores',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#60a5fa" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  )
}
