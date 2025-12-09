"use client"
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Proveedor = { id: number; name: string }
type Producto = { id: number; name: string; supplierId?: number | null; stock: number }

export default function IngresosClient({ proveedores, productos }: { proveedores: Proveedor[]; productos: Producto[] }) {
  const [supplierId, setSupplierId] = useState<number | null>(null)
  const [items, setItems] = useState<Record<number, { qty: number; cost: number }>>({})
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const list = useMemo(() => productos.filter(p => supplierId ? p.supplierId === supplierId : false), [productos, supplierId])

  const setQty = (id: number, qty: number) => {
    setItems(prev => ({ ...prev, [id]: { qty: Math.max(1, qty), cost: prev[id]?.cost ?? 0 } }))
  }
  const setCost = (id: number, cost: number) => {
    setItems(prev => ({ ...prev, [id]: { qty: prev[id]?.qty ?? 1, cost: Math.max(0, cost) } }))
  }
  const remove = (id: number) => {
    setItems(prev => { const { [id]: _, ...rest } = prev; return rest })
  }

  const submit = async () => {
    if (!supplierId) { alert('Selecciona un proveedor'); return }
    const payloadItems = Object.entries(items).map(([productId, v]) => ({ productId: Number(productId), qty: v.qty, cost: v.cost }))
    if (payloadItems.length === 0) { alert('Selecciona al menos un producto'); return }
    const res = await fetch('/api/ingresos', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ supplierId, items: payloadItems }) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) { alert(data.error || 'No se pudo registrar ingreso'); return }
    setItems({})
    startTransition(() => router.refresh())
  }

  return (
    <div className="grid gap-4">
      <div className="bg-white p-4 rounded border grid grid-cols-2 gap-3">
        <select value={supplierId ?? ''} onChange={e=>setSupplierId(e.target.value ? Number(e.target.value) : null)} className="border p-2 rounded">
          <option value="">Proveedor</option>
          {proveedores.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </select>
        <div />
      </div>

      {supplierId && (
        <div className="bg-white p-4 rounded border">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-2">Producto</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Costo unitario</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map(p => {
                const v = items[p.id] || { qty: 0, cost: 0 }
                return (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2"><input type="number" min={1} value={v.qty || ''} onChange={e=>setQty(p.id, Number(e.target.value))} className="border p-2 rounded w-24" /></td>
                    <td className="p-2"><input type="number" min={0} step="0.01" value={v.cost || ''} onChange={e=>setCost(p.id, Number(e.target.value))} className="border p-2 rounded w-28" /></td>
                    <td className="p-2">
                      {(v.qty || v.cost) ? (
                        <button className="px-3 py-2 bg-gray-700 text-white rounded" onClick={()=>remove(p.id)}>Quitar</button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white p-4 rounded border flex items-center justify-between">
        <div>Items seleccionados: {Object.keys(items).length}</div>
        <button disabled={pending} onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">{pending ? 'Registrando…' : 'Registrar ingreso'}</button>
      </div>
    </div>
  )}
