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
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const STORAGE_KEY = "aivv_store_books_v3";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedBooks: Book[] = JSON.parse(saved);
        
        // Smart merge: Start with the latest INITIAL_BOOKS from server/code
        const initialBookIds = new Set(INITIAL_BOOKS.map((b) => b.id));
        
        // Keep custom user-created books (IDs not in INITIAL_BOOKS)
        const customBooks = savedBooks.filter((b) => !initialBookIds.has(b.id));

        // Merge latest INITIAL_BOOKS + custom user uploaded books
        setBooks([...INITIAL_BOOKS, ...customBooks]);
      } catch (e) {
        console.error("Failed to parse saved books", e);
        setBooks(INITIAL_BOOKS);
      }
    } else {
      setBooks(INITIAL_BOOKS);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        const STORAGE_KEY = "aivv_store_books_v3";
        const serialized = JSON.stringify(books);
        if (serialized.length > 3 * 1024 * 1024) {
          console.warn(
            `[AIVV Store] Book data is ${(serialized.length / 1024 / 1024).toFixed(1)}MB — ` +
            `approaching localStorage limit.`
          );
        }
        localStorage.setItem(STORAGE_KEY, serialized);
      } catch (e) {
        console.error("[AIVV Store] Failed to persist books to localStorage.", e);
      }
    }
  }, [books, isInitialized]);

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
