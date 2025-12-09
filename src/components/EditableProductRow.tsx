"use client"
import { useState, useTransition } from 'react'
import DeleteProductButton from './DeleteProductButton'
import { useRouter } from 'next/navigation'

type Product = {
  id: number
  name: string
  barcode: string | null
  price: any
  stock: number
}

export default function EditableProductRow({ product }: { product: Product }) {
  const [name, setName] = useState(product.name)
  const [barcode, setBarcode] = useState(product.barcode ?? '')
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(product.stock)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const save = async () => {
    const res = await fetch(`/api/productos/${product.id}`, {
      method: 'PATCH',
      body: (() => {
        const fd = new FormData()
        fd.append('name', name)
        fd.append('barcode', barcode)
        fd.append('price', price)
        fd.append('stock', String(stock))
        return fd
      })(),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Error al guardar')
      return
    }
    startTransition(() => router.refresh())
  }

  return (
    <tr className="border-t align-top">
      <td className="p-2"><input value={name} onChange={e=>setName(e.target.value)} className="border p-2 rounded w-full" /></td>
      <td className="p-2"><input value={barcode} onChange={e=>setBarcode(e.target.value)} className="border p-2 rounded w-full" /></td>
      <td className="p-2"><input value={price} onChange={e=>setPrice(e.target.value)} type="number" step="0.01" className="border p-2 rounded w-full" /></td>
      <td className="p-2"><input value={stock} onChange={e=>setStock(Number(e.target.value))} type="number" className="border p-2 rounded w-full" /></td>
      <td className="p-2">
        <div className="flex gap-2">
          <button onClick={save} disabled={pending} className="px-3 py-2 bg-blue-600 text-white rounded">{pending ? 'Guardando…' : 'Guardar'}</button>
          <DeleteProductButton action={`/api/productos/${product.id}`} />
        </div>
      </td>
    </tr>
  )
}
