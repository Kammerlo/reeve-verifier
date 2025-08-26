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
import { Organisation } from "@/types/organisation";

const Home = () => {
  const [apiUrl] = useState<string>(
    import.meta.env.VITE_API_URL || "http://localhost:9000",
  );
  
  const [organisation, setOrganisation] = useState<Organisation | null>(null);

  const handleConnectWallet = () => {
    // Wallet connection logic will be implemented later
    console.log("Connect Wallet clicked");
  };

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
        {organisation && (
          <div className="mt-4 p-3 rounded bg-muted flex items-center gap-2">
        <span className="font-semibold">Organisation:</span>
        <span>{organisation.name}</span>
          </div>
        )}
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
                apiUrl={apiUrl}
                organisation={organisation}
              />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ReportsSection apiUrl={apiUrl} organisation={organisation} />
            </TabsContent>

            <TabsContent value="config" className="mt-0">
              <ConfigPanel setOrganisation={setOrganisation} organisation={organisation} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Home;
