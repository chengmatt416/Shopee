import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Promotion } from "@/types";
import { validateAdminRequest, getUnauthorizedResponse } from "@/lib/auth";

const dataPath = path.join(process.cwd(), "data", "promotions.json");

export async function GET() {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const promotions: Promotion[] = JSON.parse(data);
    return NextResponse.json(promotions);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdminRequest(request)) {
    return getUnauthorizedResponse();
  }
  
  try {
    const body = await request.json();
    const data = await fs.readFile(dataPath, "utf-8");
    const promotions: Promotion[] = JSON.parse(data);
    
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      productId: body.productId,
      minQuantity: body.minQuantity,
      discountedPrice: body.discountedPrice,
      description: body.description,
    };
    
    promotions.push(newPromotion);
    await fs.writeFile(dataPath, JSON.stringify(promotions, null, 2));
    
    return NextResponse.json(newPromotion);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!validateAdminRequest(request)) {
    return getUnauthorizedResponse();
  }
  
  try {
    const body = await request.json();
    const data = await fs.readFile(dataPath, "utf-8");
    const promotions: Promotion[] = JSON.parse(data);
    
    const index = promotions.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }
    
    promotions[index] = { ...promotions[index], ...body };
    await fs.writeFile(dataPath, JSON.stringify(promotions, null, 2));
    
    return NextResponse.json(promotions[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!validateAdminRequest(request)) {
    return getUnauthorizedResponse();
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const data = await fs.readFile(dataPath, "utf-8");
    const promotions: Promotion[] = JSON.parse(data);
    
    const filtered = promotions.filter((p) => p.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}
