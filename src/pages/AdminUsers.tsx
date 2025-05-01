
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User, UserRole } from "@/types";
import { UserPlus, Search, MoreHorizontal, Check, Shield, User as UserIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Citizen",
    email: "citizen@example.com",
    role: "Common Citizen",
    publicKey: "pk_ctz_8f72bd9e3a4c1d5f",
    createdAt: "2025-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Mary MLA",
    email: "mla@example.com",
    role: "MLA",
    publicKey: "pk_mla_6d2c8a9f1b7e4d3a",
    createdAt: "2025-01-10T14:20:00Z"
  },
  {
    id: "3",
    name: "Robert Officer",
    email: "officer@example.com",
    role: "Higher Public Officer",
    publicKey: "pk_off_4a7b3c8d9e2f1a5c",
    createdAt: "2025-01-05T09:15:00Z"
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    publicKey: "pk_adm_2c1d9e8f3a7b4c6d",
    createdAt: "2024-12-20T11:45:00Z"
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex@example.com",
    role: "Common Citizen",
    publicKey: "pk_ctz_3e4f5g6h7i8j9k0l",
    createdAt: "2025-02-05T16:20:00Z"
  },
  {
    id: "6",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "Common Citizen",
    publicKey: "pk_ctz_1a2b3c4d5e6f7g8h",
    createdAt: "2025-02-10T13:30:00Z"
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james@example.com",
    role: "Common Citizen",
    publicKey: "pk_ctz_9i0j1k2l3m4n5o6p",
    createdAt: "2025-02-15T10:45:00Z"
  },
  {
    id: "8",
    name: "David Chen",
    email: "david@example.com", 
    role: "MLA",
    publicKey: "pk_mla_7q8r9s0t1u2v3w4x",
    createdAt: "2025-01-25T14:50:00Z"
  }
];

const AdminUsers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getUserRoleBadge = (role: UserRole) => {
    switch (role) {
      case "Common Citizen":
        return <Badge className="bg-citizen text-white">Citizen</Badge>;
      case "MLA":
        return <Badge className="bg-mla text-white">MLA</Badge>;
      case "Higher Public Officer":
        return <Badge className="bg-officer text-white">Officer</Badge>;
      case "Admin":
        return <Badge className="bg-admin text-white">Admin</Badge>;
    }
  };

  const handleActionClick = (action: string, user: User) => {
    switch (action) {
      case "verify":
        toast.success(`User ${user.name} has been verified`);
        break;
      case "role":
        toast.success(`Role management dialog for ${user.name} would open here`);
        break;
      case "reset":
        toast.success(`Password reset email sent to ${user.email}`);
        break;
      case "delete":
        toast.success(`User ${user.name} has been deleted`);
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={roleFilter === "All" ? "default" : "outline"} 
              size="sm"
              onClick={() => setRoleFilter("All")}
            >
              All
            </Button>
            <Button 
              variant={roleFilter === "Common Citizen" ? "default" : "outline"}
              size="sm"
              className={roleFilter === "Common Citizen" ? "bg-citizen" : ""}
              onClick={() => setRoleFilter("Common Citizen")}
            >
              Citizens
            </Button>
            <Button 
              variant={roleFilter === "MLA" ? "default" : "outline"}
              size="sm"
              className={roleFilter === "MLA" ? "bg-mla" : ""}
              onClick={() => setRoleFilter("MLA")}
            >
              MLAs
            </Button>
            <Button 
              variant={roleFilter === "Higher Public Officer" ? "default" : "outline"}
              size="sm"
              className={roleFilter === "Higher Public Officer" ? "bg-officer" : ""}
              onClick={() => setRoleFilter("Higher Public Officer")}
            >
              Officers
            </Button>
            <Button 
              variant={roleFilter === "Admin" ? "default" : "outline"}
              size="sm"
              className={roleFilter === "Admin" ? "bg-admin" : ""}
              onClick={() => setRoleFilter("Admin")}
            >
              Admins
            </Button>
          </div>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Showing {filteredUsers.length} of {mockUsers.length} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Public Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                    <TableCell className="font-mono text-xs">{user.publicKey.substring(0, 12)}...</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleActionClick("verify", user)}>
                            <Check className="mr-2 h-4 w-4" />
                            <span>Verify User</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick("role", user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Manage Role</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick("reset", user)}>
                            <span>Reset Password</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleActionClick("delete", user)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role distribution */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Citizens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => u.role === "Common Citizen").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">MLAs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => u.role === "MLA").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Officers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => u.role === "Higher Public Officer").length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
