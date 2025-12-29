import { NextRequest } from "next/server";

// Simple API key authentication
// In production, use environment variables or a proper auth system
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "shopee-admin-2024";

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
