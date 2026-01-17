import {
  getListAttributes,
  getAttributeValue,
  formatAttributeValue,
} from "@/utils/attributeUtils.ts";
import { Tooltip, TooltipTrigger, TooltipContent } from "@unifirst/ui";
import { Button } from "@unifirst/ui";
import { Eye } from "lucide-react";

interface ProductListProps {
  products: any[];
  onProductSelect: (product: any) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSort: (key: string) => void;
}

const ProductList = ({
  products,
  onProductSelect,
  sortConfig,
  onSort,
}: ProductListProps) => {
  // Get attributes that should be displayed in the table
  const listAttributes = getListAttributes();

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg
        className="w-4 h-4 text-unifirst-teal-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-unifirst-teal-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <table className="min-w-full divide-y divide-gray-300">
      {/* Sticky header with solid background */}
      <thead className="bg-gray-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgb(209,213,219)]">
        <tr>
          {/* Core columns: Style Code and Name */}
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSort("Style Code")}
          >
            <div className="flex items-center gap-1.5">
              Style Code
              <SortIcon column="Style Code" />
            </div>
          </th>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSort("Name")}
          >
            <div className="flex items-center gap-1.5">
              Name
              <SortIcon column="Name" />
            </div>
          </th>

          {/* Dynamic attribute columns */}
          {listAttributes.map((attr) => (
            <th
              key={attr.id}
              scope="col"
              className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider transition-colors ${
                attr.sortable ? "cursor-pointer hover:bg-gray-100" : ""
              }`}
              onClick={() => attr.sortable && onSort(attr.key)}
            >
              <div className="flex items-center gap-1.5">
                {attr.label}
                {attr.sortable && <SortIcon column={attr.key} />}
              </div>
            </th>
          ))}

          <th
            scope="col"
            className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.length === 0 ? (
          <tr>
            <td
              colSpan={2 + listAttributes.length + 1}
              className="px-4 py-12 text-center text-gray-500"
            >
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-12 h-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <span className="text-sm font-medium">No products found</span>
                <span className="text-xs text-gray-400">
                  Try adjusting your filters or search term
                </span>
              </div>
            </td>
          </tr>
        ) : (
          products.map((product, index) => (
            <tr
              key={`${product.styleCode}-${product.series}-${index}`}
              className="hover:bg-gray-50 cursor-pointer transition-colors group"
              onClick={() => onProductSelect(product)}
            >
              {/* Style Code - monospace for better readability */}
              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-medium text-gray-900 tabular-nums">
                {product.styleCode}
              </td>
              {/* Name with truncation and tooltip */}
              <td className="px-4 py-3 text-sm text-gray-900">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="max-w-xs truncate cursor-default font-medium">
                      {product.name}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    {product.name}
                  </TooltipContent>
                </Tooltip>
                {product.variety && (
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {product.variety}
                  </div>
                )}
              </td>

              {/* Dynamic attribute columns */}
              {listAttributes.map((attr) => {
                const value = getAttributeValue(product, attr.id);
                const formattedValue = formatAttributeValue(value, attr);

                return (
                  <td
                    key={attr.id}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-600"
                  >
                    {attr.display?.badge ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          attr.display.badgeColor === "teal"
                            ? "bg-unifirst-teal-100 text-unifirst-teal-800"
                            : attr.display.badgeColor === "gold"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formattedValue}
                      </span>
                    ) : (
                      <span className="text-gray-600">{formattedValue}</span>
                    )}
                  </td>
                );
              })}

              {/* Actions column - button style */}
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductSelect(product);
                  }}
                  className="h-8 px-3 text-unifirst-teal-600 hover:text-unifirst-teal-800 hover:bg-unifirst-teal-50 opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  <span className="text-xs font-medium">View</span>
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ProductList;
