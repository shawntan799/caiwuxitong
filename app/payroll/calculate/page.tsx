"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// 获取员工数据从localStorage
const getEmployeesFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedEmployees = localStorage.getItem("employees")
    if (savedEmployees) {
      return JSON.parse(savedEmployees)
    }
  }
  // 默认员工数据
  return [
    { id: "1", name: "张三", department: "技术部", position: "高级工程师", baseSalary: 15000 },
    { id: "2", name: "李四", department: "销售部", position: "销售经理", baseSalary: 12000 },
    { id: "3", name: "王五", department: "财务部", position: "会计师", baseSalary: 10000 },
  ]
}

export default function SalaryCalculation() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    setEmployees(getEmployeesFromStorage())
  }, [])

  const handleCalculate = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/payroll/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: "2024-03",
          employeeIds: employees.map(emp => emp.id),
          employees: employees // 传递完整的员工数据
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "计算失败")
      }

      setResult(data.data)
      
      // 更新任务状态后刷新页面
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "计算过程中出现错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>工资计算 - 2024年3月</CardTitle>
          <CardDescription>
            计算所有员工的工资，包括基本工资、奖金、社保、个税等
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>基本工资</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>¥{employee.baseSalary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end">
              <Button
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "计算中..." : "开始计算"}
              </Button>
            </div>

            {result && (
              <Tabs defaultValue="summary" className="mt-6">
                <TabsList>
                  <TabsTrigger value="summary">汇总信息</TabsTrigger>
                  <TabsTrigger value="detail">详细信息</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <Card>
                    <CardHeader>
                      <CardTitle>计算结果汇总</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>姓名</TableHead>
                            <TableHead>应发工资</TableHead>
                            <TableHead>个税</TableHead>
                            <TableHead>实发工资</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.map((salary: any) => (
                            <TableRow key={salary.employeeId}>
                              <TableCell>
                                {employees.find(e => e.id === salary.employeeId)?.name}
                              </TableCell>
                              <TableCell>
                                ¥{(salary.baseSalary + salary.overtime).toFixed(2)}
                              </TableCell>
                              <TableCell>¥{salary.tax.toFixed(2)}</TableCell>
                              <TableCell>¥{salary.netSalary.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="detail">
                  <Card>
                    <CardHeader>
                      <CardTitle>详细计算信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>姓名</TableHead>
                            <TableHead>基本工资</TableHead>
                            <TableHead>加班费</TableHead>
                            <TableHead>社保</TableHead>
                            <TableHead>公积金</TableHead>
                            <TableHead>个税</TableHead>
                            <TableHead>实发工资</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.map((salary: any) => (
                            <TableRow key={salary.employeeId}>
                              <TableCell>
                                {employees.find(e => e.id === salary.employeeId)?.name}
                              </TableCell>
                              <TableCell>¥{salary.baseSalary.toFixed(2)}</TableCell>
                              <TableCell>¥{salary.overtime.toFixed(2)}</TableCell>
                              <TableCell>¥{salary.socialInsurance.toFixed(2)}</TableCell>
                              <TableCell>¥{salary.housingFund.toFixed(2)}</TableCell>
                              <TableCell>¥{salary.tax.toFixed(2)}</TableCell>
                              <TableCell>¥{salary.netSalary.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 