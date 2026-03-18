"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, Bot } from "lucide-react";
import { toast } from "sonner";
import { api, AUTH_TOKEN_KEY } from "@/lib/api-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = await res.json();

      if (res.ok) {
        Cookies.set(AUTH_TOKEN_KEY, data.access_token, { expires: 7 }); // 7 dias
        toast.success("Login realizado com sucesso!");
        router.push("/");
      } else {
        toast.error(data.message || "Erro ao realizar login");
      }
    } catch (error) {
      toast.error("Erro na conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_50%)]" />
      
      <div className="w-full max-w-md p-4 relative z-10">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Bot className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Track-Bot</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono opacity-60">Admin Control Center</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Entrar</CardTitle>
            <CardDescription className="text-xs">
              Insira suas credenciais de administrador para acessar o painel.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase font-mono tracking-tight opacity-70">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@trackland.com.br" 
                    className="pl-10 bg-background/50 border-border/40 focus:border-blue-600 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase font-mono tracking-tight opacity-70">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 bg-background/50 border-border/40 focus:border-blue-600 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 shadow-lg shadow-blue-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Acessar Painel"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase font-mono tracking-widest opacity-40">
          Powered by Trackland © 2026
        </p>
      </div>
    </div>
  );
}
