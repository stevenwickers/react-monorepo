import { Product } from "@/features/Products/types.ts";
import { useBaseApi } from "@/features/baseApi";
import mockProducts from "./mock/products.json";

export const useProductsApi = () => {
  return useBaseApi<Product>({
    basePath: "products",
    idKey: "Id",
    mode: "mock",
    mockData: mockProducts,
  });
};
