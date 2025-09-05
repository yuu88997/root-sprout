import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 内联的简单导航（不用任何 hook，不需要 "use client"）
function SimpleNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">🌱 Root & Sprout</link>
        <div className="flex gap-2">
          <Link className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200" href="/">📝 To-do</Link>
          <Link className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200" href="/meditation">🧘 冥想</Link>
          <Link className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200" href="/journal">📓 日记</Link>
          <Link className="px-3 py-1.5 rounded-xl text-sm hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200" href="/habit">📅 打卡</Link>
        </div>
      </nav>
    </header>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Root & Sprout",
  description: "向下扎根 · 向上生长",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-green-100 to-white min-h-screen`}>
        <SimpleNav />
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}

