"use client"
import { useState } from "react"

export default function ExpensePage() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState<{ reason: string; amount: string; invoice: File | null }>({ reason: '', amount: '', invoice: null })
  const [pending, setPending] = useState<any[]>([])

  function handleSubmit(e: any) {
    e.preventDefault()
    if (!form.reason || !form.amount || !form.invoice) return
    setPending([
      ...pending,
      { ...form, id: Date.now() }
    ])
    setShow(false)
    setForm({ reason: '', amount: '', invoice: null })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">费用报销</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => setShow(true)}>新增报销</button>
      {show && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form className="bg-white rounded shadow p-6 min-w-[320px]" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">报销事由</label>
              <input className="border p-2 rounded w-full" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="block mb-1">金额</label>
              <input className="border p-2 rounded w-full" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="block mb-1">上传发票</label>
              <input className="border p-2 rounded w-full" type="file" accept="image/*,application/pdf" onChange={e => setForm(f => ({ ...f, invoice: e.target.files?.[0] || null }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setShow(false)}>取消</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">提交</button>
            </div>
          </form>
        </div>
      )}
      <div className="mt-8">
        <div className="font-semibold mb-2">待审批报销列表</div>
        <table className="w-full text-sm bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">事由</th>
              <th className="p-2">金额</th>
              <th className="p-2">发票</th>
              <th className="p-2">状态</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(item => (
              <tr key={item.id}>
                <td className="p-2">{item.reason}</td>
                <td className="p-2">¥{item.amount}</td>
                <td className="p-2">{item.invoice ? item.invoice.name : ''}</td>
                <td className="p-2 text-yellow-600">待审批</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 