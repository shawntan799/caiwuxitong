"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface Employee {
  id: string
  name: string
  department: string
  position: string
  baseSalary: number
  status: string
}

const departments = [
  "技术部", "销售部", "财务部", "人事部", "市场部", "运营部"
]

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    position: "",
    baseSalary: "",
    status: "active"
  })

  // 从localStorage加载数据
  useEffect(() => {
    const savedEmployees = localStorage.getItem("employees")
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    } else {
      // 初始化一些示例数据
      const initialEmployees = [
        { id: "1", name: "张三", department: "技术部", position: "高级工程师", baseSalary: 15000, status: "active" },
        { id: "2", name: "李四", department: "销售部", position: "销售经理", baseSalary: 12000, status: "active" },
        { id: "3", name: "王五", department: "财务部", position: "会计师", baseSalary: 10000, status: "active" },
      ]
      setEmployees(initialEmployees)
      localStorage.setItem("employees", JSON.stringify(initialEmployees))
    }
  }, [])

  // 保存到localStorage
  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees)
    localStorage.setItem("employees", JSON.stringify(newEmployees))
  }

  // 过滤员工
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || selectedDepartment === "all" || emp.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  // 打开新增对话框
  const openAddDialog = () => {
    setEditingEmployee(null)
    setFormData({
      name: "",
      department: "",
      position: "",
      baseSalary: "",
      status: "active"
    })
    setIsDialogOpen(true)
  }

  // 打开编辑对话框
  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      department: employee.department,
      position: employee.position,
      baseSalary: employee.baseSalary.toString(),
      status: employee.status
    })
    setIsDialogOpen(true)
  }

  // 保存员工
  const saveEmployee = () => {
    if (!formData.name || !formData.department || !formData.position || !formData.baseSalary) {
      alert("请填写所有必填字段")
      return
    }

    const employeeData = {
      id: editingEmployee?.id || Date.now().toString(),
      name: formData.name,
      department: formData.department,
      position: formData.position,
      baseSalary: Number(formData.baseSalary),
      status: formData.status
    }

    if (editingEmployee) {
      // 编辑
      const newEmployees = employees.map(emp =>
        emp.id === editingEmployee.id ? employeeData : emp
      )
      saveEmployees(newEmployees)
    } else {
      // 新增
      saveEmployees([...employees, employeeData])
    }

    setIsDialogOpen(false)
  }

  // 删除员工
  const deleteEmployee = (id: string) => {
    if (confirm("确定要删除这名员工吗？")) {
      const newEmployees = employees.filter(emp => emp.id !== id)
      saveEmployees(newEmployees)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>员工信息管理</CardTitle>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              添加员工
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选 */}
          <div className="flex space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="搜索员工姓名或职位..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="筛选部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部部门</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 员工列表 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>职位</TableHead>
                <TableHead>基本工资</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>¥{employee.baseSalary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status === "active" ? "在职" : "离职"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(employee)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 添加/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "编辑员工" : "添加员工"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入姓名"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">部门 *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">职位 *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="请输入职位"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baseSalary">基本工资 *</Label>
              <Input
                id="baseSalary"
                type="number"
                value={formData.baseSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, baseSalary: e.target.value }))}
                placeholder="请输入基本工资"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">在职</SelectItem>
                  <SelectItem value="inactive">离职</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveEmployee}>
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 