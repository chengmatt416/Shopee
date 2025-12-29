"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { getAuthHeaders } from "@/lib/api-client";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct.id) {
      await fetch("/api/products", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(currentProduct),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(currentProduct),
      });
    }
    
    setCurrentProduct({});
    setIsEditing(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("確定要刪除此商品嗎？")) {
      await fetch(`/api/products?id=${id}`, { 
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">商品管理</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "編輯商品" : "新增商品"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">商品名稱</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={currentProduct.name || ""}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">商品描述</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={currentProduct.description || ""}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">價格</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={currentProduct.price || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">庫存</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={currentProduct.stock || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    stock: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              圖片網址 (可選)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="/images/product.jpg"
              value={currentProduct.image || ""}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, image: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? "更新" : "新增"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                onClick={() => {
                  setCurrentProduct({});
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
        <h2 className="text-2xl font-bold mb-4">商品列表</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">名稱</th>
                <th className="text-left p-2">價格</th>
                <th className="text-left p-2">庫存</th>
                <th className="text-left p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{product.id}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">${product.price}</td>
                  <td className="p-2">{product.stock}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEdit(product)}
                    >
                      編輯
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(product.id)}
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
