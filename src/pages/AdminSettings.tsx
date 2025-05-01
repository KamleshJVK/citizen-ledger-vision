
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, Shield, Blockchain, KeyRound, BadgeAlert } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // General settings
  const [appName, setAppName] = useState("Citizen Ledger Vision");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "A blockchain-powered platform connecting citizens with elected representatives and public officials for transparent governance and community development."
  );
  
  // Security settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [require2FA, setRequire2FA] = useState(false);
  const [aadharVerification, setAadharVerification] = useState(true);
  
  // Blockchain settings
  const [blockchainNode, setBlockchainNode] = useState("https://blockchain.citizenledger.gov.in");
  const [transactionTimeout, setTransactionTimeout] = useState("60");
  const [consensusThreshold, setConsensusThreshold] = useState("75");

  const handleSaveSettings = async (type: string) => {
    setIsSaving(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${type} settings saved successfully`);
    } catch (error) {
      console.error(`Error saving ${type} settings:`, error);
      toast.error(`Failed to save ${type} settings. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyBlockchain = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Blockchain integrity verified successfully");
    } catch (error) {
      console.error("Error verifying blockchain:", error);
      toast.error("Failed to verify blockchain integrity. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">
            Configure and manage platform settings
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Platform Name</Label>
                  <Input 
                    id="appName" 
                    value={appName} 
                    onChange={(e) => setAppName(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea 
                    id="welcomeMessage" 
                    className="min-h-32"
                    value={welcomeMessage} 
                    onChange={(e) => setWelcomeMessage(e.target.value)} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveSettings("General")}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security measures and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailVerification">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify their email address before accessing the platform
                    </p>
                  </div>
                  <Switch
                    id="emailVerification"
                    checked={requireEmailVerification}
                    onCheckedChange={setRequireEmailVerification}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for all users
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={require2FA}
                    onCheckedChange={setRequire2FA}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="aadharVerification">Aadhar Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Verify Aadhar number during registration
                    </p>
                  </div>
                  <Switch
                    id="aadharVerification"
                    checked={aadharVerification}
                    onCheckedChange={setAadharVerification}
                  />
                </div>
                
                <div className="pt-4">
                  <div className="rounded-md bg-amber-50 p-4 text-amber-800">
                    <div className="flex">
                      <BadgeAlert className="h-5 w-5 mr-2" />
                      <div>
                        <h3 className="font-medium">Security Notice</h3>
                        <p className="text-sm">
                          Changing security settings will affect all users and may require them to re-authenticate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveSettings("Security")}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Update Security
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Blockchain Settings */}
          <TabsContent value="blockchain" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Configuration</CardTitle>
                <CardDescription>
                  Configure blockchain settings for the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blockchainNode">Blockchain Node URL</Label>
                  <Input 
                    id="blockchainNode" 
                    value={blockchainNode} 
                    onChange={(e) => setBlockchainNode(e.target.value)} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionTimeout">Transaction Timeout (seconds)</Label>
                    <Input 
                      id="transactionTimeout" 
                      type="number"
                      value={transactionTimeout} 
                      onChange={(e) => setTransactionTimeout(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="consensusThreshold">Consensus Threshold (%)</Label>
                    <Input 
                      id="consensusThreshold" 
                      type="number"
                      min="0"
                      max="100"
                      value={consensusThreshold} 
                      onChange={(e) => setConsensusThreshold(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="pt-4 space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleVerifyBlockchain}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying Blockchain Integrity...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Verify Blockchain Integrity
                      </>
                    )}
                  </Button>
                  
                  <div className="rounded-md bg-blue-50 p-4 text-blue-800">
                    <div className="flex">
                      <Blockchain className="h-5 w-5 mr-2" />
                      <div>
                        <h3 className="font-medium">Blockchain Status</h3>
                        <p className="text-sm">
                          Current chain: 421,592 blocks | Last verified: 2025-05-01 09:23:14
                        </p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          All transactions verified and secure
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-neutral-100 p-4">
                    <div className="flex">
                      <KeyRound className="h-5 w-5 mr-2" />
                      <div>
                        <h3 className="font-medium">Your Public Key</h3>
                        <p className="text-xs font-mono break-all mt-1">
                          {user?.publicKey}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveSettings("Blockchain")}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </>
                  )}
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
