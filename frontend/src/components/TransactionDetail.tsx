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
import { Transaction } from "@/types/transaction.ts";

interface TransactionDetailProps {
  transaction?: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetail = ({
  transaction,
  isOpen = true,
  onClose = () => { },
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
            View detailed information about transaction {transaction.transactionInternalNumber}
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
                  <p className="text-lg font-semibold">{transaction.transactionInternalNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-lg font-semibold">
                    {formatDate(transaction.entryDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <Badge variant="outline" className="mt-1">
                    {transaction.transactionType}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Transaction Hash
                  </h3>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://explorer.cardano.org/transaction/${transaction.blockChainHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      <CopyableField
                        value={transaction.blockChainHash}
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
                    {transaction.amountLcy} {transaction.documentCurrencyCustomerCode || "USD"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
