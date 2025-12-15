export interface LineItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Contract {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  lineItems: LineItem[];
}

export interface ContractCalculations {
  totalContractLengthMonths: number;
  remainingMonths: number;
  monthlyTotal: number;
  totalBuyout: number;
}

export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';