import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, FileText, UserCheck, CheckCircle } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    if (!user) return navigate("/login");

    switch (user.role) {
      case "Common Citizen":
        navigate("/citizen");
        break;
      case "MLA":
        navigate("/mla");
        break;
      case "Higher Public Officer":
        navigate("/officer");
        break;
      case "Admin":
        navigate("/admin");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 py-20 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          {/* Shield Image */}
          <img 
            src="/image_shield.png" 
            alt="Shield Logo" 
            className="mx-auto mb-8 h-64 w-64"
          />

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Securing Holistic and Inclusive E-Leadership through Decentralized Technologies
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-200">
            A blockchain-powered platform connecting citizens with elected representatives and public officials for transparent governance and community development.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-white px-8 py-6 text-lg font-semibold text-slate-900 hover:bg-slate-100"
              onClick={navigateToDashboard}
            >
              {user ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Blockchain animation */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-16 w-16 rounded-md border-2 border-white/30 bg-white/10 backdrop-blur-sm ${
                    i % 2 === 0 ? "animate-pulse-slow" : ""
                  }`}
                >
                  <div className="flex h-full items-center justify-center">
                    <div className="text-xs font-mono opacity-70">
                      Block {i+1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-t-4 border-t-citizen">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-6 w-6 text-citizen" />
                  Submit Demands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Citizens propose demands for community development and public welfare.</p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-mla">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-6 w-6 text-mla" />
                  MLA Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>MLAs review and forward legitimate citizen demands to higher officials.</p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-officer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6 text-officer" />
                  Official Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Public officers evaluate and approve demands for implementation.</p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-admin">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-6 w-6 text-admin" />
                  Blockchain Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>All actions are securely recorded on the blockchain for transparency.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Policies Preview */}
      <img 
            src="/d3ai12.png" 
            alt="Architecture Diagram" 
            className="mx-auto"
          />
      <section className="bg-slate-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Recently Approved Policies
          </h2>
          <p className="mb-12 text-center text-gray-600">
            Explore policies created from citizen demands
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Green Urban Development Initiative",
                description: "Establishing eco-friendly urban planning guidelines based on citizen inputs.",
                date: "April 15, 2025",
                officer: "Robert Officer"
              },
              {
                title: "Rural Education Enhancement Program",
                description: "Improving educational infrastructure in rural communities.",
                date: "April 12, 2025",
                officer: "Robert Officer"
              },
              {
                title: "Public Transport Expansion",
                description: "Extending public transportation services to underserved neighborhoods.",
                date: "April 5, 2025",
                officer: "Robert Officer"
              }
            ].map((policy, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">{policy.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Effective: {policy.date}</span>
                    <span className="text-gray-500">By: {policy.officer}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button 
              variant="outline" 
              onClick={navigateToDashboard}
              className="gap-2"
            >
              View All Policies
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 text-center text-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Citizen Ledger Vision</h3>
            <p className="mt-2 text-slate-300">Blockchain-powered civic participation</p>
          </div>

          <div className="mb-6 flex justify-center space-x-6">
            <Link to="/" className="text-slate-300 hover:text-white hover:underline">Home</Link>
            <Link to="/login" className="text-slate-300 hover:text-white hover:underline">Login</Link>
            <Link to="/register" className="text-slate-300 hover:text-white hover:underline">Register</Link>
          </div>

          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Citizen Ledger Vision. All rights reserved.
            This is a prototype application demonstrating blockchain concepts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
