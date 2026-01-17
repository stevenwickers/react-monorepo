import { ReactNode } from "react";
import { useLookupApi } from "@/features/Lookups/lookupApi";
import { useProductsApi } from "@/features/Products/productApi";

interface AppBootstrapProps {
  children: ReactNode;
}

export const AppBootstrap = ({ children }: AppBootstrapProps) => {
  const { useList: useLookups } = useLookupApi();
  const { useList: useProducts } = useProductsApi();

  const {
    data: lookupsData,
    isLoading: isLoadingLookups,
    isError: isLookupsError,
  } = useLookups();

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useProducts();

  const isLoading = isLoadingLookups || isLoadingProducts;
  const isError = isLookupsError || isProductsError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-destructive">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome to Data 360
          </h1>
          <p className="text-lg font-medium">Failed to load application data</p>
          <p className="text-sm">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
