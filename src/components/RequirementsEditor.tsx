import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RequirementsEditorProps {
  initialValue: any;
  onChange: (value: any) => void;
  label: string;
}

export function RequirementsEditor({ initialValue, onChange, label }: RequirementsEditorProps) {
  const [reqs, setReqs] = useState<Record<string, string>>({
    processador: "",
    memoria: "",
    placa: "",
    armazenamento: "",
    os: "",
    ...initialValue
  });

  // Sync with initialValue when it changes (e.g. when switching games in edit mode)
  useEffect(() => {
    if (initialValue && typeof initialValue === 'object') {
      setReqs(prev => ({
        ...prev,
        ...initialValue
      }));
    }
  }, [initialValue]);

  useEffect(() => {
    onChange(reqs);
  }, [reqs, onChange]);

  const handleChange = (key: string, val: string) => {
    setReqs(prev => ({ ...prev, [key]: val }));
  };

  const getLabel = (key: string) => {
    switch (key.toLowerCase()) {
      case "placa": return "Placa de Vídeo (GPU)";
      case "memoria": return "Memória RAM";
      case "armazenamento": return "Espaço em Disco";
      case "os": return "Sistema Operacional";
      case "processador": return "Processador (CPU)";
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <div className="space-y-6 p-6 border border-border/40 rounded-2xl bg-muted/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg shadow-primary/20" />
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{label}</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.keys(reqs).map((key) => (
          <div key={key} className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">
              {getLabel(key)}
            </Label>
            <Input 
              type="text" 
              value={reqs[key] || ""} 
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={`Ex: ${key === 'memoria' ? '16 GB' : key === 'placa' ? 'RTX 3060' : '...'}`}
              className="h-11 rounded-xl bg-background/50 border-border/40 focus:border-primary/40 transition-all text-sm font-medium"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
