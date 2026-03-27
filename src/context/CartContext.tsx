import React, { createContext, useContext, useState, useCallback } from "react";
import { Game } from "@/data/games";

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  tipo: "jogo" | "dlc";
}

interface CartContextType {
  items: CartItem[];
  addItem: (game: Game) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((game: Game) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === game.id)) return prev;
      return [...prev, { id: game.id, nome: game.nome, preco: game.preco, imagem: game.imagem, tipo: "jogo" }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback((id: number) => items.some((i) => i.id === id), [items]);

  const total = items.reduce((sum, i) => sum + i.preco, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, total, count: items.length, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
