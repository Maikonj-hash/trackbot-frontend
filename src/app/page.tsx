"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Phone, Info, LayoutDashboard, History, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/constants";
import { DashboardMetrics } from "@/types/models";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalInstances: 0,
    totalMessages: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/metrics/dashboard`);
      if (res.ok) {
        const json = await res.json();
        setMetrics(json.data);
      }
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const MetricLoader = () => (
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/30" />
  );

  return (
    <div className="flex-1 space-y-8 p-8 bg-background w-full overflow-y-auto custom-scrollbar font-sans">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Painel de Controle</h1>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Visão geral do desempenho e conexões do seu ecossistema.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 hover:border-blue-600/30 transition-all group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Instâncias Conectadas</CardTitle>
            <Phone className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">
              {isLoading ? <MetricLoader /> : metrics.totalInstances}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono opacity-60">Chips e Meta API Ativas</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 hover:border-blue-600/30 transition-all group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Volume de Mensagens</CardTitle>
            <History className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">
              {isLoading ? <MetricLoader /> : metrics.totalMessages}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono opacity-60">Trafegadas pelo sistema</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 hover:border-blue-600/30 transition-all group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Total de Clientes</CardTitle>
            <Bot className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">
              {isLoading ? <MetricLoader /> : metrics.totalUsers}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono opacity-60">Clientes Identificados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <Card className="col-span-4 border-border/50 bg-card/30">
          <CardHeader className="border-b border-border/40 mb-6">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Tráfego de Mensagens</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600/5 flex items-center justify-center">
                <History className="w-8 h-8 text-blue-600/20" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight">Gráfico de Atividade</h4>
                <p className="text-[10px] text-muted-foreground max-w-[200px] mt-1">Análise temporal de mensagens recebidas vs enviadas (Disponível em breve).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 bg-card/30">
          <CardHeader className="border-b border-border/40 mb-6">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Status da Infra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600/5 border border-blue-600/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase font-bold">API Server</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600/5 border border-blue-600/10 opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono uppercase font-bold">PostgreSQL</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600/5 border border-blue-600/10 opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono uppercase font-bold">Redis Cache</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
