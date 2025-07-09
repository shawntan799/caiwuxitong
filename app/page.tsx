"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Settings,
  LogOut,
  Home,
  Receipt,
  PieChart,
  Building2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"
import EmployeeManagement from "@/components/payroll/EmployeeManagement"
import TaxCalculator from "@/components/payroll/TaxCalculator"
import { cashFlowService, salaryService, taskService, Task } from "@/lib/dataService"
import CashFlowManager from "@/components/dashboard/CashFlowManager"

export default function FinanceManagementSystem() {
  const [activeModule, setActiveModule] = useState("dashboard")
  const router = useRouter()

  // 动态数据状态
  const [cashFlow, setCashFlow] = useState(980000)
  const [pendingSalary, setPendingSalary] = useState(1234500)
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [isClient, setIsClient] = useState(false)

  const formattedDate = React.useMemo(() => {
    const now = new Date()
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`
  }, [])

  // 客户端渲染标记
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // 加载动态数据
  React.useEffect(() => {
    if (isClient) {
      setCashFlow(cashFlowService.getCurrentCashFlow())
      setPendingSalary(salaryService.getPendingSalaryTotal())
      setPendingTasks(taskService.getPendingTasks())
    }
  }, [isClient])

  // 刷新数据函数
  const refreshData = () => {
    setCashFlow(cashFlowService.getCurrentCashFlow())
    setPendingSalary(salaryService.getPendingSalaryTotal())
    setPendingTasks(taskService.getPendingTasks())
  }

  // 处理任务点击
  const handleTaskClick = (task: Task) => {
    if (task.type === "payroll" && task.title.includes("工资计算")) {
      router.push("/payroll/calculate")
    } else if (task.type === "expense") {
      // 可以跳转到费用报销页面
      console.log("跳转到费用报销页面")
    } else if (task.type === "tax") {
      // 可以跳转到税务申报页面
      console.log("跳转到税务申报页面")
    } else if (task.type === "report") {
      // 可以跳转到报表页面
      console.log("跳转到报表页面")
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "仪表盘", icon: Home },
    {
      id: "finance",
      label: "财务管理",
      icon: DollarSign,
      children: [
        { id: "general-ledger", label: "总账管理" },
        { id: "accounts-receivable", label: "应收账款" },
        { id: "accounts-payable", label: "应付账款" },
        { id: "expense-reports", label: "费用报销" },
        { id: "financial-reports", label: "财务报表" },
      ],
    },
    {
      id: "payroll",
      label: "薪酬税务",
      icon: Users,
      children: [
        { id: "employee-info", label: "员工信息" },
        { id: "salary-calculation", label: "薪资计算" },
        { id: "tax-calculation", label: "个税核算" },
        { id: "social-insurance", label: "社保公积金" },
        { id: "tax-filing", label: "税务申报" },
      ],
    },
  ]

  const isCashFlowWarning = cashFlow < 1000000

  const dashboardStats = [
    {
      title: "本月现金流",
      value: isClient ? `¥${cashFlow.toLocaleString()}` : "¥980,000",
      change: isCashFlowWarning ? "警告：低于预警值" : "+12.5%",
      trend: isCashFlowWarning ? "warning" : "up",
      icon: TrendingUp,
    },
    {
      title: "本月利润",
      value: "¥456,780",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "待发工资总额",
      value: isClient ? `¥${pendingSalary.toLocaleString()}` : "¥1,234,500",
      change: "本月",
      trend: "neutral",
      icon: Users,
      onClick: () => router.push("/payroll/calculate"),
    },
    {
      title: "应缴税款总额",
      value: "¥89,650",
      change: "截止15日",
      trend: "warning",
      icon: Calculator,
    },
  ]



  const employeeData = [
    { id: 1, name: "张三", department: "技术部", position: "高级工程师", baseSalary: 15000, status: "active" },
    { id: 2, name: "李四", department: "销售部", position: "销售经理", baseSalary: 12000, status: "active" },
    { id: 3, name: "王五", department: "财务部", position: "会计师", baseSalary: 10000, status: "active" },
    { id: 4, name: "赵六", department: "人事部", position: "人事专员", baseSalary: 8000, status: "active" },
  ]

  const taxFilings = [
    {
      type: "增值税申报",
      status: "completed",
      icon: CheckCircle,
      iconColor: "text-green-500",
      description: "已完成 - 3月份"
    },
    {
      type: "个人所得税",
      status: "pending",
      dueDate: new Date("2024-04-15"),
      icon: Clock,
      iconColor: "text-yellow-500",
      description: "待申报 - 截止4月15日"
    },
    {
      type: "企业所得税",
      status: "overdue",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      description: "逾期 - 需立即处理",
      isUrgent: true
    }
  ]

  // 各个模块的渲染函数
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card 
            key={index} 
            className={`${stat.trend === "warning" ? "border-yellow-500" : ""} ${
              stat.onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
            }`}
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${
                stat.trend === "warning" ? "text-yellow-500" : 
                stat.trend === "up" ? "text-green-500" : "text-muted-foreground"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === "warning" ? "text-yellow-600 font-semibold" :
                stat.trend === "up" ? "text-green-600" : "text-muted-foreground"
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 待处理任务 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>待处理任务</CardTitle>
            <CardDescription>需要您关注的重要事项</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isClient ? (
                pendingTasks.map((task) => {
                  const isUrgent = taskService.isTaskUrgent(task.deadline)
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className={`font-medium ${isUrgent ? 'text-red-600' : ''}`}>
                            {task.title}
                          </p>
                          <p className={`text-sm ${isUrgent ? 'text-red-500' : 'text-muted-foreground'}`}>
                            截止: {task.deadline}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskClick(task)}
                      >
                        处理
                      </Button>
                    </div>
                  )
                })
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  加载中...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 现金流管理 */}
        <CashFlowManager onRefresh={refreshData} />
      </div>

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用功能快速入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="h-20 flex flex-col space-y-2 bg-transparent" 
              variant="outline"
              onClick={() => router.push("/payroll/calculate")}
            >
              <Calculator className="h-6 w-6" />
              <span>计算工资</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <FileText className="h-6 w-6" />
              <span>生成凭证</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <Receipt className="h-6 w-6" />
              <span>费用报销</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <PieChart className="h-6 w-6" />
              <span>财务报表</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 税务申报状态 */}
      <Card>
        <CardHeader>
          <CardTitle>税务申报状态</CardTitle>
          <CardDescription>当前申报进度和重要提醒</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {taxFilings.map((filing, index) => {
              const daysUntilDue = filing.dueDate
                ? Math.ceil((filing.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null

              const isUrgent = daysUntilDue !== null && daysUntilDue <= 3

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 border rounded-lg ${
                    isUrgent || filing.isUrgent ? "animate-pulse border-red-500" : ""
                  }`}
                >
                  <filing.icon className={`h-8 w-8 ${filing.iconColor}`} />
                  <div>
                    <p className="font-medium">{filing.type}</p>
                    <p className={`text-sm ${
                      isUrgent || filing.isUrgent ? "text-red-500 font-semibold" : "text-muted-foreground"
                    }`}>
                      {filing.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 薪酬管理各子模块
  const renderEmployeeInfo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">员工信息管理</h2>
      <EmployeeManagement />
    </div>
  )

  const renderSalaryCalculation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">薪资计算</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="mb-4">薪资计算功能</p>
          <Button onClick={() => router.push("/payroll/calculate")}>
            进入薪资计算页面
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderTaxCalculation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">个税核算</h2>
      <TaxCalculator />
    </div>
  )

  const renderSocialInsurance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">社保公积金</h2>
      <Card>
        <CardContent className="pt-6">
          <p>社保公积金管理功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderTaxFiling = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">税务申报</h2>
      <Card>
        <CardContent className="pt-6">
          <p>税务申报功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  )

  // 财务管理各子模块
  const renderGeneralLedger = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">总账管理</h2>
      <Card>
        <CardContent className="pt-6">
          <p>总账管理功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderAccountsReceivable = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">应收账款</h2>
      <Card>
        <CardContent className="pt-6">
          <p>应收账款功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderAccountsPayable = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">应付账款</h2>
      <Card>
        <CardContent className="pt-6">
          <p>应付账款功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderExpenseReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">费用报销</h2>
      <Card>
        <CardContent className="pt-6">
          <p>费用报销功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderFinancialReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">财务报表</h2>
      <Card>
        <CardContent className="pt-6">
          <p>财务报表功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  )

  // 主内容渲染函数
  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return renderDashboard()
      case "general-ledger":
        return renderGeneralLedger()
      case "accounts-receivable":
        return renderAccountsReceivable()
      case "accounts-payable":
        return renderAccountsPayable()
      case "expense-reports":
        return renderExpenseReports()
      case "financial-reports":
        return renderFinancialReports()
      case "employee-info":
        return renderEmployeeInfo()
      case "salary-calculation":
        return renderSalaryCalculation()
      case "tax-calculation":
        return renderTaxCalculation()
      case "social-insurance":
        return renderSocialInsurance()
      case "tax-filing":
        return renderTaxFiling()
      default:
        return renderDashboard()
    }
  }

    

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边导航 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="font-bold text-lg">财税管理系统</h1>
              <p className="text-sm text-muted-foreground">企业版 v2.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeModule === item.id ? "bg-blue-50 text-blue-700 border border-blue-200" : "hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
              {item.children && activeModule === item.id && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      className={`w-full text-left px-3 py-1 text-sm rounded ${
                        activeModule === child.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if(child.id === "general-ledger") {
                          router.push("/finance/ledger")
                        } else if(child.id === "accounts-receivable") {
                          router.push("/finance/receivable")
                        } else if(child.id === "accounts-payable") {
                          router.push("/finance/payable")
                        } else {
                          setActiveModule(child.id)
                        }
                      }}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>管理员</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">管理员</p>
              <p className="text-xs text-muted-foreground">admin@company.com</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {activeModule === "dashboard" && "仪表盘"}
                {activeModule === "finance" && "财务管理"}
                {activeModule === "payroll" && "薪酬税务"}
              </h2>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报表
              </Button>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
