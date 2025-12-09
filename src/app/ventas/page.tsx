import { prisma } from '@/lib/prisma'
import VentasClient from './ventas-client'

export const dynamic = 'force-dynamic'

async function productosOrdenadosPorVentas() {
  const top = await prisma.saleItem.groupBy({ by: ['productId'], _sum: { qty: true } })
  const sumById = new Map(top.map(t => [t.productId, t._sum.qty || 0]))
  const productos = await prisma.product.findMany()
  return productos.sort((a, b) => (sumById.get(b.id) || 0) - (sumById.get(a.id) || 0) || a.name.localeCompare(b.name))
}

export default async function VentasPage() {
  const productos = await productosOrdenadosPorVentas()
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-medium">Registro rápido de ventas</h2>
      <VentasClient productos={productos as any} />
    </div>
  )
}
