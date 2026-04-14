import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">
            Ops! Algo deu <span className="text-primary">errado</span>
          </h1>
          <p className="text-muted-foreground max-w-md mb-8 font-medium">
            Ocorreu um erro inesperado na aplicação. Não se preocupe, nosso sistema de segurança evitou uma tela preta.
          </p>
          
          <div className="bg-muted/30 border border-border rounded-xl p-4 mb-8 w-full max-w-lg overflow-auto max-h-40">
            <p className="text-xs font-mono text-destructive/80 text-left whitespace-pre-wrap">
              {this.state.error?.message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              variant="destructive"
              className="font-bold px-8 py-6 rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Limpar Cache e Recarregar
            </Button>
            <Button 
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="bg-muted/50 border-border hover:bg-muted text-foreground font-bold px-8 py-6 rounded-xl flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </div>

          
          <p className="mt-12 text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-black">
            Jogos Grátis - Sistema de Recuperação Ativo
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}