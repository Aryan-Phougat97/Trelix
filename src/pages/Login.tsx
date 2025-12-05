// src/pages/Login.tsx
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate("/"); // Redirect to dashboard on success
    } catch (error) {
      // Error is handled by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px] pointer-events-none"></div>
      
      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Enter your credentials to sync your OS" : "Start your journey with Trelix"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
            </Button>
            
            <div className="text-center text-sm pt-2">
              <span 
                className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;