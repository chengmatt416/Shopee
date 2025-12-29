"use client";

import { useState, useEffect } from "react";
import { Product, Promotion } from "@/types";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchPromotions();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchPromotions = async () => {
    const res = await fetch("/api/promotions");
    const data = await res.json();
    setPromotions(data);
  };

  const getPromotion = (productId: string) => {
    return promotions.find((p) => p.productId === productId);
  };

  const addToCart = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("商品已加入購物車！");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">商品總覽</h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl mb-4">目前沒有商品</p>
          <Link href="/admin/products" className="text-blue-500 hover:underline">
            前往後台新增商品
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const promotion = getPromotion(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.image && product.image !== "/images/placeholder.png" ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-600">
                      ${product.price}
                    </div>
                    {promotion && (
                      <div className="text-sm text-green-600 mt-1">
                        🎉 {promotion.description}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      庫存: {product.stock}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600 transition"
                    >
                      查看詳情
                    </Link>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="flex-1 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                      disabled={product.stock === 0}
                    >
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
