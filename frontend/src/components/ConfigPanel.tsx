import React, { useState } from "react";
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

interface ConfigPanelProps {
  onSave?: (config: ConfigSettings) => void;
  initialConfig?: ConfigSettings;
}

export interface ConfigSettings {
  organizationId: string;
}

const ConfigPanel = ({ onSave, initialConfig }: ConfigPanelProps = {}) => {
  const defaultConfig: ConfigSettings = {
    organizationId: "",
  };

  const [config, setConfig] = useState<ConfigSettings>(
    initialConfig || defaultConfig,
  );
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const validateConfig = () => {
    if (!config.organizationId.trim()) {
      setError("Organization ID is required");
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = () => {
    if (validateConfig()) {
      onSave?.(config);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle>Organization Configuration</CardTitle>
        <CardDescription>Configure your organization settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <Construction className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            This configuration panel is currently under construction and not yet
            functional.
          </AlertDescription>
        </Alert>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="organizationId">Organization ID</Label>
          <Input
            id="organizationId"
            name="organizationId"
            placeholder="Enter your organization ID"
            value={config.organizationId}
            onChange={handleInputChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigPanel;
