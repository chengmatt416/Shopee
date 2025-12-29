import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">歡迎來到 Shopee 賣場</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          href="/products"
          className="bg-orange-500 text-white p-8 rounded-lg shadow-lg hover:bg-orange-600 transition text-center"
        >
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-2xl font-bold mb-2">瀏覽商品</h2>
          <p>查看所有可用商品</p>
        </Link>
        
        <Link
          href="/admin"
          className="bg-blue-500 text-white p-8 rounded-lg shadow-lg hover:bg-blue-600 transition text-center"
        >
          <div className="text-5xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold mb-2">後台管理</h2>
          <p>管理商品、促銷活動和報表</p>
        </Link>
      </div>
    </div>
  );
}
