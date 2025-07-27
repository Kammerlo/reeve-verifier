export interface TransactionItem {
  id: string;
  amount: string;
  currency: string;
  document_number: string;
}

export interface Transaction {
  id: string;
  number: string;
  accounting_period: string;
  batch_id: string;
  type: string;
  date: string;
  tx_hash: string;
  items: TransactionItem[];
}

export interface TransactionListResponse {
  content: Transaction[];
  total_pages: number;
  total_elements: number;
  page_number: number;
  page_size: number;
  first: boolean;
  last: boolean;
}

export interface ReportField {
  [key: string]: any;
}

export interface Report {
  id: number;
  interval: string;
  year: string;
  period: number;
  sub_type: string;
  fields: Record<string, ReportField>;
}

export interface ParsedReportItem {
  path: string[];
  value: number;
}
