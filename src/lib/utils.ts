import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeImageUrl(url: string | null | undefined, width = 800, quality = 80) {
  if (!url) return "";
  
  // Unsplash optimization
  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?auto=format,compress&q=${quality}&w=${width}`;
  }
  
  // Pexels optimization
  if (url.includes("images.pexels.com")) {
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}`;
  }

  // Supabase optimization (if resizing is enabled)
  // Check if it's a supabase storage URL
  if (url.includes("supabase.co/storage/v1/object/public/")) {
    // If you have a custom transform function or proxy, you'd use it here.
    // For now, we'll return the URL as is, but we could add a width param if supported.
    return url;
  }

  return url;
}
