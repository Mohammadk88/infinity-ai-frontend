// Import will be added back when needed

/**
 * Referral utilities for the affiliate system
 */

/**
 * Generate a shareable referral link for the given referral code
 * @param referralCode The user's referral code
 * @returns The full referral URL
 */
export const generateShareableLink = (referralCode: string): string => {
  // Get the base URL for the environment
  const baseUrl = 
    process.env.NEXT_PUBLIC_BASE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '');
  
  return `${baseUrl}/auth/register?ref=${encodeURIComponent(referralCode)}`;
};

/**
 * Format currency amount based on locale
 * @param amount The amount to format
 * @param currency The currency code (USD, EUR, etc)
 * @param locale The locale to use for formatting
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Saves a referral code to cookies
 */
export const saveReferralCode = (code: string): void => {
  try {
    // Set cookie with 30 day expiration
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    document.cookie = `referralCode=${encodeURIComponent(code)};expires=${expiryDate.toUTCString()};path=/;SameSite=Lax`;
    
    // Also save to localStorage as backup
    localStorage.setItem('referralCode', code);
  } catch (error) {
    console.error('Failed to save referral code:', error);
  }
};

/**
 * Gets the stored referral code from cookies or localStorage
 */
export const getReferralCodeFromCookie = (): string | null => {
  try {
    // Try to get from cookie first
    const cookieMatch = document.cookie.match(/referralCode=([^;]+)/);
    if (cookieMatch) {
      return decodeURIComponent(cookieMatch[1]);
    }
    
    // Fall back to localStorage
    return localStorage.getItem('referralCode');
  } catch (error) {
    console.error('Failed to retrieve referral code:', error);
    return null;
  }
};

/**
 * Clears the stored referral code
 */
export const clearReferralCode = (): void => {
  try {
    // Clear the cookie
    document.cookie = 'referralCode=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
    
    // Clear from localStorage
    localStorage.removeItem('referralCode');
  } catch (error) {
    console.error('Failed to clear referral code:', error);
  }
};

/**
 * Validates if a referral code is in the correct format
 */
export const isValidReferralCode = (code: string): boolean => {
  // Define validation rules for your referral codes
  // For example, alphanumeric, 5-10 characters
  const codeRegex = /^[A-Za-z0-9]{5,10}$/;
  return codeRegex.test(code);
};

/**
 * Parse referral code from URL search params
 * @param url The URL or search params string
 * @returns The referral code or null if not found
 */
export const parseReferralFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const refCode = parsedUrl.searchParams.get('ref');
    
    if (refCode) {
      // Store referral code in cookie for 30 days
      saveReferralCode(refCode);
      return refCode;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse URL:', error);
    return null;
  }
};