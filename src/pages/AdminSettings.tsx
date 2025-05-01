
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, Shield, KeyRound, BadgeAlert } from "lucide-react";
import { useBlockchain } from "@/hooks/useBlockchain";

const AdminSettings = () => {
  const { user } = useAuth();
  const { verifyBlockchainTransaction } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);

  // System Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [blockchainEnabled, setBlockchainEnabled] = useState(true);

  // Security Settings State
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    expireAfterDays: 90
  });

  // API Settings State
  const [apiKeys, setApiKeys] = useState({
    defaultLimit: "100",
    tokenLifespan: "30"
  });

  // Handle save settings
  const handleSaveSystemSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create blockchain transaction for settings change
      // This would record the settings change in the blockchain for audit purposes
      toast.success("System settings updated successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to update system settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle security settings save
  const handleSaveSecuritySettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Security settings updated successfully");
    } catch (error) {
      console.error("Error saving security settings:", error);
      toast.error("Failed to update security settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API settings save
  const handleSaveApiSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("API settings updated successfully");
    } catch (error) {
      console.error("Error saving API settings:", error);
      toast.error("Failed to update API settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle blockchain verification
  const verifyBlockchainIntegrity = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Blockchain integrity verified successfully");
    } catch (error) {
      console.error("Error verifying blockchain:", error);
      toast.error("Failed to verify blockchain integrity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">
            Manage global application settings and configurations
          </p>
        </div>

        <Tabs defaultValue="system">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API & Integration</TabsTrigger>
          </TabsList>
          
          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, only admins can access the system
                    </p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <Switch
                    id="registration"
                    checked={registrationEnabled}
                    onCheckedChange={setRegistrationEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voting">Voting System</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable citizens to vote on demands
                    </p>
                  </div>
                  <Switch
                    id="voting"
                    checked={votingEnabled}
                    onCheckedChange={setVotingEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="blockchain">Blockchain Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable blockchain verification for all transactions
                    </p>
                  </div>
                  <Switch
                    id="blockchain"
                    checked={blockchainEnabled}
                    onCheckedChange={setBlockchainEnabled}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={verifyBlockchainIntegrity}
                  disabled={isLoading || !blockchainEnabled}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Verify Blockchain Integrity
                </Button>
                <Button 
                  onClick={handleSaveSystemSettings}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security policies and user authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Password Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      min="6"
                      max="20"
                      value={passwordPolicy.minLength}
                      onChange={(e) => setPasswordPolicy({ 
                        ...passwordPolicy, 
                        minLength: parseInt(e.target.value) 
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expireAfterDays">Password Expiry (Days)</Label>
                    <Input
                      id="expireAfterDays"
                      type="number"
                      min="0"
                      max="365"
                      value={passwordPolicy.expireAfterDays}
                      onChange={(e) => setPasswordPolicy({ 
                        ...passwordPolicy, 
                        expireAfterDays: parseInt(e.target.value) 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Set to 0 for no expiry
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                    </div>
                    <Switch
                      id="requireUppercase"
                      checked={passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => setPasswordPolicy({ 
                        ...passwordPolicy, 
                        requireUppercase: checked 
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireNumbers">Require Numbers</Label>
                    </div>
                    <Switch
                      id="requireNumbers"
                      checked={passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => setPasswordPolicy({ 
                        ...passwordPolicy, 
                        requireNumbers: checked 
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    </div>
                    <Switch
                      id="requireSpecialChars"
                      checked={passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => setPasswordPolicy({ 
                        ...passwordPolicy, 
                        requireSpecialChars: checked 
                      })}
                    />
                  </div>
                  
                  <Separator />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSecuritySettings} 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* API Settings Tab */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Configure API limits and integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultLimit">Default API Rate Limit</Label>
                    <Input
                      id="defaultLimit"
                      value={apiKeys.defaultLimit}
                      onChange={(e) => setApiKeys({ 
                        ...apiKeys, 
                        defaultLimit: e.target.value 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of API requests per minute
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tokenLifespan">Token Lifespan (Days)</Label>
                    <Input
                      id="tokenLifespan"
                      value={apiKeys.tokenLifespan}
                      onChange={(e) => setApiKeys({ 
                        ...apiKeys, 
                        tokenLifespan: e.target.value 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days until API tokens expire
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>API Keys</Label>
                    <div className="rounded-md bg-slate-50 p-4">
                      <p className="flex items-center text-sm font-medium">
                        <KeyRound className="mr-2 h-4 w-4 text-amber-600" />
                        This is a demo application
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        In a production environment, this section would allow generating and managing API keys
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Webhooks</Label>
                    <div className="rounded-md bg-slate-50 p-4">
                      <p className="flex items-center text-sm font-medium">
                        <BadgeAlert className="mr-2 h-4 w-4 text-amber-600" />
                        This is a demo application
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        In a production environment, this section would allow configuring webhooks for system events
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveApiSettings}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save API Settings
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
