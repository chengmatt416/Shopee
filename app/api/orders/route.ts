import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Order } from "@/types";

const dataPath = path.join(process.cwd(), "data", "orders.json");

export async function GET() {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const orders: Order[] = JSON.parse(data);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await fs.readFile(dataPath, "utf-8");
    const orders: Order[] = JSON.parse(data);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items: body.items,
      totalAmount: body.totalAmount,
      signature: body.signature,
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
