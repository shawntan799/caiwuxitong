"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateTax, calculateSocialInsurance } from "@/lib/payroll"

export default function TaxCalculator() {
  const [salary, setSalary] = useState("")
  const [result, setResult] = useState<{
    tax: number;
    socialInsurance: {
      employee: {
        pension: number;
        medical: number;
        unemployment: number;
        total: number;
      };
      company: {
        pension: number;
        medical: number;
        unemployment: number;
        injury: number;
        maternity: number;
        total: number;
      };
      housingFund: {
        employee: number;
        company: number;
      };
    }
  } | null>(null)

  useEffect(() => {
    if (!salary || isNaN(Number(salary))) {
      setResult(null)
      return
    }

    const amount = Number(salary)
    const { socialInsurance, housingFund, details } = calculateSocialInsurance(amount)
    const taxableIncome = amount - socialInsurance - housingFund - 5000
    const tax = calculateTax(taxableIncome)

    setResult({
      tax,
      socialInsurance: {
        employee: {
          pension: details.pension,
          medical: details.medical,
          unemployment: details.unemployment,
          total: socialInsurance
        },
        company: {
          pension: amount * 0.16,
          medical: amount * 0.1,
          unemployment: amount * 0.008,
          injury: amount * 0.002,
          maternity: amount * 0.008,
          total: amount * (0.16 + 0.1 + 0.008 + 0.002 + 0.008)
        },
        housingFund: {
          employee: housingFund,
          company: housingFund
        }
      }
    })
  }, [salary])

  return (
    <Card>
      <CardHeader>
        <CardTitle>个税及社保计算器</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="salary">月收入</Label>
            <Input
              id="salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="请输入税前月收入"
            />
          </div>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">个人缴纳</h3>
                  <div className="space-y-1 text-sm">
                    <p>养老保险：¥{result.socialInsurance.employee.pension.toFixed(2)}</p>
                    <p>医疗保险：¥{result.socialInsurance.employee.medical.toFixed(2)}</p>
                    <p>失业保险：¥{result.socialInsurance.employee.unemployment.toFixed(2)}</p>
                    <p>住房公积金：¥{result.socialInsurance.housingFund.employee.toFixed(2)}</p>
                    <p className="font-semibold">
                      合计：¥{(result.socialInsurance.employee.total + result.socialInsurance.housingFund.employee).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">企业缴纳</h3>
                  <div className="space-y-1 text-sm">
                    <p>养老保险：¥{result.socialInsurance.company.pension.toFixed(2)}</p>
                    <p>医疗保险：¥{result.socialInsurance.company.medical.toFixed(2)}</p>
                    <p>失业保险：¥{result.socialInsurance.company.unemployment.toFixed(2)}</p>
                    <p>工伤保险：¥{result.socialInsurance.company.injury.toFixed(2)}</p>
                    <p>生育保险：¥{result.socialInsurance.company.maternity.toFixed(2)}</p>
                    <p>住房公积金：¥{result.socialInsurance.housingFund.company.toFixed(2)}</p>
                    <p className="font-semibold">
                      合计：¥{(result.socialInsurance.company.total + result.socialInsurance.housingFund.company).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">个人所得税</h3>
                <div className="space-y-2">
                  <p className="text-sm">应纳税所得额：¥{(Number(salary) - result.socialInsurance.employee.total - result.socialInsurance.housingFund.employee - 5000).toFixed(2)}</p>
                  <p className="text-sm font-semibold">应缴税额：¥{result.tax.toFixed(2)}</p>
                  <p className="text-sm font-semibold text-green-600">
                    税后实收：¥{(Number(salary) - result.socialInsurance.employee.total - result.socialInsurance.housingFund.employee - result.tax).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 