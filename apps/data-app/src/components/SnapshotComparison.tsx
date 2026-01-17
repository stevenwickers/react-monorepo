import { useMemo } from "react";
import {
  Product,
  ProductDiff,
  compareProducts,
  getStyleCode,
  getProductName,
  getProductCategory,
  getProductBrand,
} from "../utils/publishingUtils";

interface SnapshotComparisonProps {
  wipProducts: Product[];
  publishedProducts: Product[];
  onClose: () => void;
}

function SnapshotComparison({
  wipProducts,
  publishedProducts,
  onClose,
}: SnapshotComparisonProps) {
  const diff = useMemo(
    () => compareProducts(wipProducts, publishedProducts),
    [wipProducts, publishedProducts],
  );

  const totalChanges =
    diff.added.length + diff.removed.length + diff.modified.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-unifirst-dark">
                Catalog Comparison
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Compare work-in-progress catalog with published snapshot
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total Changes</div>
              <div className="text-2xl font-bold text-unifirst-dark">
                {totalChanges}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-700 mb-1">Added Products</div>
              <div className="text-2xl font-bold text-green-600">
                {diff.added.length}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-700 mb-1">Removed Products</div>
              <div className="text-2xl font-bold text-red-600">
                {diff.removed.length}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">
                Modified Products
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {diff.modified.length}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {totalChanges === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No Changes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The work-in-progress catalog is identical to the published
                snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Added Products */}
              {diff.added.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Added Products ({diff.added.length})
                    </h3>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-green-200">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                            Style Code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                            Brand
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-green-100">
                        {diff.added.map((product) => {
                          const category = getProductCategory(product);
                          return (
                            <tr
                              key={getStyleCode(product)}
                              className="hover:bg-green-50"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {getStyleCode(product)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {getProductName(product) || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {Array.isArray(category)
                                  ? category.join(", ")
                                  : category || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {getProductBrand(product) || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Removed Products */}
              {diff.removed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Removed Products ({diff.removed.length})
                    </h3>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-red-200">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                            Style Code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                            Brand
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-red-100">
                        {diff.removed.map((product) => {
                          const category = getProductCategory(product);
                          return (
                            <tr
                              key={getStyleCode(product)}
                              className="hover:bg-red-50"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {getStyleCode(product)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {getProductName(product) || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {Array.isArray(category)
                                  ? category.join(", ")
                                  : category || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {getProductBrand(product) || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Modified Products */}
              {diff.modified.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Modified Products ({diff.modified.length})
                    </h3>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-blue-200">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                            Style Code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                            Changed Fields
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue-100">
                        {diff.modified.map((item) => (
                          <tr key={item.styleCode} className="hover:bg-blue-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.styleCode}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <div className="flex flex-wrap gap-2">
                                {item.changes.map((field) => (
                                  <span
                                    key={field}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                  >
                                    {field}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">WIP:</span> {wipProducts.length}{" "}
              products • <span className="font-medium">Published:</span>{" "}
              {publishedProducts.length} products
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-unifirst-teal-600 text-white rounded-lg hover:bg-unifirst-teal-700 transition-colors font-medium"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SnapshotComparison;
