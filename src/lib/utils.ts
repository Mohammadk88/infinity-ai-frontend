import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names or conditional class objects
 * @returns Merged class string with tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Animation variants for subtle fade effects
 * Compatible with Framer Motion animation system
 */
export const fadeAnimationVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeInOut',
    }
  }),
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    }
  }
};
export const formatCurrency = (amount?: number) => {
  if (amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};
/**
 * Shimmer effect animation for loading states
 * @param width - Width of the shimmer (default: 100%)
 * @param height - Height of the shimmer (default: 100%)
 * @returns Class string for shimmer animation
 */
export function shimmer(width: string = '100%', height: string = '100%'): string {
  return `
    relative
    overflow-hidden
    before:absolute
    before:inset-0
    before:-translate-x-full
    before:animate-[shimmer_2s_infinite]
    before:border-t
    before:border-slate-100/10
    before:bg-gradient-to-r
    before:from-transparent
    before:via-slate-200/20
    before:to-transparent
    ${width}
    ${height}
  `;
}

/**
 * Pulse animation for subtle attention effects
 * @returns Class string for pulse animation
 */
export function pulse(): string {
  return `animate-[pulse_2s_ease-in-out_infinite]`;
}

/**
 * Bounce animation for elements that need more attention
 * @returns Class string for bounce animation
 */
export function bounce(): string {
  return `animate-[bounce_1s_ease-in-out_infinite]`;
}
