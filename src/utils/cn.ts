import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS class names safely.
 * Resolves conflicts (e.g., `p-2 p-4` → `p-4`) and handles conditional classes.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-forest', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
