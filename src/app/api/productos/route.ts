import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const name = String(form.get('name'))
  const barcode = form.get('barcode') ? String(form.get('barcode')) : null
  const price = Number(form.get('price'))
  const stock = Number(form.get('stock') ?? 0)
  const supplierIdRaw = form.get('supplierId')?.toString()
  const supplierId = supplierIdRaw ? Number(supplierIdRaw) : undefined
  if (!name || isNaN(price)) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  const product = await prisma.product.create({ data: { name, barcode: barcode ?? undefined, price, stock, supplierId } })
  return NextResponse.redirect(new URL('/productos', req.url))
}

// Soporte para method override en formularios HTML simples
export async function POST_override(req: Request) {
  const form = await req.formData()
  const _method = String(form.get('_method') || '').toUpperCase()
  if (_method === 'PATCH') {
    const id = Number(new URL(req.url).pathname.split('/').pop())
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const name = form.get('name')?.toString()
    const barcode = form.get('barcode')?.toString() || null
    const priceRaw = form.get('price')?.toString()
    const stockRaw = form.get('stock')?.toString()
    const data: any = {}
    if (name !== undefined) data.name = name
    if (barcode !== undefined) data.barcode = barcode || null
    if (priceRaw !== undefined) {
      const price = Number(priceRaw)
      if (isNaN(price)) return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
      data.price = price
    }
    if (stockRaw !== undefined) {
      const stock = Number(stockRaw)
      if (isNaN(stock)) return NextResponse.json({ error: 'Stock inválido' }, { status: 400 })
      data.stock = stock
    }
    await prisma.product.update({ where: { id }, data })
    return NextResponse.redirect(new URL('/productos', req.url))
  } else if (_method === 'DELETE') {
    const id = Number(new URL(req.url).pathname.split('/').pop())
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    await prisma.product.delete({ where: { id } })
    return NextResponse.redirect(new URL('/productos', req.url))
  }
  return NextResponse.json({ error: 'Método no soportado' }, { status: 405 })
}
