// Client-side API key helper
// In production, this should be stored securely (e.g., in session storage after login)
export function getApiKey(): string {
  // For development, we use a hardcoded key
  // In production, this would come from authentication
  return process.env.NEXT_PUBLIC_ADMIN_API_KEY || "shopee-admin-2024";
}

export function getAuthHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-api-key": getApiKey(),
  };
}
