"use client"
import { useState } from "react"

const initialData = [
  { name: "A公司", amount: 250000, due: "2024-07-30", days: 70 },
  { name: "B公司", amount: 80000, due: "2024-08-10", days: 20 },
]

export default function ReceivablesPage() {
  const [receivables, setReceivables] = useState(initialData)
  const [form, setForm] = useState({ name: '', amount: '', due: '', days: '' })

  function handleAdd() {
    if (!form.name || !form.amount || !form.due) return
    setReceivables([
      ...receivables,
      { name: form.name, amount: Number(form.amount), due: form.due, days: Number(form.days) || 0 }
    ])
    setForm({ name: '', amount: '', due: '', days: '' })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">应收账款</h1>
      <div className="mb-4 flex gap-2 items-end">
        <input className="border p-2 rounded" placeholder="客户名称" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input className="border p-2 rounded w-32" placeholder="欠款金额" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
        <input className="border p-2 rounded w-40" placeholder="到期日(YYYY-MM-DD)" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} />
        <input className="border p-2 rounded w-24" placeholder="欠款天数" type="number" value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>添加</button>
      </div>
      <table className="w-full text-sm bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2">客户名称</th>
            <th className="p-2">欠款金额</th>
            <th className="p-2">到期日</th>
            <th className="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {receivables.map((r, i) => (
            <tr key={i} className={r.days > 60 ? "bg-yellow-100" : ""}>
              <td className="p-2">{r.name}</td>
              <td className="p-2">¥{r.amount.toLocaleString()}</td>
              <td className="p-2">{r.due}</td>
              <td className="p-2"><button className="text-blue-600">催收</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 