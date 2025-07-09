import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from 'path'

// 数据库文件路径
const dbPath = path.join(process.cwd(), 'finance.db')

// 数据库连接
let db: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (db) {
    return db
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })

  // 创建表
  await createTables(db)
  
  return db
}

// 创建数据库表
async function createTables(db: Database) {
  // 员工表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      position TEXT NOT NULL,
      baseSalary REAL NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 现金流表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cash_flows (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 任务表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('payroll', 'expense', 'tax', 'report')),
      priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
      deadline TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 薪资记录表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS salary_records (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      month TEXT NOT NULL,
      base_salary REAL NOT NULL,
      bonus REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      net_salary REAL NOT NULL,
      tax_amount REAL DEFAULT 0,
      social_insurance REAL DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'calculated', 'paid')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )
  `)

  // 初始化一些示例数据
  await initializeSampleData(db)
}

// 初始化示例数据
async function initializeSampleData(db: Database) {
  // 检查是否已有数据
  const employeeCount = await db.get('SELECT COUNT(*) as count FROM employees')
  if (employeeCount.count === 0) {
    // 插入示例员工
    await db.run(`
      INSERT INTO employees (id, name, department, position, baseSalary, status)
      VALUES 
        ('1', '张三', '技术部', '高级工程师', 15000, 'active'),
        ('2', '李四', '销售部', '销售经理', 12000, 'active'),
        ('3', '王五', '财务部', '会计师', 10000, 'active')
    `)
  }

  const cashFlowCount = await db.get('SELECT COUNT(*) as count FROM cash_flows')
  if (cashFlowCount.count === 0) {
    // 插入示例现金流
    await db.run(`
      INSERT INTO cash_flows (id, amount, type, category, description, date)
      VALUES 
        ('1', 1200000, 'income', 'sales', '销售收入', '2024-03-01'),
        ('2', 150000, 'expense', 'salary', '工资支出', '2024-03-05'),
        ('3', 70000, 'expense', 'rent', '房租', '2024-03-10')
    `)
  }

  const taskCount = await db.get('SELECT COUNT(*) as count FROM tasks')
  if (taskCount.count === 0) {
    // 插入示例任务
    await db.run(`
      INSERT INTO tasks (id, title, type, priority, deadline, status)
      VALUES 
        ('1', '3月份工资计算', 'payroll', 'high', '2024-04-05', 'pending'),
        ('2', '费用报销审批', 'expense', 'medium', '2024-04-03', 'pending'),
        ('3', '个税申报', 'tax', 'high', '2024-04-15', 'pending'),
        ('4', '财务月报生成', 'report', 'low', '2024-04-10', 'pending')
    `)
  }
}

// 关闭数据库连接
export async function closeDatabase() {
  if (db) {
    await db.close()
    db = null
  }
} 