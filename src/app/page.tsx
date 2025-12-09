export default function HomePage() {
  return (
    <div className="grid gap-4">
      <section className="bg-white p-4 rounded border">
        <h2 className="text-lg font-medium">Accesos rápidos</h2>
        <div className="mt-3 flex gap-3">
          <a className="px-3 py-2 bg-blue-600 text-white rounded" href="/ventas">Nueva venta</a>
          <a className="px-3 py-2 bg-green-600 text-white rounded" href="/ingresos">Ingresar mercadería</a>
          <a className="px-3 py-2 bg-gray-800 text-white rounded" href="/productos">Productos</a>
        </div>
      </section>
    </div>
  )
}
