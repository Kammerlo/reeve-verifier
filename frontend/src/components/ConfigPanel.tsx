import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Save, Construction } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Organisation } from "@/types/organisation";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ConfigPanelProps {
  apiUrl?: string;
  setOrganisation: (org: Organisation) => void;
  organisation: Organisation | null;
}

const ConfigPanel = ({ apiUrl = "http://localhost:9000", setOrganisation, organisation }: ConfigPanelProps) => {

  const [error, setError] = useState<string>("");
  const [availableOrganisations, setAvailableOrganisations] = useState<Organisation[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/organisations`)
      .then((response) => response.json())
      .then((data) => {
        setAvailableOrganisations(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [apiUrl]);

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle>Organization Configuration</CardTitle>
        <CardDescription>Configure your organization settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableOrganisations.length > 0 ? (
          <ScrollArea>
            <div className="flex flex-col space-y-2">
              {availableOrganisations.map((org) => (
                <div
                  key={org.id}
                  className={`p-3 border-b border-gray-200 cursor-pointer rounded transition-colors ${organisation?.id === org.id
                    ? "bg-gray-200 border-gray-400"
                    : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                  organisation?.id === org.id
                    ? setOrganisation(null)
                    : setOrganisation(org)
                  }
                  tabIndex={0}
                  role="button"
                  aria-pressed={organisation?.id === org.id}
                >
                  <div className="font-bold text-lg">{org.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                  {org.countryCode || "No country code available"} | {org.currencyId || "No currency set"} | {org.taxIdNumber || "No tax ID"}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p>No organizations available</p>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}


      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
