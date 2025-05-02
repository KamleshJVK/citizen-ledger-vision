
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, Database, Shield, Key, Lock, Server } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const { user } = useAuth();
  
  // General settings
  const [systemName, setSystemName] = useState("Citizen Ledger");
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to Citizen Ledger - The transparent platform for citizen demands and government actions.");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  
  // Security settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [minimumPasswordLength, setMinimumPasswordLength] = useState("12");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  
  // Blockchain settings
  const [blockConfirmations, setBlockConfirmations] = useState("6");
  const [blockchainEndpoint, setBlockchainEndpoint] = useState("https://blockchain.citizenledger.gov/api");
  const [apiKey, setApiKey] = useState("sk_9f8e7d6c5b4a3211");
  
  // System settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [allowNewRegistrations, setAllowNewRegistrations] = useState(true);
  
  const handleSaveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            <p className="text-muted-foreground">
              Configure and manage system settings
            </p>
          </div>
          <Button variant="outline">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic system configuration and appearance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input
                    id="system-name"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-blockchain-info" checked={true} />
                  <Label htmlFor="show-blockchain-info">Show blockchain information on public pages</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('General')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Settings Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and access control settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="two-factor" 
                    checked={twoFactorRequired} 
                    onCheckedChange={setTwoFactorRequired}
                  />
                  <Label htmlFor="two-factor">Require two-factor authentication for all users</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-password">Minimum Password Length</Label>
                  <div className="flex items-center">
                    <Input
                      id="min-password"
                      type="number"
                      min="8"
                      max="32"
                      value={minimumPasswordLength}
                      onChange={(e) => setMinimumPasswordLength(e.target.value)}
                      className="w-24"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">characters</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <div className="flex items-center">
                    <Input
                      id="session-timeout"
                      type="number"
                      min="10"
                      max="240"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-24"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enforce-password-history" defaultChecked />
                  <Label htmlFor="enforce-password-history">Enforce password history (prevent reuse of last 5 passwords)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="lockout" defaultChecked />
                  <Label htmlFor="lockout">Enable account lockout after 5 failed login attempts</Label>
                </div>
                <div className="pt-4">
                  <Button variant="destructive" size="sm">
                    <Lock className="mr-2 h-4 w-4" />
                    Revoke All Sessions
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('Security')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Blockchain Settings Tab */}
          <TabsContent value="blockchain">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Configuration</CardTitle>
                <CardDescription>
                  Configure blockchain connectivity and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blockchain-endpoint">Blockchain API Endpoint</Label>
                  <Input
                    id="blockchain-endpoint"
                    value={blockchainEndpoint}
                    onChange={(e) => setBlockchainEndpoint(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockchain-api-key">API Key</Label>
                  <Input
                    id="blockchain-api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-confirmations">Required Block Confirmations</Label>
                  <Input
                    id="block-confirmations"
                    type="number"
                    min="1"
                    max="12"
                    value={blockConfirmations}
                    onChange={(e) => setBlockConfirmations(e.target.value)}
                    className="w-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of block confirmations required before a transaction is considered final
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-verify" defaultChecked />
                  <Label htmlFor="auto-verify">Automatically verify transactions on the blockchain</Label>
                </div>
                <div className="pt-4">
                  <Button variant="secondary" size="sm">
                    <Database className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('Blockchain')}>
                  <Key className="mr-2 h-4 w-4" />
                  Save Blockchain Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* System Settings Tab */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Advanced system settings and maintenance options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="maintenance-mode" 
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                  <Label htmlFor="maintenance-mode">
                    <span className="font-medium">Maintenance Mode</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      When enabled, only administrators can access the system
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="debug-mode" 
                    checked={debugMode}
                    onCheckedChange={setDebugMode}
                  />
                  <Label htmlFor="debug-mode">
                    <span className="font-medium">Debug Mode</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enable detailed logging and error messages
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="allow-registrations" 
                    checked={allowNewRegistrations}
                    onCheckedChange={setAllowNewRegistrations}
                  />
                  <Label htmlFor="allow-registrations">
                    <span className="font-medium">Allow New Registrations</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      When disabled, new users cannot register for accounts
                    </p>
                  </Label>
                </div>
                <div className="space-y-2 pt-4">
                  <Label>System Actions</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Purge Cache
                    </Button>
                    <Button variant="outline" size="sm">
                      Backup Database
                    </Button>
                    <Button variant="outline" size="sm">
                      System Log
                    </Button>
                    <Button variant="outline" size="sm">
                      Verify Data Integrity
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('System')}>
                  <Server className="mr-2 h-4 w-4" />
                  Save System Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
