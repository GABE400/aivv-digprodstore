"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, BOOKS as INITIAL_BOOKS } from "@/lib/data/books";

interface StoreContextType {
  books: Book[];
  addBook: (newBook: Book) => void;
  deleteBook: (bookId: string) => void;
  updateBook: (updatedBook: Book) => void;
  clearDemoBooks: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aivv_store_books");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved books", e);
        }
      }
    }
    return INITIAL_BOOKS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aivv_store_books", JSON.stringify(books));
    }
  }, [books]);

  const addBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const deleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const updateBook = (updatedBook: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  };

  const clearDemoBooks = () => {
    setBooks([]);
  };

  return (
    <StoreContext.Provider value={{ books, addBook, deleteBook, updateBook, clearDemoBooks }}>
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
