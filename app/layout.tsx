import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shopee - Simple E-commerce",
  description: "A simple e-commerce marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <nav className="bg-orange-500 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                🛒 Shopee 賣場
              </Link>
              <div className="space-x-4">
                <Link href="/" className="hover:text-orange-200">
                  商品總覽
                </Link>
                <Link href="/cart" className="hover:text-orange-200">
                  購物車
                </Link>
                <Link href="/admin" className="hover:text-orange-200">
                  後台管理
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">
          <p>© 2024 Shopee 簡易賣場. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
