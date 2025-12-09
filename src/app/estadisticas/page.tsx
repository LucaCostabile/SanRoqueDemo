import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getData() {
  const todayStart = new Date()
  todayStart.setHours(0,0,0,0)
  const ventasHoy = await prisma.sale.aggregate({
    _sum: { total: true },
    where: { createdAt: { gte: todayStart } }
  })
  const topVendidos = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: { qty: true },
    orderBy: { _sum: { qty: 'desc' } },
    take: 5,
  })
  const productos = await prisma.product.findMany({
    where: { id: { in: topVendidos.map(t => t.productId) } }
  })
  const mapNombre = new Map(productos.map(p => [p.id, p.name]))
  return { ventasHoy: ventasHoy._sum.total || 0, topVendidos: topVendidos.map(t => ({ name: mapNombre.get(t.productId) || `#${t.productId}`, qty: t._sum.qty || 0 })) }
}

export default async function EstadisticasPage() {
  const data = await getData()
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-medium">Estadísticas</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded border">
          <h3 className="font-medium">Ventas del día</h3>
          <p className="text-2xl mt-2">${data.ventasHoy.toString()}</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-medium">Top vendidos</h3>
          <ul className="mt-2">
            {data.topVendidos.map((v, i) => (
              <li key={i} className="flex justify-between border-t py-1"><span>{v.name}</span><span>x{v.qty}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
