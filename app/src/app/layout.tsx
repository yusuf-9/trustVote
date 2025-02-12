import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react"; // Added import for React

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockchain Voting System",
  description: "A secure and transparent voting system using blockchain technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning suppressContentEditableWarning>
        <div className="flex flex-col min-h-screen">
          <header className="bg-primary text-primary-foreground py-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Blockchain Voting System</h1>
            </div>
          </header>
          <main className="flex-grow container mx-auto py-8">{children}</main>
          <footer className="bg-muted py-4">
            <div className="container mx-auto text-center">
              <p>&copy; 2025 Blockchain Voting System. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
