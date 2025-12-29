"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Order } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    const res = await fetch("/api/orders");
    const orders: Order[] = await res.json();
    const found = orders.find((o) => o.id === orderId);
    setOrder(found || null);
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current || !order) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`receipt-${order.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("下載失敗，請重試！");
    }
  };

  const downloadContract = () => {
    if (!order) return;

    const contractText = `
購買合約

訂單編號: ${order.id}
日期: ${new Date(order.date).toLocaleString("zh-TW")}

商品明細:
${order.items.map((item) => `- ${item.productName} x ${item.quantity} = $${item.total}`).join("\n")}

總金額: $${order.totalAmount}

買家簽名: (已數位簽署)

本合約已於 ${new Date(order.date).toLocaleString("zh-TW")} 電子簽署。
    `;

    const blob = new Blob([contractText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `contract-${order.id}.txt`;
    link.click();
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold mb-2">訂單完成！</h1>
          <p className="text-gray-600">感謝您的購買</p>
        </div>

        <div ref={receiptRef} className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">購買明細</h2>
            <p className="text-gray-600">訂單編號: {order.id}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.date).toLocaleString("zh-TW")}
            </p>
          </div>

          <div className="border-t border-b py-4 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2">
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-gray-600">
                    ${item.price} x {item.quantity}
                  </div>
                </div>
                <div className="font-bold">${item.total}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>總金額</span>
            <span className="text-orange-600">${order.totalAmount}</span>
          </div>

          <div>
            <h3 className="font-bold mb-2">簽名</h3>
            <div className="border rounded-lg p-2 bg-gray-50">
              <img
                src={order.signature}
                alt="Signature"
                className="max-h-32 mx-auto"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={downloadReceipt}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 flex items-center justify-center gap-2"
          >
            📥 下載明細 (PDF)
          </button>

          <button
            onClick={downloadContract}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            📄 下載合約 (TXT)
          </button>

          <button
            onClick={() => router.push("/products")}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600"
          >
            繼續購物
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">載入中...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
