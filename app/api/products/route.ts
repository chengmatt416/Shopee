import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Product } from "@/types";
import { validateAdminRequest, getUnauthorizedResponse } from "@/lib/auth";

const dataPath = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const products: Product[] = JSON.parse(data);
    return NextResponse.json(products);
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
    const products: Product[] = JSON.parse(data);
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image || "/images/placeholder.png",
      stock: body.stock || 0,
    };
    
    products.push(newProduct);
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
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
    const products: Product[] = JSON.parse(data);
    
    const index = products.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Explicitly map only allowed fields to prevent property injection
    const updatedProduct: Product = {
      id: products[index].id, // Keep existing ID
      name: body.name ?? products[index].name,
      description: body.description ?? products[index].description,
      price: body.price ?? products[index].price,
      image: body.image ?? products[index].image,
      stock: body.stock ?? products[index].stock,
    };
    
    products[index] = updatedProduct;
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
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
    const products: Product[] = JSON.parse(data);
    
    const filtered = products.filter((p) => p.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
