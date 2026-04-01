import React, { createContext, useContext, useState, useCallback } from "react";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (game: { id: string; nome: string; preco: number; imagem: string | null }) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((game: { id: string; nome: string; preco: number; imagem: string | null }) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === game.id)) return prev;
      return [...prev, { id: game.id, nome: game.nome, preco: game.preco, imagem: game.imagem || "" }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const isInCart = useCallback((id: string) => items.some((i) => i.id === id), [items]);
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
