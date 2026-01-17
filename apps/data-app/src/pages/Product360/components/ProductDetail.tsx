import { useState } from "react";
import {
  buildImageUrl,
  getPlaceholderImageUrl,
} from "../../../utils/imageUtils.ts";
import {
  getAttributesForTab,
  getAttributeValue,
  formatAttributeValue,
} from "@/utils/attributeUtils.ts";

interface ColorVariant {
  colorCode?: string;
  colorName?: string;
  colorKeywords?: string;
  catalogImages?: string;
  defaultCatalogImage?: string;
  colorSwatch?: string;
  detailImage?: string;
  backImage?: string;
  lifestyleImage?: string;
  video?: string;
}

// Image component with error handling
const ProductImage = ({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = src ? buildImageUrl(src) : null;

  if (!imageUrl || hasError) {
    return (
      <img src={getPlaceholderImageUrl()} alt={alt} className={className} />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

interface ProductDetailProps {
  product: any;
  onClose: () => void;
  allProducts?: any[];
}

const ProductDetail = ({
  product,
  onClose,
  allProducts = [],
}: ProductDetailProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: "General Information" },
    { id: "media", label: "Media Assets" },
    { id: "colors", label: "Colors & Materials" },
    { id: "safety", label: "Safety & Certifications" },
    { id: "relations", label: "Relations & Tags" },
    { id: "location", label: "Location & Program Info" },
  ];

  const renderField = (label: string, value: any) => {
    if (!value || value === "Blank" || value === "x") return null;

    // Handle arrays (e.g., Related Products)
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <div className="py-3 border-b border-gray-200 last:border-0">
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-sm text-gray-900">{value.join(" : ")}</dd>
        </div>
      );
    }

    return (
      <div className="py-3 border-b border-gray-200 last:border-0">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
      </div>
    );
  };

  const renderSizes = () => {
    return renderField("Size", product.size);
  };

  // Render related products with hover tooltips
  const renderRelatedProducts = () => {
    if (!product.relatedProducts || product.relatedProducts.length === 0)
      return null;

    return (
      <div className="py-3 border-b border-gray-200 last:border-0">
        <dt className="text-sm font-medium text-gray-500 mb-3">
          Related Products
        </dt>
        <dd className="mt-1">
          <div className="flex flex-wrap gap-3">
            {product.relatedProducts.map((styleCode: string, index: number) => {
              const relatedProduct = allProducts.find(
                (p: any) => p.styleCode === styleCode,
              );

              if (!relatedProduct) {
                return (
                  <span
                    key={styleCode}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                  >
                    {styleCode}
                  </span>
                );
              }

              const productImage =
                relatedProduct.colorVariants?.[0]?.catalogImages ||
                relatedProduct.colorVariants?.[0]?.defaultCatalogImage;
              const hasValidImage = productImage && productImage !== "x";

              // Adjust tooltip position for first/last items to prevent overflow
              const isFirst = index === 0;
              const isLast = index === product.relatedProducts.length - 1;
              const tooltipPositionClass = isFirst
                ? "left-0"
                : isLast
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2";
              const arrowPositionClass = isFirst
                ? "left-6"
                : isLast
                  ? "right-6"
                  : "left-1/2 -translate-x-1/2";

              return (
                <div
                  key={styleCode}
                  className="relative"
                  onMouseEnter={() => setHoveredProduct(styleCode)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <span className="px-3 py-1 bg-unifirst-teal-100 text-unifirst-teal-700 text-sm rounded-md cursor-pointer hover:bg-unifirst-teal-200 transition-colors">
                    {styleCode}
                  </span>

                  {/* Hover tooltip */}
                  {hoveredProduct === styleCode && (
                    <div
                      className={`absolute z-50 bottom-full ${tooltipPositionClass} mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4`}
                    >
                      {/* Arrow */}
                      <div
                        className={`absolute top-full ${arrowPositionClass} -mt-px`}
                      >
                        <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                      </div>

                      {/* Content */}
                      <div className="flex gap-3">
                        {hasValidImage && (
                          <div className="flex-shrink-0 w-24 h-24">
                            <ProductImage
                              src={productImage}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover rounded-md border border-gray-200"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                            {relatedProduct.name}
                          </h4>
                          {relatedProduct.variety && (
                            <p className="text-xs text-gray-600 mb-2 truncate">
                              {relatedProduct.variety}
                            </p>
                          )}
                          {relatedProduct.description && (
                            <p className="text-xs text-gray-700 line-clamp-3">
                              {relatedProduct.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </dd>
      </div>
    );
  };

  // Render dynamic attributes for a tab
  const renderDynamicAttributes = (tabName: string) => {
    const attributes = getAttributesForTab(tabName);

    return (
      <dl className="divide-y divide-gray-200">
        {/* Core fields always shown first */}
        {tabName === "general" && (
          <>
            {renderField("Series", product.series)}
            {renderField("Style Code", product.styleCode)}
            {renderField("Name", product.name)}
            {renderField("Variety", product.variety)}
            {renderField("Description", product.description)}
            {renderSizes()}
            {renderField("Personalizable", product.personalizable)}
            {renderField(
              "Whether in Product Listing",
              product.whetherInProductListing ? "Yes" : "No",
            )}
          </>
        )}

        {tabName === "relations" && renderRelatedProducts()}
        {tabName === "location" && (
          <>
            {renderField("Redirect", product.redirect)}
            {renderField("Remarks", product.remarks)}
          </>
        )}

        {/* Dynamic attributes from attribute definitions */}
        {attributes.map((attr) => {
          const value = getAttributeValue(product, attr.id);
          const formattedValue = formatAttributeValue(value, attr);

          if (!formattedValue) return null;

          return renderField(attr.label, formattedValue);
        })}
      </dl>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderDynamicAttributes("general");

      case "media": {
        // Get the first color variant's default catalog image as the product-level default
        const defaultCatalogImage =
          product.colorVariants?.[0]?.defaultCatalogImage;

        return (
          <div className="space-y-6">
            {/* Product-Level Default Catalog Image */}
            {defaultCatalogImage && defaultCatalogImage !== "x" && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Default Image
                </h3>
                <div className="flex justify-center">
                  <ProductImage
                    src={defaultCatalogImage}
                    alt={`${product.name} - Default`}
                    className="max-w-md w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Color Variants */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Color Variants ({product.colorVariants?.length || 0})
              </h3>
              {product.colorVariants && product.colorVariants.length > 0 ? (
                <div className="space-y-6">
                  {product.colorVariants.map(
                    (variant: ColorVariant, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Color: {variant.colorName || "Unnamed"}
                          {variant.colorCode && (
                            <span className="text-sm text-gray-500 ml-2">
                              (Code: {variant.colorCode})
                            </span>
                          )}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {variant.catalogImages &&
                            variant.catalogImages !== "x" && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Catalog Image
                                </h4>
                                <ProductImage
                                  src={variant.catalogImages}
                                  alt={`${product.name} - ${variant.colorName} - Catalog`}
                                  className="w-full h-auto rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                                />
                              </div>
                            )}
                          {variant.colorSwatch &&
                            variant.colorSwatch !== "x" && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Color Swatch
                                </h4>
                                <ProductImage
                                  src={variant.colorSwatch}
                                  alt={`${variant.colorName} Swatch`}
                                  className="w-full h-auto rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                                />
                              </div>
                            )}
                          {variant.detailImage &&
                            variant.detailImage !== "x" && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Detail Image
                                </h4>
                                <ProductImage
                                  src={variant.detailImage}
                                  alt={`${product.name} - ${variant.colorName} - Detail`}
                                  className="w-full h-auto rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                                />
                              </div>
                            )}
                          {variant.backImage && variant.backImage !== "x" && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Back Image
                              </h4>
                              <ProductImage
                                src={variant.backImage}
                                alt={`${product.name} - ${variant.colorName} - Back`}
                                className="w-full h-auto rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                              />
                            </div>
                          )}
                          {variant.lifestyleImage &&
                            variant.lifestyleImage !== "x" && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Lifestyle Image
                                </h4>
                                <ProductImage
                                  src={variant.lifestyleImage}
                                  alt={`${product.name} - ${variant.colorName} - Lifestyle`}
                                  className="w-full h-auto rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                                />
                              </div>
                            )}
                          {variant.video && variant.video !== "x" && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Video
                              </h4>
                              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                                <p className="text-sm text-gray-600 break-all">
                                  {variant.video}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No color variants available for this product.
                </p>
              )}
            </div>
          </div>
        );
      }

      case "colors":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                General Fabric Information
              </h3>
              {renderDynamicAttributes("materials")}
            </div>

            {product.colorVariants && product.colorVariants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Color Variants ({product.colorVariants.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.colorVariants.map(
                    (variant: ColorVariant, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Color Code:
                            </span>
                            <span className="ml-2 text-sm text-gray-900">
                              {variant.colorCode || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Color Name:
                            </span>
                            <span className="ml-2 text-sm text-gray-900">
                              {variant.colorName || "N/A"}
                            </span>
                          </div>
                          {variant.colorKeywords && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Keywords:
                              </span>
                              <span className="ml-2 text-sm text-gray-900">
                                {variant.colorKeywords}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "safety":
        return renderDynamicAttributes("safety");

      case "relations":
        return renderDynamicAttributes("relations");

      case "location":
        return renderDynamicAttributes("location");

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-unifirst-light">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={onClose}
                className="flex items-center text-unifirst-teal-500 hover:text-unifirst-teal-800 mb-2"
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
                Back to List
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              {product.variety && (
                <p className="text-gray-600 mt-1">{product.variety}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Style Code</div>
              <div className="text-2xl font-semibold text-gray-900">
                {product.styleCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-unifirst-teal-500 text-unifirst-teal-500"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
