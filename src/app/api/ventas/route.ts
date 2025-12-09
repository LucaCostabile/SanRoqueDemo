import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Espera items[]: [{ productId, qty }]
export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || ''
  let items: Array<{ productId: number; qty: number }>
  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => null)
    items = body?.items ?? []
  } else {
    const fd = await req.formData()
    // Soporte simple para FormData: items como JSON en campo "items"
    const raw = fd.get('items')?.toString() ?? '[]'
    try { items = JSON.parse(raw) } catch { items = [] }
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Sin items' }, { status: 400 })
  }

  // Validaciones básicas y obtención de productos
  const productIds = items.map(i => Number(i.productId))
  if (productIds.some(id => !id)) return NextResponse.json({ error: 'Items inválidos' }, { status: 400 })
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  const map = new Map(products.map(p => [p.id, p]))
  for (const i of items) {
    const p = map.get(Number(i.productId))
    const qty = Number(i.qty)
    if (!p) return NextResponse.json({ error: `Producto ${i.productId} no encontrado` }, { status: 404 })
    if (isNaN(qty) || qty <= 0) return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
    if (p.stock < qty) return NextResponse.json({ error: `Stock insuficiente para ${p.name}` }, { status: 400 })
  }

  const total = items.reduce((acc, i) => acc + Number(map.get(i.productId)!.price) * Number(i.qty), 0)

  const result = await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({ data: { total } })
    for (const i of items) {
      const p = map.get(i.productId)!
      await tx.saleItem.create({ data: { saleId: sale.id, productId: i.productId, qty: i.qty, price: p.price } })
      await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.qty } } })
    }
    return sale
  })
  return NextResponse.json({ ok: true, saleId: result.id })
}
