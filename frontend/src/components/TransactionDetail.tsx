import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, X, Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Transaction} from "@/types/transaction.ts";

interface TransactionDetailProps {
  transaction?: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetail = ({
  transaction,
  isOpen = true,
  onClose = () => {},
}: TransactionDetailProps) => {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleItemsExpanded = () => {
    setIsItemsExpanded(!isItemsExpanded);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const calculateTotal = () => {
    return transaction.items
      .reduce((sum, item) => sum + parseFloat(item.amount), 0)
      .toFixed(2);
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const truncateString = (str: string, maxLength: number = 20) => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
  };

  const CopyableField = ({
    value,
    fieldName,
    maxLength = 20,
  }: {
    value: string;
    fieldName: string;
    maxLength?: number;
  }) => {
    const isCopied = copiedField === fieldName;

    return (
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-mono text-sm cursor-help">
                {truncateString(value, maxLength)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono text-xs break-all max-w-xs">{value}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => copyToClipboard(value, fieldName)}
          >
            {isCopied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </TooltipProvider>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">
              Transaction Details
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            View detailed information about transaction {transaction.number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Header Information */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Transaction Number
                  </h3>
                  <p className="text-lg font-semibold">{transaction.number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-lg font-semibold">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <Badge variant="outline" className="mt-1">
                    {transaction.type}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Accounting Period
                  </h3>
                  <p className="text-lg font-semibold">
                    {transaction.accounting_period}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Batch ID
                  </h3>
                  <CopyableField
                    value={transaction.batch_id}
                    fieldName="batchId"
                    maxLength={25}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Transaction Hash
                  </h3>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://explorer.cardano.org/transaction/${transaction.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      <CopyableField
                        value={transaction.tx_hash}
                        fieldName="txHash"
                        maxLength={25}
                      />
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Amount
                  </h3>
                  <p className="text-lg font-semibold text-primary">
                    {calculateTotal()} {transaction.items[0]?.currency || "USD"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Items */}
          <div>
            <Accordion type="single" collapsible defaultValue="items">
              <AccordionItem value="items">
                <AccordionTrigger className="text-lg font-semibold">
                  Transaction Items ({transaction.items.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left font-medium">Item ID</th>
                          <th className="p-2 text-left font-medium">
                            Document Number
                          </th>
                          <th className="p-2 text-right font-medium">Amount</th>
                          <th className="p-2 text-left font-medium">
                            Currency
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaction.items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-200 hover:bg-muted/50"
                          >
                            <td className="p-2 text-left">{item.id}</td>
                            <td className="p-2 text-left">
                              {item.document_number}
                            </td>
                            <td className="p-2 text-right font-medium">
                              {parseFloat(item.amount).toFixed(2)}
                            </td>
                            <td className="p-2 text-left">{item.currency}</td>
                          </tr>
                        ))}
                        <tr className="bg-muted/30">
                          <td className="p-2 text-left" colSpan={2}>
                            <strong>Total</strong>
                          </td>
                          <td className="p-2 text-right font-bold">
                            {calculateTotal()}
                          </td>
                          <td className="p-2 text-left">
                            {transaction.items[0]?.currency || "USD"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetail;
