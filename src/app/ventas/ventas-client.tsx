"use client"
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Producto = { id: number; name: string; barcode: string | null; price: any; stock: number }

export default function VentasClient({ productos }: { productos: Producto[] }) {
  const [qName, setQName] = useState('')
  const [qCode, setQCode] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({}) // productId -> qty
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const filtered = useMemo(() => {
    return productos.filter(p => {
      const okName = qName ? p.name.toLowerCase().includes(qName.toLowerCase()) : true
      const okCode = qCode ? (p.barcode || '').toLowerCase().includes(qCode.toLowerCase()) : true
      return okName && okCode
    })
  }, [productos, qName, qCode])

  const addToCart = (id: number, qty: number) => {
    setCart(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 0) + qty) }))
  }
  const setQty = (id: number, qty: number) => {
    setCart(prev => ({ ...prev, [id]: Math.max(1, qty) }))
  }
  const removeFromCart = (id: number) => {
    setCart(prev => { const { [id]: _, ...rest } = prev; return rest })
  }

  const total = useMemo(() => {
    return Object.entries(cart).reduce((acc, [id, qty]) => {
      const p = productos.find(pp => pp.id === Number(id))
      return acc + (p ? Number(p.price) * Number(qty) : 0)
    }, 0)
  }, [cart, productos])

  const submit = async () => {
    const items = Object.entries(cart).map(([productId, qty]) => ({ productId: Number(productId), qty: Number(qty) }))
    if (items.length === 0) { alert('Agrega productos al carrito'); return }
    const res = await fetch('/api/ventas', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) { alert(data.error || 'Error al registrar venta'); return }
    setCart({})
    startTransition(() => router.refresh())
  }

  return (
    <div className="grid gap-4">
      <div className="bg-white p-4 rounded border grid grid-cols-2 gap-3">
        <input value={qName} onChange={e=>setQName(e.target.value)} placeholder="Buscar por nombre" className="border p-2 rounded" />
        <input value={qCode} onChange={e=>setQCode(e.target.value)} placeholder="Buscar por código" className="border p-2 rounded" />
      </div>

      <div className="bg-white p-4 rounded border">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-2">Nombre</th>
              <th className="p-2">Código</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const qty = cart[p.id] || 0
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.barcode || '-'}</td>
                  <td className="p-2">${Number(p.price).toFixed(2)}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    <input type="number" min={1} value={qty || ''} onChange={e=>setQty(p.id, Number(e.target.value))} className="border p-2 rounded w-24" />
                  </td>
                  <td className="p-2">
                    <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={()=>addToCart(p.id, 1)}>Agregar</button>
                    {qty > 0 && (
                      <button className="ml-2 px-3 py-2 bg-gray-700 text-white rounded" onClick={()=>removeFromCart(p.id)}>Quitar</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded border flex items-center justify-between">
        <div>Items: {Object.keys(cart).length} — Total: ${total.toFixed(2)}</div>
        <button disabled={pending} onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">{pending ? 'Registrando…' : 'Registrar venta'}</button>
      </div>
    </div>
  )
}
