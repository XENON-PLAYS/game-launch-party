import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle } from "lucide-react";
import { useState } from "react";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const [done, setDone] = useState(false);

  const formatPreco = (v: number) => (v === 0 ? "Grátis" : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Downloads Iniciados!</h1>
          <p className="text-muted-foreground mb-8">Seus torrents estão prontos para download.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CartPopup />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-xl text-muted-foreground mb-4">Seu carrinho está vazio</p>
          <Link to="/" className="text-primary hover:underline">Voltar ao catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartPopup />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <h1 className="text-2xl font-bold mb-6">Finalizar Downloads</h1>

        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
              <img src={item.imagem} alt={item.nome} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-bold">{item.nome}</p>
                <p className="text-primary text-sm font-bold">{formatPreco(item.preco)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span className="text-primary">{formatPreco(total)}</span>
          </div>
          <button
            onClick={() => { clearCart(); setDone(true); }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Iniciar Downloads
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
