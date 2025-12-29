"use client";

import { useState, useEffect } from "react";
import { Product, CartItem, Promotion } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    loadCart();
    fetchProducts();
    fetchPromotions();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  };

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

  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const getPromotion = (productId: string) => {
    return promotions.find((p) => p.productId === productId);
  };

  const calculateItemPrice = (item: CartItem) => {
    const product = getProduct(item.productId);
    if (!product) return 0;

    const promotion = getPromotion(item.productId);
    if (promotion && item.quantity >= promotion.minQuantity) {
      return promotion.discountedPrice * item.quantity;
    }

    return product.price * item.quantity;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + calculateItemPrice(item), 0);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("購物車是空的！");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">購物車</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">購物車是空的</p>
          <Link
            href="/products"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 inline-block"
          >
            繼續購物
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {cart.map((item) => {
                const product = getProduct(item.productId);
                const promotion = getPromotion(item.productId);
                if (!product) return null;

                const isPromotionApplied =
                  promotion && item.quantity >= promotion.minQuantity;

                return (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 border-b hover:bg-gray-50"
                  >
                    <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      {product.image &&
                      product.image !== "/images/placeholder.png" ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="text-4xl">📦</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        ${product.price} / 件
                      </p>
                      {isPromotionApplied && (
                        <div className="text-sm text-green-600 mb-2">
                          🎉 已套用促銷: ${promotion.discountedPrice} / 件
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-4 text-red-500 hover:underline text-sm"
                        >
                          移除
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg">
                        ${calculateItemPrice(item)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">訂單摘要</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>商品件數</span>
                  <span>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} 件
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>總計</span>
                  <span className="text-orange-600">
                    ${products.length > 0 ? calculateTotal() : '計算中...'}
                  </span>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-orange-600 transition"
              >
                前往結帳
              </button>

              <Link
                href="/products"
                className="block text-center mt-4 text-blue-500 hover:underline"
              >
                繼續購物
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
