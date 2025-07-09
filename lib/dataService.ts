// 数据管理服务 - 模拟数据库操作
export interface CashFlow {
  id: string
  amount: number
  date: string
  type: 'income' | 'expense'
  category: string
  description?: string
}

export interface PendingSalary {
  id: string
  employeeId: string
  employeeName: string
  department: string
  baseSalary: number
  month: string
  status: 'pending' | 'calculated' | 'paid'
}

export interface Task {
  id: string
  title: string
  type: 'payroll' | 'expense' | 'tax' | 'report'
  priority: 'high' | 'medium' | 'low'
  deadline: string
  status: 'pending' | 'completed'
  description?: string
}

// 现金流数据管理
export const cashFlowService = {
  // 获取当前现金流
  getCurrentCashFlow: (): number => {
    // 服务器端始终返回默认值
    if (typeof window === 'undefined') return 980000
    
    const cashFlows = JSON.parse(localStorage.getItem('cashFlows') || '[]')
    if (cashFlows.length === 0) {
      // 初始化默认数据
      const defaultCashFlows: CashFlow[] = [
        { id: '1', amount: 1200000, date: '2024-03-01', type: 'income', category: 'sales' },
        { id: '2', amount: -150000, date: '2024-03-05', type: 'expense', category: 'salary' },
        { id: '3', amount: -70000, date: '2024-03-10', type: 'expense', category: 'rent' },
      ]
      localStorage.setItem('cashFlows', JSON.stringify(defaultCashFlows))
      return 980000
    }
    
    // 计算当前现金流
    const total = cashFlows.reduce((sum: number, flow: CashFlow) => {
      return sum + (flow.type === 'income' ? flow.amount : -Math.abs(flow.amount))
    }, 0)
    
    return total
  },

  // 添加现金流记录
  addCashFlow: (cashFlow: Omit<CashFlow, 'id'>) => {
    const cashFlows = JSON.parse(localStorage.getItem('cashFlows') || '[]')
    const newCashFlow = {
      ...cashFlow,
      id: Date.now().toString()
    }
    cashFlows.push(newCashFlow)
    localStorage.setItem('cashFlows', JSON.stringify(cashFlows))
  },

  // 获取现金流历史
  getCashFlowHistory: (): CashFlow[] => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('cashFlows') || '[]')
  }
}

// 待发工资数据管理
export const salaryService = {
  // 获取待发工资总额
  getPendingSalaryTotal: (): number => {
    if (typeof window === 'undefined') return 1234500
    
    const employees = JSON.parse(localStorage.getItem('employees') || '[]')
    if (employees.length === 0) return 1234500
    
    // 计算所有在职员工的待发工资
    const total = employees
      .filter((emp: any) => emp.status === 'active')
      .reduce((sum: number, emp: any) => sum + emp.baseSalary, 0)
    
    return total
  },

  // 获取待发工资详情
  getPendingSalaries: (): PendingSalary[] => {
    if (typeof window === 'undefined') return []
    
    const employees = JSON.parse(localStorage.getItem('employees') || '[]')
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    
    return employees
      .filter((emp: any) => emp.status === 'active')
      .map((emp: any) => ({
        id: emp.id,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        baseSalary: emp.baseSalary,
        month: currentMonth,
        status: 'pending'
      }))
  }
}

// 任务数据管理
export const taskService = {
  // 获取待处理任务
  getPendingTasks: (): Task[] => {
    if (typeof window === 'undefined') {
      return [
        { id: '1', title: '3月份工资计算', type: 'payroll', priority: 'high', deadline: '2024-04-05', status: 'pending' },
        { id: '2', title: '费用报销审批', type: 'expense', priority: 'medium', deadline: '2024-04-03', status: 'pending' },
        { id: '3', title: '个税申报', type: 'tax', priority: 'high', deadline: '2024-04-15', status: 'pending' },
        { id: '4', title: '财务月报生成', type: 'report', priority: 'low', deadline: '2024-04-10', status: 'pending' },
      ]
    }
    
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    if (tasks.length === 0) {
      // 初始化默认任务
      const defaultTasks: Task[] = [
        { id: '1', title: '3月份工资计算', type: 'payroll', priority: 'high', deadline: '2024-04-05', status: 'pending' },
        { id: '2', title: '费用报销审批', type: 'expense', priority: 'medium', deadline: '2024-04-03', status: 'pending' },
        { id: '3', title: '个税申报', type: 'tax', priority: 'high', deadline: '2024-04-15', status: 'pending' },
        { id: '4', title: '财务月报生成', type: 'report', priority: 'low', deadline: '2024-04-10', status: 'pending' },
      ]
      localStorage.setItem('tasks', JSON.stringify(defaultTasks))
      return defaultTasks
    }
    
    return tasks.filter((task: Task) => task.status === 'pending')
  },

  // 更新任务状态
  updateTaskStatus: (taskId: string, status: 'pending' | 'completed') => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const updatedTasks = tasks.map((task: Task) => 
      task.id === taskId ? { ...task, status } : task
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  },

  // 添加新任务
  addTask: (task: Omit<Task, 'id'>) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const newTask = {
      ...task,
      id: Date.now().toString()
    }
    tasks.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(tasks))
  },

  // 检查任务是否紧急（截止日期小于3天）
  isTaskUrgent: (deadline: string): boolean => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }
} 