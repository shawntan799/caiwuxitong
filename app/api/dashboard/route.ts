import { NextResponse } from 'next/server'
import { cashFlowService, employeeService, taskService } from '@/lib/dbService'

// GET - 获取仪表盘数据
export async function GET() {
  try {
    const [currentCashFlow, pendingSalaryTotal, pendingTasks] = await Promise.all([
      cashFlowService.getCurrentCashFlow(),
      employeeService.getPendingSalaryTotal(),
      taskService.getPendingTasks()
    ])
    
    return NextResponse.json({
      currentCashFlow,
      pendingSalaryTotal,
      pendingTasks,
      isCashFlowWarning: currentCashFlow < 1000000
    })
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
    return NextResponse.json(
      { error: '获取仪表盘数据失败' },
      { status: 500 }
    )
  }
} 