import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Loader2,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Report, ReportField, ParsedReportItem } from "@/types/transaction";
import { Organisation } from "@/types/organisation";
import { SearchBody } from "@/types/searchBody";

interface ReportsSectionProps {
  apiUrl?: string;
  organisation: Organisation | null;
}

const ReportsSection = ({
  apiUrl = "http://localhost:9000",
  organisation
}: ReportsSectionProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedSubType, setSelectedSubType] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Extract unique values for filters
  const years = [...new Set(reports.map((report) => report.year))];
  const periods = [...new Set(reports.map((report) => report.period))];
  const subTypes = [...new Set(reports.map((report) => report.type))];

  // Filter reports based on selections
  const filteredReports = reports.filter((report) => {
    if (activeTab === "filtered") {
      return (
        (selectedYear ? report.year === selectedYear : true) &&
        (selectedPeriod ? report.period === parseInt(selectedPeriod) : true) &&
        (selectedSubType ? report.type === selectedSubType : true)
      );
    }
    return true;
  });

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      let body: SearchBody = {};
      if (organisation) {
        body.organisationId = organisation.id;
      }
      const url = `${apiUrl}/api/v1/reports`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error(`Error fetching reports: ${response.statusText}`);
      }
      const data = await response.json();
      setReports(data.reports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiUrl) {
      fetchReports();
    }
  }, [apiUrl]);

  // Parse nested report structure recursively
  const parseReportFields = (
    obj: any,
    path: string[] = [],
  ): ParsedReportItem[] => {
    const items: ParsedReportItem[] = [];

    if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];

        if (typeof value === "string") {
          // Try to parse the string as a number
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            items.push({ path: currentPath, value: numValue });
          } else {
            items.push({ path: currentPath, value: 0 });
          }
        } else if (typeof value === "number") {
          items.push({ path: currentPath, value });
        } else if (typeof value === "object" && value !== null) {
          // Recursively parse nested objects
          items.push(...parseReportFields(value, currentPath));
        }
      });
    }

    return items;
  };

  // Parse snake_case to normal case
  const parseSnakeCase = (str: string): string => {
    return str ? str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") : str;
  };

  // Group parsed items by their first level for better visualization
  const groupParsedItems = (items: ParsedReportItem[]) => {
    const groups: Record<string, ParsedReportItem[]> = {};

    items.forEach((item) => {
      const groupKey = item.path[0] || "Other";
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const renderReportFields = (fields: Record<string, ReportField>) => {
    const parsedItems = parseReportFields(fields);
    const groupedItems = groupParsedItems(parsedItems);

    return (
      <div className="space-y-3">
        {Object.entries(groupedItems).map(([groupName, items]) => {
          const isOpen = openGroups[groupName] ?? false;
          const groupTotal = items.reduce((sum, item) => sum + item.value, 0);

          return (
            <Collapsible
              key={groupName}
              open={isOpen}
              onOpenChange={(open) =>
                setOpenGroups((prev) => ({ ...prev, [groupName]: open }))
              }
            >
              <div className="border rounded-md overflow-hidden">
                <CollapsibleTrigger asChild>
                  <div className="bg-muted/30 px-3 py-2 font-semibold text-sm cursor-pointer hover:bg-muted/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span>
                        {parseSnakeCase(groupName)} ({items.length})
                      </span>
                    </div>
                    <span
                      className={`font-mono text-sm ${groupTotal < 0
                          ? "text-negative"
                          : groupTotal > 0
                            ? "text-positive"
                            : ""
                        }`}
                    >
                      {groupTotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="divide-y">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 flex justify-between items-center hover:bg-muted/20"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {parseSnakeCase(
                              item.path.slice(1).join(" → ") || item.path[0],
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div
                            className={`font-mono font-semibold text-sm ${item.value < 0
                                ? "text-negative"
                                : item.value > 0
                                  ? "text-positive"
                                  : ""
                              }`}
                          >
                            {item.value.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full bg-background p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Accounting Reports</CardTitle>
              <CardDescription>
                View and filter financial reports by period and type
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchReports}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >

            <TabsContent value="filtered">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="w-full sm:w-auto">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Years</SelectItem>
                      {years.map((year, idx) => (
                        <SelectItem key={`${year}-${idx}`} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-auto">
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Periods</SelectItem>
                      {periods.map((period, idx) => (
                        <SelectItem key={`${period}-${idx}`} value={period.toString()}>
                          Period {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-auto">
                  <Select
                    value={selectedSubType}
                    onValueChange={setSelectedSubType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {subTypes.map((subType, idx) => (
                        <SelectItem key={`${subType}-${idx}`} value={subType}>
                          {parseSnakeCase(subType)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <div className="mt-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredReports.length > 0 ? (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.ver} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">
                              {parseSnakeCase(report.type)} - {report.year}{" "}
                              (Period {report.period})
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {report.intervalType} | ID: {report.ver} | Transaction Hash: <a
                                href={`https://explorer.cardano.org/transaction/${report.blockChainHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline font-mono text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {report.blockChainHash.substring(0, 12)}...
                              </a>
                            </CardDescription>
                          </div>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-3">
                        {renderReportFields(report.fields)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {reports.length > 0
                    ? "No reports match the selected filters"
                    : "No reports available"}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
