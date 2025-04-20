import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./context/GameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rummy 500 Score Tracker",
  description: "Track scores for your Rummy 500 card games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>
          <div className="min-h-screen bg-black-50">
            {children}
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
