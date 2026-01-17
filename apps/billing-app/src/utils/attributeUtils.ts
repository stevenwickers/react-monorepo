import attributeDefinitions from "../data/attributeDefinitions.json";

export interface AttributeDefinition {
  id: string;
  key: string;
  label: string;
  dataType: "single-select" | "multi-select" | "text";
  filterable: boolean;
  searchable: boolean;
  sortable: boolean;
  showInList: boolean;
  showInDetail: boolean;
  detailTab: string;
  order: number;
  display?: {
    badge?: boolean;
    badgeColor?: string;
    separator?: string;
  };
}

export interface AttributeDefinitions {
  version: string;
  lastUpdated: string;
  emptyValues: any[];
  attributes: AttributeDefinition[];
}

const defs = attributeDefinitions as AttributeDefinitions;

/**
 * Get all attribute definitions
 */
export function getAllAttributes(): AttributeDefinition[] {
  return defs.attributes;
}

/**
 * Get only filterable attributes, sorted by order
 */
export function getFilterableAttributes(): AttributeDefinition[] {
  return getAllAttributes()
    .filter((attr) => attr.filterable)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get only searchable attributes
 */
export function getSearchableAttributes(): AttributeDefinition[] {
  return getAllAttributes().filter((attr) => attr.searchable);
}

/**
 * Get attributes that should be displayed in the product list/table
 */
export function getListAttributes(): AttributeDefinition[] {
  return getAllAttributes()
    .filter((attr) => attr.showInList)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get attributes for a specific detail tab
 */
export function getAttributesForTab(tabName: string): AttributeDefinition[] {
  return getAllAttributes()
    .filter((attr) => attr.showInDetail && attr.detailTab === tabName)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get attribute definition by ID
 */
export function getAttributeById(id: string): AttributeDefinition | undefined {
  return getAllAttributes().find((attr) => attr.id === id);
}

/**
 * Get attribute definition by key (for backward compatibility with old field names)
 */
export function getAttributeByKey(
  key: string,
): AttributeDefinition | undefined {
  return getAllAttributes().find((attr) => attr.key === key);
}

/**
 * Get attribute value from product
 * Handles both old structure (product.Category) and new structure (product.attributes.category)
 */
export function getAttributeValue(product: any, attributeId: string): any {
  const attr = getAttributeById(attributeId);
  if (!attr) return null;

  // New structure: product.attributes.category
  if (product.attributes && product.attributes[attributeId] !== undefined) {
    return product.attributes[attributeId];
  }

  // Old structure: product.Category
  if (product[attr.key] !== undefined) {
    return product[attr.key];
  }

  return null;
}

/**
 * Check if a value is considered empty
 */
export function isAttributeEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;

  const emptyValues = defs.emptyValues;
  if (emptyValues.includes(value)) return true;

  if (Array.isArray(value)) {
    return value.length === 0 || value.every((v) => emptyValues.includes(v));
  }

  if (typeof value === "string") {
    return value.trim() === "" || emptyValues.includes(value);
  }

  return false;
}

/**
 * Format attribute value for display
 * Handles arrays with custom separators, empty values, etc.
 */
export function formatAttributeValue(
  value: any,
  attribute: AttributeDefinition,
): string {
  if (isAttributeEmpty(value)) return "";

  if (Array.isArray(value)) {
    const separator = attribute.display?.separator || " : ";
    return value.filter((v) => !defs.emptyValues.includes(v)).join(separator);
  }

  return String(value);
}

/**
 * Extract unique values for an attribute across all products
 * Used for populating filter dropdowns
 */
export function extractUniqueValues(
  products: any[],
  attributeId: string,
): string[] {
  const values = new Set<string>();

  products.forEach((product) => {
    const value = getAttributeValue(product, attributeId);

    if (isAttributeEmpty(value)) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (!isAttributeEmpty(v)) {
          values.add(String(v));
        }
      });
    } else {
      values.add(String(value));
    }
  });

  return Array.from(values).sort();
}

/**
 * Check if a product's attribute value matches a filter value
 */
export function matchesFilter(
  productValue: any,
  filterValue: string,
  dataType: string,
): boolean {
  if (isAttributeEmpty(productValue)) return false;

  if (dataType === "multi-select") {
    if (Array.isArray(productValue)) {
      return productValue.includes(filterValue);
    }
    return productValue === filterValue;
  }

  if (dataType === "single-select") {
    return productValue === filterValue;
  }

  // Text - substring match (case-insensitive)
  return String(productValue).toLowerCase().includes(filterValue.toLowerCase());
}

/**
 * Check if a product matches search query across searchable attributes
 */
export function matchesSearch(product: any, searchQuery: string): boolean {
  if (!searchQuery || searchQuery.trim() === "") return true;

  const query = searchQuery.toLowerCase();
  const searchableAttrs = getSearchableAttributes();

  // Also search in core fields
  const coreFields = ["Style Code", "Name"];

  for (const field of coreFields) {
    const value = product[field];
    if (value && String(value).toLowerCase().includes(query)) {
      return true;
    }
  }

  // Search in searchable attributes
  for (const attr of searchableAttrs) {
    const value = getAttributeValue(product, attr.id);

    if (isAttributeEmpty(value)) continue;

    if (Array.isArray(value)) {
      if (value.some((v) => String(v).toLowerCase().includes(query))) {
        return true;
      }
    } else {
      if (String(value).toLowerCase().includes(query)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Apply all filters to a product list
 */
export function applyFilters(
  products: any[],
  filters: Record<string, string>,
  searchQuery?: string,
): any[] {
  return products.filter((product) => {
    // Apply search first
    if (searchQuery && !matchesSearch(product, searchQuery)) {
      return false;
    }

    // Apply all active filters
    for (const [attributeId, filterValue] of Object.entries(filters)) {
      if (!filterValue) continue; // Skip empty filters

      const attr = getAttributeById(attributeId);
      if (!attr) continue;

      const productValue = getAttributeValue(product, attributeId);

      if (!matchesFilter(productValue, filterValue, attr.dataType)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get count of products by attribute value
 * Used for category statistics/analytics
 */
export function getAttributeValueCounts(
  products: any[],
  attributeId: string,
): Array<{ value: string; count: number; percentage: number }> {
  const counts = new Map<string, number>();
  let totalCount = 0;

  products.forEach((product) => {
    const value = getAttributeValue(product, attributeId);

    if (isAttributeEmpty(value)) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (!isAttributeEmpty(v)) {
          const strValue = String(v);
          counts.set(strValue, (counts.get(strValue) || 0) + 1);
          totalCount++;
        }
      });
    } else {
      const strValue = String(value);
      counts.set(strValue, (counts.get(strValue) || 0) + 1);
      totalCount++;
    }
  });

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}
