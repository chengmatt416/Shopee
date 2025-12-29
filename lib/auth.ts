import { NextRequest } from "next/server";

// Simple API key authentication
// IMPORTANT: In production, always set ADMIN_API_KEY environment variable
// The default key is only for development/demo purposes
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "shopee-admin-2024";

if (!process.env.ADMIN_API_KEY && process.env.NODE_ENV === "production") {
  console.warn("WARNING: Using default API key in production. Please set ADMIN_API_KEY environment variable.");
}

export function validateAdminRequest(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === ADMIN_API_KEY;
}

export function getUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "Unauthorized - Invalid or missing API key" }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}
