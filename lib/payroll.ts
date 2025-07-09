// 2024年社保基数上下限（以北京为例）
const SOCIAL_INSURANCE_BASE = {
  min: 3613,    // 最低基数
  max: 31014    // 最高基数
};

// 社保费率（以北京为例）
const INSURANCE_RATES = {
  pension: { employee: 0.08, company: 0.16 },       // 养老保险
  medical: { employee: 0.02, company: 0.1 },        // 医疗保险
  unemployment: { employee: 0.005, company: 0.008 }, // 失业保险
  injury: { employee: 0, company: 0.002 },          // 工伤保险
  maternity: { employee: 0, company: 0.008 },       // 生育保险
  housingFund: { employee: 0.12, company: 0.12 }    // 住房公积金
};

// 2024年个税起征点
const TAX_THRESHOLD = 5000;

// 2024年个税税率表
const TAX_BRACKETS = [
  { min: 0, max: 3000, rate: 0.03, deduction: 0 },
  { min: 3000, max: 12000, rate: 0.1, deduction: 210 },
  { min: 12000, max: 25000, rate: 0.2, deduction: 1410 },
  { min: 25000, max: 35000, rate: 0.25, deduction: 2660 },
  { min: 35000, max: 55000, rate: 0.3, deduction: 4410 },
  { min: 55000, max: 80000, rate: 0.35, deduction: 7160 },
  { min: 80000, max: Infinity, rate: 0.45, deduction: 15160 }
];

/**
 * 计算社保和公积金
 * @param salary 月工资
 * @returns 社保和公积金金额
 */
export function calculateSocialInsurance(salary: number) {
  // 确保社保基数在上下限范围内
  const base = Math.min(Math.max(salary, SOCIAL_INSURANCE_BASE.min), SOCIAL_INSURANCE_BASE.max);
  
  // 计算社保
  const pension = base * INSURANCE_RATES.pension.employee;
  const medical = base * INSURANCE_RATES.medical.employee;
  const unemployment = base * INSURANCE_RATES.unemployment.employee;
  
  // 计算住房公积金
  const housingFund = base * INSURANCE_RATES.housingFund.employee;
  
  const socialInsurance = pension + medical + unemployment;
  
  return {
    socialInsurance,
    housingFund,
    details: {
      pension,
      medical,
      unemployment,
      housingFund
    }
  };
}

/**
 * 计算个人所得税
 * @param taxableIncome 应纳税所得额（月收入 - 起征点）
 * @returns 应缴税额
 */
export function calculateTax(taxableIncome: number) {
  if (taxableIncome <= 0) return 0;
  
  // 查找适用的税率档位
  const bracket = TAX_BRACKETS.find(b => taxableIncome > b.min && taxableIncome <= b.max);
  if (!bracket) return 0;
  
  // 计算税额
  return taxableIncome * bracket.rate - bracket.deduction;
} 