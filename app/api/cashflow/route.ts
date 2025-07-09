import { NextRequest, NextResponse } from 'next/server'
import { cashFlowService } from '@/lib/dbService'

// GET - 获取现金流数据
export async function GET() {
  try {
    const [currentCashFlow, recentCashFlows] = await Promise.all([
      cashFlowService.getCurrentCashFlow(),
      cashFlowService.getRecentCashFlows(5)
    ])
    
    return NextResponse.json({
      currentCashFlow,
      recentCashFlows
    })
  } catch (error) {
    console.error('获取现金流数据失败:', error)
    return NextResponse.json(
      { error: '获取现金流数据失败' },
      { status: 500 }
    )
  }
}

// POST - 添加现金流记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, type, category, description } = body
    
    if (!amount || !type || !category) {
      return NextResponse.json(
        { error: '请填写金额、类型和类别' },
        { status: 400 }
      )
    }

    const cashFlow = {
      id: Date.now().toString(),
      amount: Number(amount),
      type: type as 'income' | 'expense',
      category,
      description,
      date: new Date().toISOString().split('T')[0]
    }

    await cashFlowService.addCashFlow(cashFlow)
    
    // 返回更新后的现金流数据
    const [currentCashFlow, recentCashFlows] = await Promise.all([
      cashFlowService.getCurrentCashFlow(),
      cashFlowService.getRecentCashFlows(5)
    ])
    
    return NextResponse.json({
      cashFlow,
      currentCashFlow,
      recentCashFlows
    }, { status: 201 })
  } catch (error) {
    console.error('添加现金流记录失败:', error)
    return NextResponse.json(
      { error: '添加现金流记录失败' },
      { status: 500 }
    )
  }
} 