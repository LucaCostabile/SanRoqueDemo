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
