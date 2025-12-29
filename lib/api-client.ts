// Client-side API key helper
// IMPORTANT: In production, this should be stored securely (e.g., in session storage after login)
// The default key is only for development/demo purposes
export function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "shopee-admin-2024";
  
  if (!process.env.NEXT_PUBLIC_ADMIN_API_KEY && typeof window !== "undefined") {
    console.warn("WARNING: Using default API key. Please set NEXT_PUBLIC_ADMIN_API_KEY environment variable.");
  }
  
  return apiKey;
}

export function getAuthHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-api-key": getApiKey(),
  };
}
