"use client";

import { useState, useEffect } from "react";
import { Promotion, Product } from "@/types";

export default function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPromotion, setCurrentPromotion] = useState<Partial<Promotion>>({});

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const fetchPromotions = async () => {
    const res = await fetch("/api/promotions");
    const data = await res.json();
    setPromotions(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch("/api/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPromotion),
    });
    
    setCurrentPromotion({});
    fetchPromotions();
  };

  const handleDelete = async (id: string) => {
    if (confirm("確定要刪除此促銷活動嗎？")) {
      await fetch(`/api/promotions?id=${id}`, { method: "DELETE" });
      fetchPromotions();
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "未知商品";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">促銷活動管理</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">新增促銷活動</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">選擇商品</label>
            <select
              className="w-full p-2 border rounded"
              value={currentPromotion.productId || ""}
              onChange={(e) =>
                setCurrentPromotion({ ...currentPromotion, productId: e.target.value })
              }
              required
            >
              <option value="">請選擇商品</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (原價: ${product.price})
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">最低數量</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={currentPromotion.minQuantity || ""}
                onChange={(e) =>
                  setCurrentPromotion({
                    ...currentPromotion,
                    minQuantity: parseInt(e.target.value),
                  })
                }
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">折扣價格</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={currentPromotion.discountedPrice || ""}
                onChange={(e) =>
                  setCurrentPromotion({
                    ...currentPromotion,
                    discountedPrice: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">促銷說明</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="例如：買3件以上享特價"
              value={currentPromotion.description || ""}
              onChange={(e) =>
                setCurrentPromotion({
                  ...currentPromotion,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            新增促銷
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">促銷活動列表</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">商品名稱</th>
                <th className="text-left p-2">最低數量</th>
                <th className="text-left p-2">折扣價格</th>
                <th className="text-left p-2">說明</th>
                <th className="text-left p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{getProductName(promotion.productId)}</td>
                  <td className="p-2">{promotion.minQuantity}</td>
                  <td className="p-2">${promotion.discountedPrice}</td>
                  <td className="p-2">{promotion.description}</td>
                  <td className="p-2">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
