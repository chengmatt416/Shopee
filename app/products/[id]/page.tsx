"use client";

import { useState, useEffect } from "react";
import { Product, Promotion } from "@/types";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    const res = await fetch("/api/products");
    const products: Product[] = await res.json();
    const found = products.find((p) => p.id === params.id);
    setProduct(found || null);

    if (found) {
      const promRes = await fetch("/api/promotions");
      const promotions: Promotion[] = await promRes.json();
      const foundProm = promotions.find((p) => p.productId === found.id);
      setPromotion(foundProm || null);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.productId === params.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId: params.id, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("商品已加入購物車！");
    router.push("/cart");
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← 返回
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              {product.image && product.image !== "/images/placeholder.png" ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-9xl">📦</div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ${product.price}
              </div>
              {promotion && (
                <div className="bg-green-100 border border-green-400 rounded p-3 mb-2">
                  <div className="font-bold text-green-800">🎉 促銷活動</div>
                  <div className="text-green-700">{promotion.description}</div>
                  <div className="text-green-700">
                    購買 {promotion.minQuantity} 件以上，每件 ${promotion.discountedPrice}
                  </div>
                </div>
              )}
              <div className="text-gray-600">
                庫存: {product.stock} 件
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">數量</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-32 p-2 border rounded"
              />
            </div>

            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-orange-600 disabled:bg-gray-400 transition"
            >
              {product.stock === 0 ? "已售完" : "加入購物車"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
