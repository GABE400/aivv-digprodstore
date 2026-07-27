"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, BOOKS as INITIAL_BOOKS } from "@/lib/data/books";

interface StoreContextType {
  books: Book[];
  addBook: (newBook: Book) => Promise<{ success: boolean; error?: string } | void>;
  deleteBook: (bookId: string) => void;
  updateBook: (updatedBook: Book) => void;
  clearDemoBooks: () => void;
  resetToDefaultCatalog: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch products from server DB on mount
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.books)) {
          setBooks(json.books);
          localStorage.setItem("aivv_store_books_v5", JSON.stringify(json.books));
        }
      } catch (err) {
        console.warn("Failed to fetch products from DB API, using fallback:", err);
      } finally {
        if (isMounted) setIsInitialized(true);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Backup sync to localStorage for offline cache
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("aivv_store_books_v5", JSON.stringify(books));
      } catch (e) {}
    }
  }, [books, isInitialized]);

  const addBook = async (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      const json = await res.json();
      if (!json.success && json.error) {
        console.error("Server error persisting book to DB:", json.error);
        return { success: false, error: json.error };
      }
      return { success: true };
    } catch (e: any) {
      console.error("Failed to persist new product to DB:", e);
      return { success: false, error: e.message || "Failed to reach server" };
    }
  };

  const deleteBook = async (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    try {
      await fetch(`/api/products?id=${encodeURIComponent(bookId)}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete product from DB:", e);
    }
  };

  const updateBook = async (updatedBook: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });
    } catch (e) {
      console.error("Failed to update product in DB:", e);
    }
  };

  const clearDemoBooks = async () => {
    setBooks([]);
    try {
      await fetch("/api/products?clearAll=true", {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to clear products from DB:", e);
    }
  };

  const resetToDefaultCatalog = async () => {
    setBooks(INITIAL_BOOKS);
    try {
      await fetch("/api/products?clearAll=true", { method: "DELETE" });
      for (const b of INITIAL_BOOKS) {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(b),
        });
      }
    } catch (e) {}
  };

  return (
    <StoreContext.Provider
      value={{
        books,
        addBook,
        deleteBook,
        updateBook,
        clearDemoBooks,
        resetToDefaultCatalog,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
