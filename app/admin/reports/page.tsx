"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types";
import { useAdminAuth } from "@/lib/useAdminAuth";

export default function ReportsAdminPage() {
  useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const downloadReport = () => {
    const csvContent = [
      ["訂單ID", "日期", "總金額", "商品明細"].join(","),
      ...orders.map((order) => [
        order.id,
        new Date(order.date).toLocaleString("zh-TW"),
        order.totalAmount,
        order.items.map((item) => `${item.productName} x${item.quantity}`).join("; "),
      ].join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">銷售報表</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-gray-600 mb-2">總訂單數</div>
          <div className="text-3xl font-bold">{orders.length}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-gray-600 mb-2">總營業額</div>
          <div className="text-3xl font-bold">${getTotalRevenue()}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-gray-600 mb-2">平均訂單金額</div>
          <div className="text-3xl font-bold">
            ${orders.length > 0 ? (getTotalRevenue() / orders.length).toFixed(2) : 0}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">訂單明細</h2>
          <button
            onClick={downloadReport}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            📥 下載報表 (CSV)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">訂單ID</th>
                <th className="text-left p-2">日期</th>
                <th className="text-left p-2">商品明細</th>
                <th className="text-left p-2">總金額</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">
                    {new Date(order.date).toLocaleString("zh-TW")}
                  </td>
                  <td className="p-2">
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.productName} x {item.quantity} (${item.total})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 font-bold">${order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
