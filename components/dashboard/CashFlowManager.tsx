"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import { cashFlowService, CashFlow } from "@/lib/dataService"

export default function CashFlowManager({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [currentCashFlow, setCurrentCashFlow] = useState(980000)
  const [cashFlowHistory, setCashFlowHistory] = useState<CashFlow[]>([])
  const [formData, setFormData] = useState({
    amount: "",
    type: "income",
    category: "",
    description: ""
  })

  // 客户端渲染标记
  React.useEffect(() => {
    setIsClient(true)
    setCurrentCashFlow(cashFlowService.getCurrentCashFlow())
    setCashFlowHistory(cashFlowService.getCashFlowHistory())
  }, [])

  const handleSubmit = () => {
    if (!formData.amount || !formData.category) {
      alert("请填写金额和类别")
      return
    }

    const cashFlow: Omit<CashFlow, 'id'> = {
      amount: Number(formData.amount),
      type: formData.type as 'income' | 'expense',
      category: formData.category,
      description: formData.description,
      date: new Date().toISOString().split('T')[0]
    }

    cashFlowService.addCashFlow(cashFlow)
    setCurrentCashFlow(cashFlowService.getCurrentCashFlow())
    setCashFlowHistory(cashFlowService.getCashFlowHistory())
    onRefresh()
    setOpen(false)
    setFormData({
      amount: "",
      type: "income",
      category: "",
      description: ""
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>现金流管理</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                添加记录
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加现金流记录</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">金额</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="请输入金额"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">类型</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">收入</SelectItem>
                      <SelectItem value="expense">支出</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">类别</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.type === "income" ? (
                        <>
                          <SelectItem value="sales">销售收入</SelectItem>
                          <SelectItem value="investment">投资收益</SelectItem>
                          <SelectItem value="other_income">其他收入</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="salary">工资支出</SelectItem>
                          <SelectItem value="rent">房租</SelectItem>
                          <SelectItem value="utilities">水电费</SelectItem>
                          <SelectItem value="tax">税费</SelectItem>
                          <SelectItem value="other_expense">其他支出</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">说明</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="可选说明"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>
                  添加
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {isClient ? `¥${currentCashFlow.toLocaleString()}` : "¥980,000"}
            </div>
            <div className="text-sm text-muted-foreground">
              当前现金流
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">最近记录</h4>
            {isClient && cashFlowHistory.slice(-5).reverse().map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  {flow.type === "income" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">{flow.category}</span>
                </div>
                <div className="text-sm font-medium">
                  {flow.type === "income" ? "+" : "-"}¥{Math.abs(flow.amount).toLocaleString()}
                </div>
              </div>
            ))}
            {!isClient && (
              <div className="text-sm text-muted-foreground text-center py-4">
                加载中...
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 