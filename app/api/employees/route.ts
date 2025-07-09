import { NextRequest, NextResponse } from 'next/server'
import { employeeService } from '@/lib/dbService'

// GET - 获取所有员工
export async function GET() {
  try {
    const employees = await employeeService.getAllEmployees()
    return NextResponse.json(employees)
  } catch (error) {
    console.error('获取员工列表失败:', error)
    return NextResponse.json(
      { error: '获取员工列表失败' },
      { status: 500 }
    )
  }
}

// POST - 添加新员工
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, department, position, baseSalary, status } = body
    
    if (!name || !department || !position || !baseSalary) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    const employee = {
      id: Date.now().toString(),
      name,
      department,
      position,
      baseSalary: Number(baseSalary),
      status: status || 'active'
    }

    await employeeService.addEmployee(employee)
    
    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('添加员工失败:', error)
    return NextResponse.json(
      { error: '添加员工失败' },
      { status: 500 }
    )
  }
}

// PUT - 更新员工信息
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, department, position, baseSalary, status } = body
    
    if (!id || !name || !department || !position || !baseSalary) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    const employee = {
      id,
      name,
      department,
      position,
      baseSalary: Number(baseSalary),
      status: status || 'active'
    }

    await employeeService.updateEmployee(employee)
    
    return NextResponse.json(employee)
  } catch (error) {
    console.error('更新员工失败:', error)
    return NextResponse.json(
      { error: '更新员工失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除员工
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: '员工ID不能为空' },
        { status: 400 }
      )
    }

    await employeeService.deleteEmployee(id)
    
    return NextResponse.json({ message: '员工删除成功' })
  } catch (error) {
    console.error('删除员工失败:', error)
    return NextResponse.json(
      { error: '删除员工失败' },
      { status: 500 }
    )
  }
} 