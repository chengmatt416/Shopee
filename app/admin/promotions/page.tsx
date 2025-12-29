"use client";

import { useState, useEffect } from "react";
import { Promotion, Product } from "@/types";
import { getAuthHeaders } from "@/lib/api-client";
import { useAdminAuth } from "@/lib/useAdminAuth";

export default function PromotionsAdminPage() {
  useAdminAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPromotion, setCurrentPromotion] = useState<Partial<Promotion>>({});
  const [isEditing, setIsEditing] = useState(false);

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
    
    const params = new URLSearchParams();
    if (currentPromotion.id) {
      params.append("action", "update");
      params.append("id", currentPromotion.id);
    } else {
      params.append("action", "create");
    }
    params.append("productId", currentPromotion.productId || "");
    params.append("minQuantity", (currentPromotion.minQuantity || 0).toString());
    params.append("discountedPrice", (currentPromotion.discountedPrice || 0).toString());
    params.append("description", currentPromotion.description || "");
    
    const headers = getAuthHeaders();
    await fetch(`/api/promotions?${params.toString()}`, {
      method: "GET",
      headers,
    });
    
    setCurrentPromotion({});
    setIsEditing(false);
    fetchPromotions();
  };

  const handleDelete = async (id: string) => {
    if (confirm("確定要刪除此促銷活動嗎？")) {
      const params = new URLSearchParams();
      params.append("action", "delete");
      params.append("id", id);
      
      const headers = getAuthHeaders();
      await fetch(`/api/promotions?${params.toString()}`, { 
        method: "GET",
        headers,
      });
      fetchPromotions();
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setIsEditing(true);
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "未知商品";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">促銷活動管理</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "編輯促銷活動" : "新增促銷活動"}
        </h2>
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

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? "更新" : "新增促銷"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                onClick={() => {
                  setCurrentPromotion({});
                  setIsEditing(false);
                }}
              >
                取消
              </button>
            )}
          </div>
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
                  <td className="p-2 space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEdit(promotion)}
                    >
                      編輯
                    </button>
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
