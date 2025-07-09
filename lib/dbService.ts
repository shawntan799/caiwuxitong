import { getDatabase } from './database'

// 员工相关操作
export const employeeService = {
  // 获取所有员工
  async getAllEmployees() {
    const db = await getDatabase()
    return await db.all('SELECT * FROM employees ORDER BY created_at DESC')
  },

  // 根据ID获取员工
  async getEmployeeById(id: string) {
    const db = await getDatabase()
    return await db.get('SELECT * FROM employees WHERE id = ?', id)
  },

  // 添加员工
  async addEmployee(employee: {
    id: string
    name: string
    department: string
    position: string
    baseSalary: number
    status: string
  }) {
    const db = await getDatabase()
    await db.run(`
      INSERT INTO employees (id, name, department, position, baseSalary, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [employee.id, employee.name, employee.department, employee.position, employee.baseSalary, employee.status])
  },

  // 更新员工
  async updateEmployee(employee: {
    id: string
    name: string
    department: string
    position: string
    baseSalary: number
    status: string
  }) {
    const db = await getDatabase()
    await db.run(`
      UPDATE employees 
      SET name = ?, department = ?, position = ?, baseSalary = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [employee.name, employee.department, employee.position, employee.baseSalary, employee.status, employee.id])
  },

  // 删除员工
  async deleteEmployee(id: string) {
    const db = await getDatabase()
    await db.run('DELETE FROM employees WHERE id = ?', id)
  },

  // 获取在职员工总数
  async getActiveEmployeeCount() {
    const db = await getDatabase()
    const result = await db.get('SELECT COUNT(*) as count FROM employees WHERE status = "active"')
    return result.count
  },

  // 获取待发工资总额
  async getPendingSalaryTotal() {
    const db = await getDatabase()
    const result = await db.get(`
      SELECT SUM(baseSalary) as total 
      FROM employees 
      WHERE status = 'active'
    `)
    return result.total || 0
  }
}

// 现金流相关操作
export const cashFlowService = {
  // 获取所有现金流记录
  async getAllCashFlows() {
    const db = await getDatabase()
    return await db.all('SELECT * FROM cash_flows ORDER BY date DESC')
  },

  // 获取当前现金流总额
  async getCurrentCashFlow() {
    const db = await getDatabase()
    const result = await db.get(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as total
      FROM cash_flows
    `)
    return result.total || 0
  },

  // 添加现金流记录
  async addCashFlow(cashFlow: {
    id: string
    amount: number
    type: 'income' | 'expense'
    category: string
    description?: string
    date: string
  }) {
    const db = await getDatabase()
    await db.run(`
      INSERT INTO cash_flows (id, amount, type, category, description, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [cashFlow.id, cashFlow.amount, cashFlow.type, cashFlow.category, cashFlow.description, cashFlow.date])
  },

  // 获取最近5条现金流记录
  async getRecentCashFlows(limit: number = 5) {
    const db = await getDatabase()
    return await db.all(`
      SELECT * FROM cash_flows 
      ORDER BY date DESC 
      LIMIT ?
    `, limit)
  }
}

// 任务相关操作
export const taskService = {
  // 获取所有任务
  async getAllTasks() {
    const db = await getDatabase()
    return await db.all('SELECT * FROM tasks ORDER BY deadline ASC')
  },

  // 获取待处理任务
  async getPendingTasks() {
    const db = await getDatabase()
    return await db.all(`
      SELECT * FROM tasks 
      WHERE status = 'pending' 
      ORDER BY deadline ASC
    `)
  },

  // 添加任务
  async addTask(task: {
    id: string
    title: string
    type: 'payroll' | 'expense' | 'tax' | 'report'
    priority: 'high' | 'medium' | 'low'
    deadline: string
    status: string
    description?: string
  }) {
    const db = await getDatabase()
    await db.run(`
      INSERT INTO tasks (id, title, type, priority, deadline, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [task.id, task.title, task.type, task.priority, task.deadline, task.status, task.description])
  },

  // 更新任务状态
  async updateTaskStatus(id: string, status: 'pending' | 'completed') {
    const db = await getDatabase()
    await db.run(`
      UPDATE tasks 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, id])
  },

  // 删除任务
  async deleteTask(id: string) {
    const db = await getDatabase()
    await db.run('DELETE FROM tasks WHERE id = ?', id)
  },

  // 检查任务是否紧急（截止日期小于3天）
  isTaskUrgent(deadline: string): boolean {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }
}

// 薪资记录相关操作
export const salaryService = {
  // 获取薪资记录
  async getSalaryRecords(month?: string) {
    const db = await getDatabase()
    if (month) {
      return await db.all(`
        SELECT sr.*, e.name as employee_name, e.department
        FROM salary_records sr
        JOIN employees e ON sr.employee_id = e.id
        WHERE sr.month = ?
        ORDER BY sr.created_at DESC
      `, month)
    } else {
      return await db.all(`
        SELECT sr.*, e.name as employee_name, e.department
        FROM salary_records sr
        JOIN employees e ON sr.employee_id = e.id
        ORDER BY sr.created_at DESC
      `)
    }
  },

  // 添加薪资记录
  async addSalaryRecord(record: {
    id: string
    employeeId: string
    month: string
    baseSalary: number
    bonus: number
    deductions: number
    netSalary: number
    taxAmount: number
    socialInsurance: number
    status: string
  }) {
    const db = await getDatabase()
    await db.run(`
      INSERT INTO salary_records (
        id, employee_id, month, base_salary, bonus, deductions, 
        net_salary, tax_amount, social_insurance, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      record.id, record.employeeId, record.month, record.baseSalary,
      record.bonus, record.deductions, record.netSalary, record.taxAmount,
      record.socialInsurance, record.status
    ])
  },

  // 更新薪资记录状态
  async updateSalaryRecordStatus(id: string, status: string) {
    const db = await getDatabase()
    await db.run(`
      UPDATE salary_records 
      SET status = ?
      WHERE id = ?
    `, [status, id])
  }
} 