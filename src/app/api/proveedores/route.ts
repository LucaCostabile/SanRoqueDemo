import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const name = String(form.get('name'))
  const phone = form.get('phone') ? String(form.get('phone')) : null
  if (!name) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
  await prisma.supplier.create({ data: { name, phone: phone ?? undefined } })
  return NextResponse.redirect(new URL('/ingresos', req.url))
}
