import { useState } from "react";
import { CheckCircle, Info, Shield, Download, AlertTriangle, ChevronRight, ChevronLeft, ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";

interface Step {
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
}

interface InstallationWizardProps {
  game: {
    nome: string;
    passo_a_passo?: string | null;
    pre_requisitos?: string | null;
    observacoes?: string | null;
  };
}

export const InstallationWizard = ({ game }: InstallationWizardProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: Step[] = [
    {
      title: "Download",
      description: "Obtendo os arquivos necessários",
      icon: Download,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-400">Download Iniciado!</p>
              <p className="text-sm text-muted-foreground">O arquivo está sendo baixado em seu navegador. Verifique a barra de downloads.</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dicas de Download:</p>
            <ul className="grid gap-3">
              {[
                "Use um gerenciador de downloads (como IDM) para maior velocidade.",
                "Não feche esta página até que o download esteja estável.",
                "Verifique se você tem espaço em disco suficiente."
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Preparação",
      description: "Prerrequisitos do sistema",
      icon: Info,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-4">
            <Info className="w-6 h-6 text-blue-400 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-blue-400">Verifique os Requisitos</p>
              <p className="text-sm text-muted-foreground">Certifique-se de ter os drivers e softwares básicos instalados.</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {[
              { name: "DirectX (Junho 2010)", url: "https://www.microsoft.com/en-us/download/details.aspx?id=8109" },
              { name: "Visual C++ Redistributable All-in-One", url: "https://www.techpowerup.com/download/visual-c-redistributable-runtime-package-all-in-one/" },
              { name: ".NET Framework 4.8", url: "https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48" }
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                <span className="font-medium text-sm">{req.name}</span>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <a href={req.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Baixar
                  </a>
                </Button>
              </div>
            ))}
          </div>
          
          {game.pre_requisitos && (
            <div className="p-4 rounded-xl border border-dashed border-border">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Específico para este jogo:</p>
              <p className="text-sm text-muted-foreground italic">{game.pre_requisitos}</p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Instalação",
      description: "Passo a passo detalhado",
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            {game.passo_a_passo ? (
              game.passo_a_passo.split(';').map((step, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-card border border-border group hover:border-primary/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground self-center group-hover:text-foreground transition-colors">{step.trim()}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-border rounded-3xl">
                <p className="text-muted-foreground">O guia padrão de instalação se aplica a este título.</p>
              </div>
            )}
          </div>
          
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
            <Shield className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-200/70">
              <strong>Nota:</strong> Alguns instaladores podem ser detectados como falsos-positivos por antivírus. Recomendamos desativar temporariamente durante a instalação.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Suporte",
      description: "Solução de problemas",
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            {[
              { q: "Erro de DLL ausente?", a: "Instale o pacote Visual C++ Redistributable que está no Passo 2." },
              { q: "O jogo não abre?", a: "Tente executar como Administrador clicando com o botão direito no ícone." },
              { q: "Arquivo corrompido?", a: "Verifique se seu antivírus não excluiu algum arquivo durante o download ou extração." }
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                <p className="font-bold text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  {faq.q}
                </p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
          
          <Button className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" variant="outline">
            Reportar Erro no Link / Instalação
          </Button>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-black uppercase tracking-tighter">Guia de Instalação</h3>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <span>Passo {activeStep + 1} de {steps.length}</span>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2" />
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === i;
          const isCompleted = completedSteps.includes(i) || activeStep > i;
          
          return (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="relative z-10 flex flex-col items-center group"
            >
              <div className={`
                w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500 border-4
                ${isActive ? "bg-primary border-primary shadow-[0_0_30px_rgba(249,115,22,0.4)] scale-110" : 
                  isCompleted ? "bg-emerald-500 border-emerald-500" : "bg-card border-border hover:border-primary/50"}
              `}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive || isCompleted ? "text-white" : "text-muted-foreground"}`} />
              </div>
              <span className={`
                absolute -bottom-8 text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-500
                ${isActive ? "text-primary" : isCompleted ? "text-emerald-500" : "text-muted-foreground"}
              `}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="mt-10 sm:mt-16 bg-gradient-to-b from-card/90 via-card/95 to-muted/10 border-2 border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-14 shadow-3xl min-h-[400px] sm:min-h-[450px] flex flex-col relative overflow-hidden group/wizard">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] -ml-32 -mb-32 pointer-events-none" />
        <div className="relative z-10 flex-1 space-y-12">
          <div className="space-y-2">
            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-widest flex items-center gap-3">
              {steps[activeStep].title}
              <span className="w-12 h-1 bg-primary rounded-full" />
            </h4>
            <p className="text-muted-foreground text-sm sm:text-base">{steps[activeStep].description}</p>
          </div>
          
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {steps[activeStep].content}
          </div>
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={activeStep === 0}
            className="font-bold uppercase tracking-widest text-xs"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <Button
            onClick={nextStep}
            className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-8 h-12 rounded-xl"
          >
            {activeStep === steps.length - 1 ? "Concluído" : "Próximo Passo"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
