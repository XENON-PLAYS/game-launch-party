import { useState, useEffect } from "react";

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

  useEffect(() => {
    onChange(reqs);
  }, [reqs]);

  const handleChange = (key: string, val: string) => {
    setReqs(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
      <h4 className="text-xs font-black uppercase tracking-widest text-primary">{label}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(reqs).map((key) => (
          <div key={key} className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              {key === "placa" ? "GPU" : key === "memoria" ? "RAM" : key === "armazenamento" ? "Disco" : key}
            </label>
            <input 
              type="text" 
              value={reqs[key] || ""} 
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={`Ex: ${key === 'memoria' ? '8 GB' : key === 'placa' ? 'GTX 1060' : '...'}`}
              className="admin-input !py-2 !text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}