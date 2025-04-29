
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        setIsSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Citizen Ledger
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Blockchain-powered civic participation
          </p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive password reset instructions
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
                
                <div className="flex items-center justify-center">
                  <Link 
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-6 pb-6">
              <div className="rounded-lg bg-green-50 p-4 text-green-800">
                <p className="text-center">
                  Password reset instructions have been sent to <strong>{email}</strong>
                </p>
                <p className="mt-2 text-center text-sm">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link 
                  to="/login"
                  className="inline-flex items-center font-medium text-primary hover:underline"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Return to login
                </Link>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-center text-xs text-gray-500">
                  Note: In this demo, no actual email is sent.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
