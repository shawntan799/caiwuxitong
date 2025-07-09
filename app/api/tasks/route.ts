import { NextRequest, NextResponse } from 'next/server'
import { taskService } from '@/lib/dbService'

// GET - 获取所有任务
export async function GET() {
  try {
    const tasks = await taskService.getPendingTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('获取任务列表失败:', error)
    return NextResponse.json(
      { error: '获取任务列表失败' },
      { status: 500 }
    )
  }
}

// POST - 添加新任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, priority, deadline, description } = body
    
    if (!title || !type || !priority || !deadline) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    const task = {
      id: Date.now().toString(),
      title,
      type: type as 'payroll' | 'expense' | 'tax' | 'report',
      priority: priority as 'high' | 'medium' | 'low',
      deadline,
      status: 'pending',
      description
    }

    await taskService.addTask(task)
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('添加任务失败:', error)
    return NextResponse.json(
      { error: '添加任务失败' },
      { status: 500 }
    )
  }
}

// PUT - 更新任务状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body
    
    if (!id || !status) {
      return NextResponse.json(
        { error: '任务ID和状态不能为空' },
        { status: 400 }
      )
    }

    await taskService.updateTaskStatus(id, status as 'pending' | 'completed')
    
    return NextResponse.json({ message: '任务状态更新成功' })
  } catch (error) {
    console.error('更新任务状态失败:', error)
    return NextResponse.json(
      { error: '更新任务状态失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除任务
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: '任务ID不能为空' },
        { status: 400 }
      )
    }

    await taskService.deleteTask(id)
    
    return NextResponse.json({ message: '任务删除成功' })
  } catch (error) {
    console.error('删除任务失败:', error)
    return NextResponse.json(
      { error: '删除任务失败' },
      { status: 500 }
    )
  }
} 