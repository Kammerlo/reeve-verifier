import React, { useState } from "react";
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
import { Transaction } from "@/types/transaction";

interface TransactionListProps {
  transactions?: Transaction[];
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onTransactionSelect?: (transaction: Transaction) => void;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [],
  totalPages = 1,
  currentPage = 0,
  pageSize = 10,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  onTransactionSelect = () => {},
  onSort = () => {},
  loading = false,
}) => {
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    const direction =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    onSort(field, direction);

    // Sort the transactions locally
    const sortedTransactions = [...transactions].sort((a, b) => {
      let aValue: any = a[field as keyof Transaction];
      let bValue: any = b[field as keyof Transaction];

      // Handle special cases
      if (field === "amount") {
        aValue = a.items.reduce(
          (sum, item) => sum + parseFloat(item.amount || "0"),
          0,
        );
        bValue = b.items.reduce(
          (sum, item) => sum + parseFloat(item.amount || "0"),
          0,
        );
      } else if (field === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

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
                          {transaction.number}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>
                          <a
                            href={`https://explorer.cardano.org/transaction/${transaction.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-mono text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {transaction.tx_hash.substring(0, 12)}...
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.items
                            .reduce(
                              (sum, item) =>
                                sum + parseFloat(item.amount || "0"),
                              0,
                            )
                            .toLocaleString("en-US", {
                              style: "currency",
                              currency: transaction.items[0]?.currency || "USD",
                            })}
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
  );
};

export default TransactionList;
