"use client"
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ action }: { action: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const onDelete = async () => {
    if (!confirm('Eliminar producto?')) return
    const res = await fetch(action, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'No se pudo eliminar')
      return
    }
    startTransition(() => router.refresh())
  }

  return (
    <button onClick={onDelete} disabled={pending} className="px-3 py-2 bg-red-600 text-white rounded">
      {pending ? 'Eliminando…' : 'Eliminar'}
    </button>
  )
}
