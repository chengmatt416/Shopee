"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_authenticated="))
      ?.split("=")[1] === "true";

    // Skip login page itself
    if (pathname === "/admin/login") {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);
}

export function logout() {
  // Clear authentication cookie
  document.cookie = "admin_authenticated=; path=/; max-age=0";
}
