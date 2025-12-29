import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Promotion } from "@/types";
import { validateAdminRequest, getUnauthorizedResponse } from "@/lib/auth";

const dataPath = path.join(process.cwd(), "data", "promotions.json");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  
  // List all promotions (public)
  if (!action || action === "list") {
    try {
      const data = await fs.readFile(dataPath, "utf-8");
      const promotions: Promotion[] = JSON.parse(data);
      return NextResponse.json(promotions);
    } catch (error) {
      return NextResponse.json([], { status: 200 });
    }
  }
  
  // Admin actions require authentication
  if (!validateAdminRequest(request)) {
    return getUnauthorizedResponse();
  }
  
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const promotions: Promotion[] = JSON.parse(data);
    
    // Create new promotion
    if (action === "create") {
      const productId = searchParams.get("productId");
      const minQuantity = searchParams.get("minQuantity");
      const discountedPrice = searchParams.get("discountedPrice");
      const description = searchParams.get("description");
      
      const parsedMinQuantity = minQuantity ? parseInt(minQuantity) : 0;
      const parsedDiscountedPrice = discountedPrice ? parseFloat(discountedPrice) : 0;
      
      if (isNaN(parsedMinQuantity)) {
        return NextResponse.json(
          { error: "Invalid minimum quantity value" },
          { status: 400 }
        );
      }
      
      if (isNaN(parsedDiscountedPrice)) {
        return NextResponse.json(
          { error: "Invalid discounted price value" },
          { status: 400 }
        );
      }
      
      const newPromotion: Promotion = {
        id: Date.now().toString(),
        productId: productId || "",
        minQuantity: parsedMinQuantity,
        discountedPrice: parsedDiscountedPrice,
        description: description || "",
      };
      
      promotions.push(newPromotion);
      await fs.writeFile(dataPath, JSON.stringify(promotions, null, 2));
      
      return NextResponse.json(newPromotion);
    }
    
    // Update existing promotion
    if (action === "update") {
      const id = searchParams.get("id");
      const productId = searchParams.get("productId");
      const minQuantity = searchParams.get("minQuantity");
      const discountedPrice = searchParams.get("discountedPrice");
      const description = searchParams.get("description");
      
      const index = promotions.findIndex((p) => p.id === id);
      if (index === -1) {
        return NextResponse.json(
          { error: "Promotion not found" },
          { status: 404 }
        );
      }
      
      let parsedMinQuantity = promotions[index].minQuantity;
      if (minQuantity !== null) {
        parsedMinQuantity = parseInt(minQuantity);
        if (isNaN(parsedMinQuantity)) {
          return NextResponse.json(
            { error: "Invalid minimum quantity value" },
            { status: 400 }
          );
        }
      }
      
      let parsedDiscountedPrice = promotions[index].discountedPrice;
      if (discountedPrice !== null) {
        parsedDiscountedPrice = parseFloat(discountedPrice);
        if (isNaN(parsedDiscountedPrice)) {
          return NextResponse.json(
            { error: "Invalid discounted price value" },
            { status: 400 }
          );
        }
      }
      
      // Explicitly map only allowed fields to prevent property injection
      const updatedPromotion: Promotion = {
        id: promotions[index].id, // Keep existing ID
        productId: productId ?? promotions[index].productId,
        minQuantity: parsedMinQuantity,
        discountedPrice: parsedDiscountedPrice,
        description: description ?? promotions[index].description,
      };
      
      promotions[index] = updatedPromotion;
      await fs.writeFile(dataPath, JSON.stringify(promotions, null, 2));
      
      return NextResponse.json(promotions[index]);
    }
    
    // Delete promotion
    if (action === "delete") {
      const id = searchParams.get("id");
      const filtered = promotions.filter((p) => p.id !== id);
      await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
