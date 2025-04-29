
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart3, 
  FileText,
  LogOut, 
  Menu, 
  User, 
  Vote,
  FilePlus,
  CheckCircle,
  ClipboardList,
  Settings,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getNavItems = () => {
    switch(user?.role) {
      case "Common Citizen":
        return [
          { href: "/citizen", label: "Dashboard", icon: Home },
          { href: "/citizen/submit-demand", label: "Submit Demand", icon: FilePlus }
        ];
      case "MLA":
        return [
          { href: "/mla", label: "Dashboard", icon: Home },
          { href: "/mla/pending", label: "Review Demands", icon: ClipboardList }
        ];
      case "Higher Public Officer":
        return [
          { href: "/officer", label: "Dashboard", icon: Home },
          { href: "/officer/pending", label: "Approve Demands", icon: CheckCircle },
          { href: "/officer/policies", label: "Manage Policies", icon: FileText }
        ];
      case "Admin":
        return [
          { href: "/admin", label: "Dashboard", icon: Home },
          { href: "/admin/users", label: "Manage Users", icon: User },
          { href: "/admin/demands", label: "Manage Demands", icon: ClipboardList },
          { href: "/admin/settings", label: "Settings", icon: Settings }
        ];
      default:
        return [{ href: "/", label: "Home", icon: Home }];
    }
  };

  const navItems = getNavItems();
  const userRoleColor = user?.role === "Common Citizen" ? "citizen" : 
                       user?.role === "MLA" ? "mla" : 
                       user?.role === "Higher Public Officer" ? "officer" : 
                       "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:px-6 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">Citizen Ledger</span>
              </Link>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="flex flex-col space-y-1 px-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100",
                        location.pathname === item.href && "bg-gray-100"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <Button 
                  variant="ghost" 
                  className="flex w-full items-center justify-start px-3 py-2 text-gray-900 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className={`bg-${userRoleColor}-light text-${userRoleColor}`}>
                      {user ? getInitials(user.name) : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-between">
          <span className="text-xl font-bold">Citizen Ledger</span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`bg-${userRoleColor}-light text-${userRoleColor}`}>
              {user ? getInitials(user.name) : ""}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="flex-1 lg:grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="hidden border-r bg-gray-50/50 lg:block">
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">Citizen Ledger</span>
            </Link>
          </div>
          <div className="flex flex-col gap-2 p-6">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-gray-900 transition-colors hover:bg-gray-100",
                    location.pathname === item.href && "bg-gray-100 font-medium"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Button 
              variant="ghost" 
              className="flex w-full justify-start px-3 py-2 text-gray-900 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>

          <div className="absolute bottom-4 mx-6 mt-auto flex w-[232px] items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className={`bg-${userRoleColor}-light text-${userRoleColor}`}>
                  {user ? getInitials(user.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col">
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
