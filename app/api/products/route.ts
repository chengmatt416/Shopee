import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Product } from "@/types";
import { validateAdminRequest, getUnauthorizedResponse } from "@/lib/auth";

const dataPath = path.join(process.cwd(), "data", "products.json");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  
  // List all products (public)
  if (!action || action === "list") {
    try {
      const data = await fs.readFile(dataPath, "utf-8");
      const products: Product[] = JSON.parse(data);
      return NextResponse.json(products);
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
    const products: Product[] = JSON.parse(data);
    
    // Create new product
    if (action === "create") {
      const name = searchParams.get("name");
      const description = searchParams.get("description");
      const price = searchParams.get("price");
      const image = searchParams.get("image");
      const stock = searchParams.get("stock");
      
      const newProduct: Product = {
        id: Date.now().toString(),
        name: name || "",
        description: description || "",
        price: price ? parseFloat(price) : 0,
        image: image || "/images/placeholder.png",
        stock: stock ? parseInt(stock) : 0,
      };
      
      products.push(newProduct);
      await fs.writeFile(dataPath, JSON.stringify(products, null, 2));
      
      return NextResponse.json(newProduct);
    }
    
    // Update existing product
    if (action === "update") {
      const id = searchParams.get("id");
      const name = searchParams.get("name");
      const description = searchParams.get("description");
      const price = searchParams.get("price");
      const image = searchParams.get("image");
      const stock = searchParams.get("stock");
      
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      
      // Explicitly map only allowed fields to prevent property injection
      const updatedProduct: Product = {
        id: products[index].id, // Keep existing ID
        name: name || products[index].name,
        description: description || products[index].description,
        price: price ? parseFloat(price) : products[index].price,
        image: image || products[index].image,
        stock: stock ? parseInt(stock) : products[index].stock,
      };
      
      products[index] = updatedProduct;
      await fs.writeFile(dataPath, JSON.stringify(products, null, 2));
      
      return NextResponse.json(products[index]);
    }
    
    // Delete product
    if (action === "delete") {
      const id = searchParams.get("id");
      const filtered = products.filter((p) => p.id !== id);
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
