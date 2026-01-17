import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../../data/products.json";
import lookupTableData from "../../data/lookupTableData.json";
import ProductList from "./components/ProductList.tsx";
import ProductDetail from "./components/ProductDetail.tsx";
import FilterPanel, { FilterOption } from "./components/FilterPanel.tsx";
import { ATTRIBUTES_ROUTE, PUBLISHING_ROUTE } from "@/global/contants.ts";
import {
  getFilterableAttributes,
  applyFilters as applyAttributeFilters,
} from "@/utils/attributeUtils.ts";
import { Badge, Button, Card, CardContent, Skeleton } from "@unifirst/ui";

import {
  Search,
  Settings2,
  FileStack,
  X,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useLookupApi } from "@/features/Lookups";

const ITEMS_PER_PAGE = 25;

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "Style Code", direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Get filterable attributes dynamically
  const filterableAttributes = useMemo(() => getFilterableAttributes(), []);

  // Load products
  useEffect(() => {
    setLoading(true);
    // Simulate async data loading
    setTimeout(() => {
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    }, 500);
  }, []);

  // Apply search and filters using attribute utilities
  useEffect(() => {
    // Apply search and filters using utility function
    const result = applyAttributeFilters(products, filters, searchQuery);

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";

        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [products, searchQuery, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const handleRemoveFilter = (filterKey: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  // Map attribute IDs to lookup table names
  const attributeToTableName: Record<string, string> = {
    category: "Category",
    brand: "Brand",
    programType: "ProgramType",
    subCategories: "SubCategory",
    industry: "Industry",
    gender: "Gender",
    country: "Country",
    fabric: "Fabric",
    tags: "Tag",
  };

  // Get unique values for all filterable attributes from lookup table data
  const attributeOptions = useMemo(() => {
    const options: Record<string, FilterOption[]> = {};

    // Group lookup data by TableName for efficient access
    const lookupByTable = lookupTableData.reduce(
      (acc, item) => {
        if (!acc[item.TableName]) {
          acc[item.TableName] = [];
        }
        acc[item.TableName].push({
          Id: item.Id,
          TableName: item.TableName,
          Name: item.Name,
        });
        return acc;
      },
      {} as Record<string, FilterOption[]>,
    );

    filterableAttributes.forEach((attr) => {
      const tableName = attributeToTableName[attr.id];
      if (tableName && lookupByTable[tableName]) {
        // Use lookup table data - already sorted alphabetically in the JSON
        options[attr.id] = lookupByTable[tableName];
      } else {
        // Fallback to empty array for attributes without lookup data
        options[attr.id] = [];
      }
    });
    return options;
  }, [filterableAttributes]);

  // Get active filter count and chips
  const activeFilters = useMemo(() => {
    return Object.entries(filters)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => {
        const attr = filterableAttributes.find((a) => a.id === key);
        return { key, label: attr?.label || key, value };
      });
  }, [filters, filterableAttributes]);

  const activeFilterCount = activeFilters.length;
  const hasActiveFilters = activeFilterCount > 0 || searchQuery !== "";

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredProducts.length,
  );
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="page-container">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-72" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          {/* Toolbar skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-[360px]" />
          </div>
          {/* Table skeleton */}
          <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="space-y-0">
                <Skeleton className="h-12 w-full rounded-none" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-none" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        allProducts={products}
      />
    );
  }

  return (
    <div
      id="product360"
      className="page-container h-full flex flex-col overflow-hidden"
    >
      {/* Row 1: Page Header */}
      <div className="flex items-start justify-end shrink-0 mb-2.5">
        <div className="flex justify-end shrink-0 items-center gap-2">
          {/* Secondary action */}
          <Button
            onClick={() => navigate(ATTRIBUTES_ROUTE)}
            className="inline-flex items-center gap-2 rounded-lg
              bg-unifirst-teal-500 px-3 py-2 text-sm font-medium text-white
              hover:bg-unifirst-teal-600 focus:ring-2"
          >
            <Settings2 className="w-4 h-4" />
            Attribute Manager
          </Button>

          {/* Primary action */}
          <Button
            onClick={() => navigate(PUBLISHING_ROUTE)}
            className="inline-flex items-center gap-2 rounded-lg
              bg-unifirst-gold-500 px-3 py-2 text-sm font-medium text-white
              hover:bg-unifirst-gold-600 focus:ring-2"
          >
            <FileStack className="w-4 h-4" />
            Publishing
          </Button>
        </div>
      </div>

      {/* Row 2: Product count + Search */}
      <div className="flex items-center justify-between shrink-0 mb-2.5">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">{products.length}</span>{" "}
          products
        </p>

        {/* Search */}
        <div className="relative w-full max-w-[360px]">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, tags, or style code..."
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm
              placeholder:text-gray-400 focus:outline-none
              focus:ring-1 focus:ring-border-gray-300 transition-colors"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Row 3: Filter Controls with border */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 shrink-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {/* Filter Panel Button (Sheet trigger) */}
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden hover:border-unifirst-teal-400 transition-colors">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              attributes={filterableAttributes}
              attributeOptions={attributeOptions}
            />
          </div>

          {/* Individual filter chips with delete icons */}
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm shadow-sm hover:border-gray-300 transition-colors"
            >
              <span className="text-gray-700">
                {filter.label}:{" "}
                <span className="font-medium text-gray-900">
                  {filter.value}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleRemoveFilter(filter.key)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-unifirst-teal-500 transition-colors"
                title={`Remove ${filter.label} filter`}
              >
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          ))}

          {/* Clear all button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-1.5 shadow-sm hover:bg-red-50 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              title="Clear all filters"
            >
              <XCircle className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Row 3: Grid Container */}
      <Card className="border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
        <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
          {/* Table with scroll container */}
          <div className="overflow-auto flex-1 min-h-0 relative overscroll-contain">
            <ProductList
              products={paginatedProducts}
              onProductSelect={setSelectedProduct}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>

          {/* Pagination footer */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-4 py-3 shrink-0">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>
                –<span className="font-medium text-gray-900">{endIndex}</span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredProducts.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2 rounded-md border-gray-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">
                    Previous
                  </span>
                </Button>

                <div className="flex items-center gap-1">
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 min-w-[32px] px-2 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-unifirst-teal-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 px-2 rounded-md border-gray-300"
                >
                  <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
