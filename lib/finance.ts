"use server"

export async function calculateDailyBudget(income: number, fixedExpenses: number, savings: number) {
  const availableAmount = income - fixedExpenses - savings
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  return availableAmount / daysInMonth
}

