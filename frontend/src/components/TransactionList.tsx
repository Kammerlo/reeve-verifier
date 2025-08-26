import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction, TransactionListResponse } from "@/types/transaction";
import TransactionDetail from "./TransactionDetail";
import { Organisation } from "@/types/organisation";
import { SearchBody } from "@/types/searchBody";
interface TransactionListProps {
  apiUrl?: string;
  organisation: Organisation | null;
}
const TransactionList: React.FC<TransactionListProps> = ({ apiUrl = "http://localhost:9000", organisation }) => {
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sort, setSort] = useState<{ field: string; direction: "asc" | "desc" } | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const onTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const fetchTransactions = async (
    page: number = 0,
    size: number = pageSize,

  ) => {
    setLoading(true);
    try {
      let url = `${apiUrl}/api/v1/transactions?page=${page}&size=${size}`;
      if (sort) {
        url += `&sort=${sort.field},${sort.direction}`;
      }
      let body: SearchBody = {};
      if (organisation) {
        body.organisationId = organisation.id;
      }
      const response = await fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`);
      }
      const data: TransactionListResponse = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.total / pageSize);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (page: number) => {
    fetchTransactions(page, pageSize);
  };

  const onPageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
    fetchTransactions(0, newSize);
  };

  useEffect(() => {
    fetchTransactions(0, pageSize);
  }, [apiUrl, pageSize]);

  const handleSort = (field: string) => {
    const direction =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    setSort({ field, direction });
    fetchTransactions(currentPage, pageSize);
    // Update the parent component with sorted data
    // This would need to be handled by the parent component
  };

  const renderSortIcon = (field: string) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      0,
      Math.min(
        currentPage - Math.floor(maxVisiblePages / 2),
        totalPages - maxVisiblePages,
      ),
    );
    const endPage = Math.min(startPage + maxVisiblePages, totalPages);

    for (let i = startPage; i < endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
            className="cursor-pointer"
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <div>
      <Card className="w-full bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transactions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Page {currentPage + 1} of {totalPages} ({transactions.length}{" "}
                items)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Items per page:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("number")}
                          className="flex items-center font-semibold"
                        >
                          Transaction # {renderSortIcon("number")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("date")}
                          className="flex items-center font-semibold"
                        >
                          Date {renderSortIcon("date")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("type")}
                          className="flex items-center font-semibold"
                        >
                          Type {renderSortIcon("type")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("tx_hash")}
                          className="flex items-center font-semibold"
                        >
                          Transaction Hash {renderSortIcon("tx_hash")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("amount")}
                          className="flex items-center font-semibold ml-auto"
                        >
                          Amount {renderSortIcon("amount")}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => onTransactionSelect(transaction)}
                        >
                          <TableCell className="font-medium">
                            {transaction.transactionInternalNumber}
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.entryDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.transactionType}</TableCell>
                          <TableCell>
                            <a
                              href={`https://explorer.cardano.org/transaction/${transaction.blockChainHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline font-mono text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {transaction.blockChainHash.substring(0, 12)}...
                            </a>
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: transaction.documentCurrencyCustomerCode || "USD",
                            }).format(Number.parseFloat(transaction.amountLcy))}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(0)}
                          disabled={currentPage === 0}
                          className="flex items-center gap-1"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                          First
                        </Button>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            onPageChange(Math.max(0, currentPage - 1))
                          }
                          className={
                            currentPage === 0
                              ? "pointer-events-none opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {renderPagination()}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            onPageChange(
                              Math.min(totalPages - 1, currentPage + 1),
                            )
                          }
                          className={
                            currentPage === totalPages - 1
                              ? "pointer-events-none opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(totalPages - 1)}
                          disabled={currentPage === totalPages - 1}
                          className="flex items-center gap-1"
                        >
                          Last
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>

      </Card>
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionList;
