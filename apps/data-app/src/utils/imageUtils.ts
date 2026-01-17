/**
 * Image utility functions for building product image URLs
 */

// Base URL for product images
const IMAGE_BASE_URL = "https://unifirst.com/wp-content/uploads/2023/01";

/**
 * Build full image URL from filename
 * @param filename - Image filename (e.g., "0101-02.jpg", "Swatch-02.jpg")
 * @returns Full image URL or null if filename is invalid
 */
export const buildImageUrl = (
  filename: string | null | undefined,
): string | null => {
  if (
    !filename ||
    filename === "x" ||
    filename === "Blank" ||
    filename === "null"
  ) {
    return null;
  }

  // Remove any leading/trailing whitespace
  const cleanFilename = filename.trim();

  // Check if it's already a full URL
  if (
    cleanFilename.startsWith("http://") ||
    cleanFilename.startsWith("https://")
  ) {
    return cleanFilename;
  }

  return `${IMAGE_BASE_URL}/${cleanFilename}`;
};

/**
 * Build catalog image URL for a product
 * @param styleCode - Product Style Code
 * @param colorCode - Color code
 * @returns Full catalog image URL
 */
export const buildCatalogImageUrl = (
  styleCode: string,
  colorCode: string,
): string => {
  return `${IMAGE_BASE_URL}/${styleCode}-${colorCode}.jpg`;
};

/**
 * Build color swatch image URL
 * @param colorCode - Color code
 * @returns Full color swatch URL
 */
export const buildColorSwatchUrl = (colorCode: string): string => {
  return `${IMAGE_BASE_URL}/Swatch-${colorCode}.jpg`;
};

/**
 * Get placeholder image URL for when product image is not available
 * @returns Placeholder image URL
 */
export const getPlaceholderImageUrl = (): string => {
  // Using a data URL for a simple gray placeholder
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3ENo Image Available%3C/text%3E%3C/svg%3E';
};

/**
 * Validate if an image URL is potentially valid
 * @param url - Image URL to validate
 * @returns True if URL appears valid
 */
export const isValidImageUrl = (url: string | null): boolean => {
  if (!url) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  );
};
