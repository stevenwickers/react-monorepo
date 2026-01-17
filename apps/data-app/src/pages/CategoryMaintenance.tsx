import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "@/data/products.json";
import { HOME_ROUTE, PUBLISHING_ROUTE } from "@/global/contants.ts";
import {
  getAllAttributes,
  getAttributeValueCounts,
} from "@/utils/attributeUtils";

// Load all attributes dynamically from attribute definitions
const attributes = getAllAttributes();

function CategoryMaintenance() {
  const navigate = useNavigate();
  const [selectedAttributeId, setSelectedAttributeId] = useState("category");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "value", direction: "asc" });

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort icon component
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
        className="w-4 h-4 text-unifirst-teal-500"
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
        className="w-4 h-4 text-unifirst-teal-500"
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

  // Extract unique values for an attribute using attribute utilities
  const getCategoryStats = useMemo(() => {
    return getAttributeValueCounts(productsData, selectedAttributeId);
  }, [selectedAttributeId]);

  // Filter and sort stats
  const filteredStats = useMemo(() => {
    let result = [...getCategoryStats];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((stat) =>
        String(stat.value).toLowerCase().includes(query),
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal, bVal;

      if (sortConfig.key === "value") {
        // Ensure values are strings for comparison
        aVal = String(a.value);
        bVal = String(b.value);
        // String comparison
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (sortConfig.key === "count") {
        aVal = a.count;
        bVal = b.count;
      } else if (sortConfig.key === "percentage") {
        aVal = (a.count / productsData.length) * 100;
        bVal = (b.count / productsData.length) * 100;
      }

      // Numeric comparison
      if (sortConfig.direction === "asc") {
        return (aVal ?? 0) - (bVal ?? 0);
      } else {
        return (bVal ?? 0) - (aVal ?? 0);
      }
    });

    return result;
  }, [getCategoryStats, searchQuery, sortConfig]);

  return (
    <div className="min-h-screen bg-unifirst-light">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(HOME_ROUTE)}
              className="flex items-center text-unifirst-teal-500 hover:text-unifirst-teal-800"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Products
            </button>
            <button
              onClick={() => navigate(PUBLISHING_ROUTE)}
              className="flex items-center gap-2 px-4 py-2 bg-unifirst-gold-500 text-white rounded-md hover:bg-unifirst-gold-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              Publishing
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attribute Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and view product attributes and their usage across the
            catalog
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Attribute List Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Attributes
              </h2>
              <nav className="space-y-1">
                {attributes.map((attr) => (
                  <button
                    key={attr.id}
                    onClick={() => {
                      setSelectedAttributeId(attr.id);
                      setSearchQuery("");
                      setSortConfig({ key: "value", direction: "asc" });
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        selectedAttributeId === attr.id
                          ? "bg-unifirst-teal-100 text-unifirst-teal-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {attr.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Attribute Values Display */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Search and Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {
                      attributes.find((a) => a.id === selectedAttributeId)
                        ?.label
                    }{" "}
                    Values
                  </h2>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {filteredStats.length}
                    </span>{" "}
                    unique values
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search values..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-unifirst-teal-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Values Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("value")}
                      >
                        <div className="flex items-center gap-1">
                          Value
                          <SortIcon column="value" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("count")}
                      >
                        <div className="flex items-center gap-1">
                          Product Count
                          <SortIcon column="count" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("percentage")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Usage %
                          <SortIcon column="percentage" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStats.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          {searchQuery
                            ? "No values found matching your search."
                            : "No values found for this attribute."}
                        </td>
                      </tr>
                    ) : (
                      filteredStats.map((stat, index) => {
                        const percentage = (
                          (stat.count / productsData.length) *
                          100
                        ).toFixed(1);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {stat.value}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {stat.count}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-unifirst-teal-500 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="w-12 text-right">
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Card */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Products</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {productsData.length}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Unique Values</div>
                  <div className="text-2xl font-bold text-unifirst-teal-600">
                    {getCategoryStats.length}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Data Type</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {attributes.find((a) => a.id === selectedAttributeId)
                      ?.dataType === "multi-select"
                      ? "Multi-select"
                      : attributes.find((a) => a.id === selectedAttributeId)
                            ?.dataType === "single-select"
                        ? "Single-select"
                        : "Text"}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CategoryMaintenance;
