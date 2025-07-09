"use client"
import { useState } from "react"

// 模拟银行账户数据
const accounts = [
  { name: "工商银行", balance: 320000 },
  { name: "招商银行", balance: 180000 },
  { name: "建设银行", balance: 480000 },
]

// 模拟交易流水数据
const transactions = [
  { date: "2024-07-01", account: "工商银行", summary: "客户回款", income: 50000, expense: 0, balance: 200000 },
  { date: "2024-07-02", account: "招商银行", summary: "支付工资", income: 0, expense: 30000, balance: 170000 },
  { date: "2024-07-03", account: "建设银行", summary: "采购原料", income: 0, expense: 20000, balance: 460000 },
]

export default function LedgerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">总账管理</h1>
      <div className="flex gap-4 mb-6">
        {accounts.map(acc => (
          <div key={acc.name} className="bg-white rounded shadow p-4 min-w-[160px]">
            <div className="text-gray-500 text-sm">{acc.name}</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">¥{acc.balance.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="font-semibold mb-2">交易流水</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">日期</th>
                <th className="p-2">账户名称</th>
                <th className="p-2">摘要</th>
                <th className="p-2">收入(+) </th>
                <th className="p-2">支出(-)</th>
                <th className="p-2">余额</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-2">{tx.date}</td>
                  <td className="p-2">{tx.account}</td>
                  <td className="p-2">{tx.summary}</td>
                  <td className="p-2 text-green-600">{tx.income ? `+¥${tx.income.toLocaleString()}` : ''}</td>
                  <td className="p-2 text-red-600">{tx.expense ? `-¥${tx.expense.toLocaleString()}` : ''}</td>
                  <td className="p-2">¥{tx.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 