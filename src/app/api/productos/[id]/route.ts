import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  const form = await req.formData()
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
  try {
    const updated = await prisma.product.update({ where: { id }, data })
    return NextResponse.json({ ok: true, product: updated })
  } catch (e: any) {
    return NextResponse.json({ error: 'Error al actualizar', details: e?.message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'No se pudo eliminar', details: e?.message }, { status: 400 })
  }
}
