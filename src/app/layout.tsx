import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./context/GameContext";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Game Tracker - Professional Score Tracking",
  description: "Professional score tracking for your card games, board games, and more. Track scores, view progress charts, and manage multiple games with ease.",
  keywords: "game tracker, score tracker, card game, board game, scorekeeper, game scores",
  authors: [{ name: "Game Tracker" }],
  creator: "Game Tracker",
  publisher: "Game Tracker",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Game Tracker - Professional Score Tracking",
    description: "Professional score tracking for your card games, board games, and more",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Tracker - Professional Score Tracking",
    description: "Professional score tracking for your card games, board games, and more",
  },
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <GameProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {children}
          </div>
        </GameProvider>
      </body>
    </html>
  );
}