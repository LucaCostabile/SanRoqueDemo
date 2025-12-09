import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Espera { supplierId, items: [{ productId, qty, cost }] }
export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || ''
  let supplierId: number | null = null
  let items: Array<{ productId: number; qty: number; cost: number }> = []
  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => null)
    supplierId = Number(body?.supplierId) || null
    items = Array.isArray(body?.items) ? body!.items : []
  } else {
    const fd = await req.formData()
    supplierId = Number(fd.get('supplierId')) || null
    const raw = fd.get('items')?.toString() ?? '[]'
    try { items = JSON.parse(raw) } catch { items = [] }
  }
  if (!supplierId) return NextResponse.json({ error: 'Proveedor inválido' }, { status: 400 })
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'Sin items' }, { status: 400 })

  const productIds = items.map(i => Number(i.productId))
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, supplierId } })
  const map = new Map(products.map(p => [p.id, p]))
  for (const i of items) {
    const p = map.get(Number(i.productId))
    const qty = Number(i.qty)
    const cost = Number(i.cost)
    if (!p) return NextResponse.json({ error: `Producto ${i.productId} no encontrado para proveedor` }, { status: 404 })
    if (isNaN(qty) || qty <= 0) return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
    if (isNaN(cost) || cost < 0) return NextResponse.json({ error: 'Costo inválido' }, { status: 400 })
  }

  const inbound = await prisma.$transaction(async (tx) => {
    const inbound = await tx.inbound.create({ data: { supplierId } })
    for (const i of items) {
      await tx.inboundItem.create({ data: { inboundId: inbound.id, productId: i.productId, qty: i.qty, cost: i.cost } })
      await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.qty } } })
    }
    return inbound
  })
  return NextResponse.json({ ok: true, inboundId: inbound.id })
}
