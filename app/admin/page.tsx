"use client";

import Link from "next/link";
import { useAdminAuth, logout } from "@/lib/useAdminAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">後台管理系統</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          登出
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition border-2 border-gray-200"
        >
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">商品管理</h2>
          <p className="text-gray-600">新增、編輯、刪除商品</p>
        </Link>
        
        <Link
          href="/admin/promotions"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition border-2 border-gray-200"
        >
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-2">促銷活動</h2>
          <p className="text-gray-600">設定批量優惠</p>
        </Link>
        
        <Link
          href="/admin/reports"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition border-2 border-gray-200"
        >
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-bold mb-2">銷售報表</h2>
          <p className="text-gray-600">查看訂單明細</p>
        </Link>
      </div>
    </div>
  );
}
