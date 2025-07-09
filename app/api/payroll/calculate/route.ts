import { NextResponse } from 'next/server';
import { calculateTax, calculateSocialInsurance } from '@/lib/payroll';

export async function POST(req: Request) {
  try {
    const { month, employeeIds } = await req.json();

    // 模拟员工数据
    const mockEmployees = [
      { id: "1", name: "张三", department: "技术部", position: "高级工程师", baseSalary: 15000 },
      { id: "2", name: "李四", department: "销售部", position: "销售经理", baseSalary: 12000 },
      { id: "3", name: "王五", department: "财务部", position: "会计师", baseSalary: 10000 },
    ];

    // 模拟考勤数据
    const mockAttendance = {
      workDays: 22,
      leaveDays: 0,
      overtimeHours: 8
    };

    const results = [];

    // 为每个员工计算工资
    for (const employeeId of employeeIds) {
      const employee = mockEmployees.find(emp => emp.id === employeeId);
      
      if (!employee) {
        continue;
      }

      const attendance = mockAttendance;

      // 计算加班费
      const overtimePay = attendance.overtimeHours * (employee.baseSalary / 21.75 / 8 * 1.5);
      
      // 计算应发工资（基本工资 - 请假扣除 + 加班费）
      const workdayRate = employee.baseSalary / 21.75;
      const leaveDayDeduction = attendance.leaveDays * workdayRate;
      const actualBaseSalary = employee.baseSalary - leaveDayDeduction;
      
      // 计算社保和公积金
      const { socialInsurance, housingFund } = calculateSocialInsurance(actualBaseSalary);
      
      // 计算应纳税所得额和个税
      const taxableIncome = actualBaseSalary + overtimePay - socialInsurance - housingFund - 5000;
      const tax = calculateTax(taxableIncome);
      
      // 计算实发工资
      const netSalary = actualBaseSalary + overtimePay - socialInsurance - housingFund - tax;

      // 模拟保存薪资记录
      const salary = {
        id: Date.now().toString() + employee.id,
        employeeId: employee.id,
        month: month,
        baseSalary: actualBaseSalary,
        overtime: overtimePay,
        socialInsurance,
        housingFund,
        tax,
        netSalary,
        status: 'calculated'
      };

      results.push(salary);
    }

    // 模拟更新任务状态（这里只是返回成功，实际可以用localStorage）
    console.log(`任务状态已更新: ${month}工资计算已完成`);

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('工资计算错误:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 