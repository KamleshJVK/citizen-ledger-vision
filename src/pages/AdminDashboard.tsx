
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BarChart3, FileText, UserCheck, Users } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                +6 new registrations this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Demands</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">
                +12 new demands this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved Demands</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                48% approval rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                +3 new policies this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="border-t-4 border-t-admin">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Real-time blockchain statistics and system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Transactions
                  </div>
                  <div className="text-2xl font-bold">1,248</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Storage Usage
                  </div>
                  <div className="text-2xl font-bold">46.8 MB</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Block Height
                  </div>
                  <div className="text-2xl font-bold">428</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    System Uptime
                  </div>
                  <div className="text-2xl font-bold">99.9%</div>
                </div>
              </div>
              
              <div className="rounded-md border bg-slate-50 p-4">
                <div className="text-sm font-medium">Last Verified Block</div>
                <div className="mt-1 font-mono text-xs">
                  hash_7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Verified at: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Roles Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>
              User count by role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>Common Citizens</div>
                <div className="font-medium">108</div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 w-[87%] rounded-full bg-citizen"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>MLAs</div>
                <div className="font-medium">8</div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 w-[6%] rounded-full bg-mla"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>Higher Public Officers</div>
                <div className="font-medium">5</div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 w-[4%] rounded-full bg-officer"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>Admins</div>
                <div className="font-medium">3</div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 w-[3%] rounded-full bg-admin"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
