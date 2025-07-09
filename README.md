# 财务管理系统

基于Next.js和TypeScript开发的现代化财务管理系统，使用SQLite数据库进行数据持久化。

## 功能特性

- 📊 **动态仪表盘**: 实时现金流、待发工资、任务管理
- 👥 **员工管理**: 完整的员工信息CRUD操作
- 💰 **薪资计算**: 个税计算器、薪资计算API
- 📈 **现金流管理**: 收支记录、实时统计
- ✅ **任务管理**: 待办任务、状态跟踪
- 🎨 **现代化UI**: 使用Tailwind CSS和shadcn/ui

## 技术栈

- **前端框架**: Next.js 15.2.4
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **UI组件**: shadcn/ui
- **数据库**: SQLite
- **部署平台**: Vercel (推荐)

## 数据库结构

### 员工表 (employees)
- id: 员工ID
- name: 姓名
- department: 部门
- position: 职位
- baseSalary: 基本工资
- status: 状态 (active/inactive)

### 现金流表 (cash_flows)
- id: 记录ID
- amount: 金额
- type: 类型 (income/expense)
- category: 类别
- description: 说明
- date: 日期

### 任务表 (tasks)
- id: 任务ID
- title: 标题
- type: 类型 (payroll/expense/tax/report)
- priority: 优先级 (high/medium/low)
- deadline: 截止日期
- status: 状态 (pending/completed)

### 薪资记录表 (salary_records)
- id: 记录ID
- employee_id: 员工ID
- month: 月份
- base_salary: 基本工资
- bonus: 奖金
- deductions: 扣除
- net_salary: 实发工资
- tax_amount: 税额
- social_insurance: 社保

## 本地运行

### 1. 安装依赖
```bash
npm install
```

### 2. 安装SQLite依赖
```bash
npm install sqlite3 sqlite
npm install --save-dev @types/sqlite3
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本
```bash
npm run build
npm start
```

## API接口

### 员工管理
- `GET /api/employees` - 获取所有员工
- `POST /api/employees` - 添加员工
- `PUT /api/employees` - 更新员工
- `DELETE /api/employees?id=xxx` - 删除员工

### 现金流管理
- `GET /api/cashflow` - 获取现金流数据
- `POST /api/cashflow` - 添加现金流记录

### 任务管理
- `GET /api/tasks` - 获取待处理任务
- `POST /api/tasks` - 添加任务
- `PUT /api/tasks` - 更新任务状态
- `DELETE /api/tasks?id=xxx` - 删除任务

### 仪表盘数据
- `GET /api/dashboard` - 获取仪表盘汇总数据

## 部署

### Vercel部署 (推荐)
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署完成

### 其他平台
- Netlify
- Railway
- 自建服务器

## 项目结构

```
finance-management-system/
├── app/                    # Next.js页面
│   ├── api/               # API路由
│   ├── payroll/           # 薪酬管理页面
│   └── page.tsx           # 主页面
├── components/             # React组件
│   ├── dashboard/         # 仪表盘组件
│   ├── payroll/           # 薪酬管理组件
│   └── ui/                # UI组件
├── lib/                    # 工具函数
│   ├── database.ts        # 数据库配置
│   ├── dbService.ts       # 数据库服务
│   └── utils.ts           # 工具函数
├── public/                 # 静态资源
└── 配置文件...
```

## 开发说明

- 数据库文件会自动创建在项目根目录的 `finance.db`
- 首次运行会自动初始化示例数据
- 所有数据操作都通过API接口进行
- 支持实时数据更新和状态同步

## 许可证

MIT License 