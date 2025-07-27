import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionList from "./TransactionList";
import ConfigPanel from "./ConfigPanel";
import ReportsSection from "./ReportsSection";
import TransactionDetail from "./TransactionDetail";
import { Settings, FileText, LayoutList, Wallet } from "lucide-react";
import { Transaction, TransactionListResponse } from "@/types/transaction";

const Home = () => {
  const [apiUrl] = useState<string>(
    import.meta.env.VITE_API_URL || "http://localhost:9000",
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const handleConfigSave = (config: any) => {
    console.log("Configuration saved:", config);
    // Configuration is now handled via environment variables
  };

  const fetchTransactions = async (
    page: number = 0,
    size: number = pageSize,
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/v1/transactions?page=${page}&size=${size}`,
      );
      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`);
      }
      const data: TransactionListResponse = await response.json();
      setTransactions(data.content || data);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      // Set mock data as fallback
      setTransactions([
        {
          id: "1",
          number: "TRX-2023-001",
          accounting_period: "2023-Q2",
          batch_id: "BATCH-001",
          type: "INVOICE",
          date: "2023-06-15",
          tx_hash: "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
          items: [
            {
              id: "item-1",
              amount: "1250.00",
              currency: "USD",
              document_number: "DOC-001",
            },
          ],
        },
        {
          id: "2",
          number: "TRX-2023-002",
          accounting_period: "2023-Q2",
          batch_id: "BATCH-002",
          type: "PAYMENT",
          date: "2023-06-16",
          tx_hash: "def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123",
          items: [
            {
              id: "item-2",
              amount: "750.50",
              currency: "USD",
              document_number: "DOC-002",
            },
          ],
        },
      ]);
      setTotalPages(1);
      setCurrentPage(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTransactions(page, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
    fetchTransactions(0, newSize);
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
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

    setTransactions(sortedTransactions);
  };

  const handleConnectWallet = () => {
    // Wallet connection logic will be implemented later
    console.log("Connect Wallet clicked");
  };

  useEffect(() => {
    fetchTransactions(0, pageSize);
  }, [apiUrl, pageSize]);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Fixed Connect Wallet Button */}
      <Button
        onClick={handleConnectWallet}
        className="fixed top-4 right-4 z-50 flex items-center gap-2"
        variant="outline"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Accounting Transactions Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and view your accounting transactions and reports
        </p>
      </header>

      <Tabs defaultValue="transactions" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2"
            >
              <LayoutList className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className="p-6">
            <TabsContent value="transactions" className="mt-0">
              <TransactionList
                transactions={transactions}
                totalPages={totalPages}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onTransactionSelect={handleTransactionSelect}
                onSort={handleSort}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ReportsSection apiUrl={apiUrl} />
            </TabsContent>

            <TabsContent value="config" className="mt-0">
              <ConfigPanel onSave={handleConfigSave} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

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

export default Home;
