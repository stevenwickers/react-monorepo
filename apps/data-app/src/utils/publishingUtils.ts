/**
 * Publishing utilities for managing product catalog snapshots
 */

// Support both old and new product structures
export interface ProductOld {
  "Style Code": string;
  Series?: number;
  "Whether in Product Listing"?: number;
  Name?: string;
  Variety?: string;
  Description?: string;
  Size?: string;
  Category?: string | string[];
  Brand?: string;
  "Program Type"?: string | string[];
  "Tags/Attributes"?: string | string[];
  "Sub-Categories (filter)"?: string | string[];
  Industry?: string | string[];
  Country?: string | string[];
  "Related Products"?: string | string[];
  colorVariants?: Array<{
    colorCode: string;
    colorName: string;
    catalogImages?: string;
    colorSwatch?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface ProductNew {
  styleCode: string;
  series?: number;
  whetherInProductListing?: number;
  name?: string;
  variety?: string;
  description?: string;
  size?: string;
  personalizable?: string;
  relatedProducts?: string[];
  redirect?: string;
  remarks?: string;
  attributes?: {
    category?: string[];
    brand?: string;
    programType?: string[];
    subCategories?: string[];
    industry?: string[];
    gender?: string;
    country?: string[];
    fabric?: string;
    tags?: string[];
    ansiClass?: string;
    cat?: string;
    catAtpv?: string;
    atpv?: string;
    certifications?: string;
    bodyPlacement?: string;
  };
  colorVariants?: Array<{
    colorCode: string;
    colorName: string;
    catalogImages?: string;
    colorSwatch?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export type Product = ProductOld | ProductNew;

// Helper to get style code from either product structure
export const getStyleCode = (product: Product): string => {
  return (
    (product as ProductNew).styleCode ||
    (product as ProductOld)["Style Code"] ||
    ""
  );
};

// Helper to get name from either product structure
export const getProductName = (product: Product): string => {
  return (product as ProductNew).name || (product as ProductOld).Name || "";
};

// Helper to get category from either product structure
export const getProductCategory = (
  product: Product,
): string | string[] | undefined => {
  const newProduct = product as ProductNew;
  const oldProduct = product as ProductOld;
  return newProduct.attributes?.category || oldProduct.Category;
};

// Helper to get brand from either product structure
export const getProductBrand = (product: Product): string | undefined => {
  const newProduct = product as ProductNew;
  const oldProduct = product as ProductOld;
  return newProduct.attributes?.brand || oldProduct.Brand;
};

export type SnapshotStatus = "scheduled" | "active" | "archived";

export interface Snapshot {
  id: string;
  version: string;
  effectiveDate: string; // ISO 8601 format
  publishedDate: string; // ISO 8601 format
  status: SnapshotStatus;
  publishedBy: string;
  notes: string;
  productCount: number;
  products: Product[];
}

export interface PublishedSnapshots {
  snapshots: Snapshot[];
  currentActiveSnapshotId: string | null;
}

/**
 * Generate a unique snapshot ID based on timestamp
 */
export const generateSnapshotId = (): string => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .split("Z")[0];
  return `snapshot_${timestamp}`;
};

/**
 * Generate semantic version number based on existing snapshots
 */
export const generateVersion = (existingSnapshots: Snapshot[]): string => {
  if (existingSnapshots.length === 0) {
    return "1.0.0";
  }

  // Get the latest version and increment
  const versions = existingSnapshots
    .map((s) => s.version)
    .filter((v) => /^\d+\.\d+\.\d+$/.test(v))
    .map((v) => v.split(".").map(Number))
    .sort((a, b) => {
      if (a[0] !== b[0]) return b[0] - a[0];
      if (a[1] !== b[1]) return b[1] - a[1];
      return b[2] - a[2];
    });

  if (versions.length === 0) {
    return "1.0.0";
  }

  const [major, minor, patch] = versions[0];
  return `${major}.${minor}.${patch + 1}`;
};

/**
 * Create a new snapshot from current products
 */
export const createSnapshot = (
  products: Product[],
  effectiveDate: Date,
  publishedBy: string,
  notes: string,
  existingSnapshots: Snapshot[],
): Snapshot => {
  const now = new Date();

  return {
    id: generateSnapshotId(),
    version: generateVersion(existingSnapshots),
    effectiveDate: effectiveDate.toISOString(),
    publishedDate: now.toISOString(),
    status: determineInitialStatus(effectiveDate, now),
    publishedBy,
    notes,
    productCount: products.length,
    products: JSON.parse(JSON.stringify(products)), // Deep clone
  };
};

/**
 * Determine initial snapshot status based on effective date
 */
const determineInitialStatus = (
  effectiveDate: Date,
  now: Date,
): SnapshotStatus => {
  if (effectiveDate > now) {
    return "scheduled";
  }
  return "active";
};

/**
 * Get the currently active snapshot based on effective dates
 */
export const getActiveSnapshot = (snapshots: Snapshot[]): Snapshot | null => {
  const now = new Date();

  // Find all snapshots that should be active (effective date <= now)
  const eligibleSnapshots = snapshots.filter((s) => {
    const effectiveDate = new Date(s.effectiveDate);
    return effectiveDate <= now && s.status !== "archived";
  });

  if (eligibleSnapshots.length === 0) {
    return null;
  }

  // Return the one with the most recent effective date
  return eligibleSnapshots.sort((a, b) => {
    return (
      new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
    );
  })[0];
};

/**
 * Update snapshot statuses based on current date
 */
export const updateSnapshotStatuses = (snapshots: Snapshot[]): Snapshot[] => {
  const now = new Date();
  const activeSnapshot = getActiveSnapshot(snapshots);

  return snapshots.map((snapshot) => {
    const effectiveDate = new Date(snapshot.effectiveDate);

    // Skip archived snapshots
    if (snapshot.status === "archived") {
      return snapshot;
    }

    // Determine new status
    let newStatus: SnapshotStatus;
    if (effectiveDate > now) {
      newStatus = "scheduled";
    } else if (activeSnapshot && snapshot.id === activeSnapshot.id) {
      newStatus = "active";
    } else {
      newStatus = "archived";
    }

    return {
      ...snapshot,
      status: newStatus,
    };
  });
};

/**
 * Get snapshot statistics
 */
export interface SnapshotStats {
  totalSnapshots: number;
  scheduledCount: number;
  activeCount: number;
  archivedCount: number;
  latestVersion: string;
  nextScheduledDate: string | null;
}

export const getSnapshotStats = (snapshots: Snapshot[]): SnapshotStats => {
  const scheduled = snapshots.filter((s) => s.status === "scheduled");
  const active = snapshots.filter((s) => s.status === "active");
  const archived = snapshots.filter((s) => s.status === "archived");

  const versions = snapshots
    .map((s) => s.version)
    .filter((v) => /^\d+\.\d+\.\d+$/.test(v));

  const nextScheduled =
    scheduled.length > 0
      ? scheduled.sort(
          (a, b) =>
            new Date(a.effectiveDate).getTime() -
            new Date(b.effectiveDate).getTime(),
        )[0].effectiveDate
      : null;

  return {
    totalSnapshots: snapshots.length,
    scheduledCount: scheduled.length,
    activeCount: active.length,
    archivedCount: archived.length,
    latestVersion:
      versions.length > 0 ? versions[versions.length - 1] : "0.0.0",
    nextScheduledDate: nextScheduled,
  };
};

/**
 * Compare two product arrays and return differences
 */
export interface ProductDiff {
  added: Product[];
  removed: Product[];
  modified: Array<{
    styleCode: string;
    changes: string[];
  }>;
}

export const compareProducts = (
  wipProducts: Product[],
  publishedProducts: Product[],
): ProductDiff => {
  const wipMap = new Map(wipProducts.map((p) => [getStyleCode(p), p]));
  const publishedMap = new Map(
    publishedProducts.map((p) => [getStyleCode(p), p]),
  );

  const added: Product[] = [];
  const removed: Product[] = [];
  const modified: Array<{ styleCode: string; changes: string[] }> = [];

  // Find added and modified products
  for (const [styleCode, wipProduct] of wipMap.entries()) {
    if (!publishedMap.has(styleCode)) {
      added.push(wipProduct);
    } else {
      const publishedProduct = publishedMap.get(styleCode)!;
      const changes = detectProductChanges(wipProduct, publishedProduct);
      if (changes.length > 0) {
        modified.push({ styleCode, changes });
      }
    }
  }

  // Find removed products
  for (const [styleCode, publishedProduct] of publishedMap.entries()) {
    if (!wipMap.has(styleCode)) {
      removed.push(publishedProduct);
    }
  }

  return { added, removed, modified };
};

/**
 * Detect changes between two product objects
 */
const detectProductChanges = (
  product1: Product,
  product2: Product,
): string[] => {
  const changes: string[] = [];
  const keysToCheck = new Set([
    ...Object.keys(product1),
    ...Object.keys(product2),
  ]);

  for (const key of keysToCheck) {
    const val1 = JSON.stringify(product1[key]);
    const val2 = JSON.stringify(product2[key]);

    if (val1 !== val2) {
      changes.push(key);
    }
  }

  return changes;
};

/**
 * Format date for display
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date for input field (YYYY-MM-DDTHH:mm)
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Export snapshot to ADL-ready JSON format
 */
export const exportSnapshotForADL = (snapshot: Snapshot): string => {
  return JSON.stringify(snapshot.products, null, 2);
};
