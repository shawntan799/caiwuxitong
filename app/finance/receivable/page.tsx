"use client"
import { useEffect, useState } from "react"

interface Receivable {
  id: number
  customer: string
  amount: number
  dueDate: string // yyyy-mm-dd
}

const LOCAL_KEY = "receivables"

function getDaysDiff(dateStr: string) {
  const now = new Date()
  const due = new Date(dateStr)
  return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
}

export default function ReceivablePage() {
  const [data, setData] = useState<Receivable[]>([])
  const [customer, setCustomer] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")

  // 加载本地数据
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) setData(JSON.parse(saved))
  }, [])
  // 保存本地数据
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  }, [data])

  function addReceivable() {
    if (!customer || !amount || !dueDate) return
    setData([
      ...data,
      {
        id: Date.now(),
        customer,
        amount: Number(amount),
        dueDate,
      },
    ])
    setCustomer("")
    setAmount("")
    setDueDate("")
  }
  function removeReceivable(id: number) {
    setData(data.filter(r => r.id !== id))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">应收账款</h1>
      {/* 数据输入区 */}
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="客户名称"
          value={customer}
          onChange={e => setCustomer(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 w-32"
          placeholder="欠款金额"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 w-36"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={addReceivable}>添加</button>
      </div>
      {/* 表格 */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">客户名称</th>
              <th className="p-2">欠款金额</th>
              <th className="p-2">到期日</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={4} className="text-center p-4 text-gray-400">暂无数据</td></tr>
            )}
            {data.map(r => {
              const days = getDaysDiff(r.dueDate)
              const isOverdue = days > 60
              return (
                <tr key={r.id} className={isOverdue ? "bg-yellow-100" : ""}>
                  <td className="p-2">{r.customer}</td>
                  <td className="p-2 text-right">¥{r.amount.toLocaleString()}</td>
                  <td className="p-2">{r.dueDate}</td>
                  <td className="p-2 flex gap-2">
                    <button className="text-blue-600 hover:underline" onClick={() => alert(`已向${r.customer}发送催收提醒！`)}>催收</button>
                    <button className="text-red-500 hover:underline" onClick={() => removeReceivable(r.id)}>删除</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
} 