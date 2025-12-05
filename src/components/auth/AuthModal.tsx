import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) await login(username, password);
      else await register(username, password);
      onClose();
    } catch (e) {
      // Error handled in context
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Login to Trelix" : "Create Account"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">{isLogin ? "Login" : "Sign Up"}</Button>
          <div className="text-center text-sm">
            <span className="text-muted-foreground cursor-pointer hover:underline" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
            </span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};