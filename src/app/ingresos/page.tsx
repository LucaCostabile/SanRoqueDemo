import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

import IngresosClient from './ingresos-client'

export default async function IngresosPage() {
  const proveedores = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })
  // Para el cliente, ya filtrará productos por proveedor seleccionado
  const productos = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-medium">Ingreso de mercadería</h2>
      <IngresosClient proveedores={proveedores as any} productos={productos as any} />
      <form className="bg-white p-4 rounded border" action="/api/proveedores" method="post">
        <div className="grid grid-cols-3 gap-3">
          <input name="name" placeholder="Nuevo proveedor" className="border p-2 rounded" required />
          <input name="phone" placeholder="Teléfono" className="border p-2 rounded" />
          <button className="px-3 py-2 bg-gray-800 text-white rounded">Agregar proveedor</button>
        </div>
      </form>
    </div>
  )
}
