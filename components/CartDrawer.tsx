"use client";

import React from "react";
import Link from "next/link";
import { Book } from "@/lib/data/books";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, BookOpen } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartBooks: Book[];
  onRemoveFromCart: (bookId: string) => void;
  onOpenReader: (book: Book) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartBooks,
  onRemoveFromCart,
  onOpenReader,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const total = cartBooks.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f5] border-l border-[#e8e2d9] shadow-2xl flex flex-col justify-between p-6 sm:p-8">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-stone-900" />
                <h2 className="font-serif text-xl font-bold text-stone-900">Your Cart</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                  {cartBooks.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {cartBooks.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-stone-500 font-mono">Your digital cart is empty</p>
                  <Link
                    href="/books"
                    onClick={onClose}
                    className="inline-block px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
                  >
                    Browse Ebook Store
                  </Link>
                </div>
              ) : (
                cartBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 rounded-2xl bg-white border border-[#e5decb] shadow-xs flex gap-3 items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-stone-500">By {book.author}</p>
                      <div className="font-serif text-sm font-bold text-stone-900">
                        ${book.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenReader(book);
                        }}
                        className="p-1.5 text-stone-500 hover:text-amber-800"
                        title="Preview book"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(book.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Checkout CTA */}
          {cartBooks.length > 0 && (
            <div className="pt-6 border-t border-[#e8e2d9] space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-stone-600">
                  <span>Digital Shipping:</span>
                  <span className="font-bold text-emerald-700 uppercase">FREE (INSTANT)</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs font-mono text-stone-500 uppercase font-bold">Total:</span>
                  <span className="font-serif text-2xl font-bold text-stone-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href={`/checkout?bookId=${cartBooks[0].id}`}
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
