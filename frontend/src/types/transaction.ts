export interface Transaction {
  id: string;
  transactionInternalNumber: string;
  entryDate: string;
  transactionType: string;
  blockChainHash: string;
  amountLcy: string;
  fxRate: string;
  costCenterCustomerCode: string;
  costCenterCustomerName: string;
  accountEventCode: string;
  accountEventName: string;
  documentNum: string;
  documentCurrencyCustomerCode: string;
  vatCustomerCode: string;
  vatRate: string;
}

export interface TransactionListResponse {
  success: boolean;
  total: number;
  transactions: Transaction[];
  page: number;
  size: number;
}

export interface ReportField {
  [key: string]: any;
}

export interface Report {
  organisationId: string;
  currency: string;
  intervalType: string;
  blockChainHash: string;
  year: string;
  period: number;
  type: string;
  ver: string;
  fields: Record<string, ReportField>;
}

export interface ParsedReportItem {
  path: string[];
  value: number;
}
