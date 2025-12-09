import { prisma } from '@/lib/prisma'
import EditableProductRow from '@/components/EditableProductRow'

export const dynamic = 'force-dynamic'

export default async function ProductosPage() {
  const [productos, proveedores] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: 'asc' } }),
    prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
  ])
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-medium">Productos</h2>
      <form className="bg-white p-4 rounded border" action="/api/productos" method="post">
        <div className="grid grid-cols-3 gap-3">
          <input name="name" placeholder="Nombre" className="border p-2 rounded" required />
          <input name="barcode" placeholder="Código de barras" className="border p-2 rounded" />
          <input name="price" placeholder="Precio" type="number" step="0.01" className="border p-2 rounded" required />
          <input name="stock" placeholder="Stock inicial" type="number" className="border p-2 rounded" defaultValue={0} />
          <select name="supplierId" className="border p-2 rounded">
            <option value="">Proveedor (opcional)</option>
            {proveedores.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </select>
        </div>
        <button className="mt-3 px-3 py-2 bg-blue-600 text-white rounded">Agregar</button>
      </form>

      <table className="w-full bg-white rounded border">
        <thead>
          <tr className="text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Código</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <EditableProductRow key={p.id} product={p as any} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
