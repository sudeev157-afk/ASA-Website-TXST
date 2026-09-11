import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui's class joiner. Later Tailwind classes win over earlier ones
 * that set the same property, so a caller's `className` can override a
 * component's defaults instead of fighting them.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
