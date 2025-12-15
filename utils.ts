import { Contract, ContractCalculations } from './types';

export const calculateMonthsDifference = (d1: Date, d2: Date): number => {
  // Calculate difference in milliseconds
  const diffTime = d2.getTime() - d1.getTime();
  
  // Average milliseconds in a month (365.25 days / 12 months * 24h * 60m * 60s * 1000ms)
  const msPerMonth = 2629800000; 
  
  const months = diffTime / msPerMonth;
  
  // Return 0 if negative, otherwise formatted to 1 decimal place
  return months <= 0 ? 0 : Math.round(months * 10) / 10;
};

export const calculateContractMetrics = (contract: Contract): ContractCalculations => {
  const start = new Date(contract.startDate);
  const end = new Date(contract.endDate);
  const now = new Date();

  // Validate dates
  const isValidDates = !isNaN(start.getTime()) && !isNaN(end.getTime());
  
  if (!isValidDates) {
    return {
      totalContractLengthMonths: 0,
      remainingMonths: 0,
      monthlyTotal: 0,
      totalBuyout: 0,
    };
  }

  // Total Contract Length (Start to End)
  const totalContractLengthMonths = calculateMonthsDifference(start, end);

  // Remaining Months (Now to End)
  // If end date is in the past, remaining is 0
  const remainingMonths = end < now ? 0 : calculateMonthsDifference(now, end);

  // Financials
  const monthlyTotal = contract.lineItems.reduce((acc, item) => {
    return acc + (item.quantity * item.unitPrice);
  }, 0);

  const totalBuyout = monthlyTotal * remainingMonths;

  return {
    totalContractLengthMonths,
    remainingMonths,
    monthlyTotal,
    totalBuyout
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};