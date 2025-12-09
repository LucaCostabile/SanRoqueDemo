import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'San Roque Demo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto p-4">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{process.env.NEXT_PUBLIC_APP_NAME || 'San Roque Demo'}</h1>
            <nav className="flex gap-3 text-sm">
              <a href="/" className="hover:underline">Inicio</a>
              <a href="/productos" className="hover:underline">Productos</a>
              <a href="/ventas" className="hover:underline">Ventas</a>
              <a href="/ingresos" className="hover:underline">Ingresos</a>
              <a href="/estadisticas" className="hover:underline">Estadísticas</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
