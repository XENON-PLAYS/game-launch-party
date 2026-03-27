import { X, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

export function CartPopup() {
  const { items, removeItem, total, isOpen, setIsOpen, count } = useCart();

  if (!isOpen) return null;

  const formatPreco = (valor: number) =>
    valor === 0 ? "Grátis" : valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Carrinho ({count})
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                <img src={item.imagem} alt={item.nome} className="w-14 h-14 object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.nome}</p>
                  <p className="text-primary text-sm font-bold">{formatPreco(item.preco)}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPreco(total)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold transition-colors"
            >
              Finalizar Download
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
