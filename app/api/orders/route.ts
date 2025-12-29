import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Order } from "@/types";

const dataPath = path.join(process.cwd(), "data", "orders.json");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  
  // List all orders
  if (!action || action === "list") {
    try {
      const data = await fs.readFile(dataPath, "utf-8");
      const orders: Order[] = JSON.parse(data);
      return NextResponse.json(orders);
    } catch (error) {
      return NextResponse.json([], { status: 200 });
    }
  }
  
  // Create new order
  if (action === "create") {
    try {
      const items = searchParams.get("items");
      const totalAmount = searchParams.get("totalAmount");
      const signature = searchParams.get("signature");
      
      const data = await fs.readFile(dataPath, "utf-8");
      const orders: Order[] = JSON.parse(data);
      
      let parsedItems = [];
      if (items) {
        try {
          parsedItems = JSON.parse(items);
        } catch (parseError) {
          return NextResponse.json(
            { error: "Invalid items format" },
            { status: 400 }
          );
        }
      }
      
      const parsedTotalAmount = totalAmount ? parseFloat(totalAmount) : 0;
      if (isNaN(parsedTotalAmount)) {
        return NextResponse.json(
          { error: "Invalid total amount" },
          { status: 400 }
        );
      }
      
      const newOrder: Order = {
        id: Date.now().toString(),
        items: parsedItems,
        totalAmount: parsedTotalAmount,
        signature: signature || "",
        date: new Date().toISOString(),
      };
      
      orders.push(newOrder);
      await fs.writeFile(dataPath, JSON.stringify(orders, null, 2));
      
      return NextResponse.json(newOrder);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }
  }
  
  return NextResponse.json(
    { error: "Invalid action" },
    { status: 400 }
  );
}
