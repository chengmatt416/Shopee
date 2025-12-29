"use client";

import { useState, useEffect, useRef } from "react";
import { Product, CartItem, Promotion } from "@/types";
import { useRouter } from "next/navigation";
import SignatureCanvas from "signature_pad";

export default function CheckoutPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignatureCanvas | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    fetchProducts();
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignatureCanvas(canvasRef.current, {
        backgroundColor: "rgb(255, 255, 255)",
      });
    }
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

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      alert("請先簽名！");
      return;
    }

    const signatureData = signaturePadRef.current.toDataURL();

    const orderItems = cart.map((item) => {
      const product = getProduct(item.productId);
      const promotion = getPromotion(item.productId);
      const price =
        promotion && item.quantity >= promotion.minQuantity
          ? promotion.discountedPrice
          : product?.price || 0;

      return {
        productId: item.productId,
        productName: product?.name || "",
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    const order = {
      items: orderItems,
      totalAmount: calculateTotal(),
      signature: signatureData,
    };

    try {
      const params = new URLSearchParams();
      params.append("action", "create");
      params.append("items", JSON.stringify(order.items));
      params.append("totalAmount", order.totalAmount.toString());
      params.append("signature", order.signature);
      
      const res = await fetch(`/api/orders?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const createdOrder = await res.json();

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect to confirmation page
      router.push(`/checkout/confirmation?orderId=${createdOrder.id}`);
    } catch (error) {
      alert("訂單提交失敗，請重試！");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl mb-4">購物車是空的</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          前往購物
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">結帳</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">訂單明細</h2>
              {cart.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="flex justify-between py-2 border-b"
                  >
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        數量: {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold">${calculateItemPrice(item)}</div>
                  </div>
                );
              })}

              <div className="flex justify-between text-xl font-bold pt-4 mt-4 border-t">
                <span>總計</span>
                <span className="text-orange-600">${calculateTotal()}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">簽名確認</h2>
              <p className="text-gray-600 mb-4">
                請在下方簽名以確認訂單
              </p>

              <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="w-full touch-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  清除簽名
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  確認訂單
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
