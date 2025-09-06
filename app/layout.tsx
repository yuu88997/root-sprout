import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

function SimpleNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">🌱 Root & Sprout</Link>
        <div className="flex gap-2">
          <Link href="/" className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200">
            📝 To-do
          </Link>
          <Link href="/meditation" className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200">
            🧘 冥想
          </Link>
          <Link href="/journal" className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200">
            📓 日记
          </Link>
          <Link href="/habit" className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200">
            📅 打卡
          </Link>
        </div>
      </nav>
    </header>
  );
}

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Root & Sprout",
  description: "向下扎根 · 向上生长",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-green-100 to-white min-h-screen text-gray-900`}>
        <SimpleNav />
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
