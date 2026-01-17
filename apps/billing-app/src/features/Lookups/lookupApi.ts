import { Lookup } from "@/features/Lookups/types.ts";
import { useBaseApi } from "@/features/baseApi";
import mockLookups from "./mock/data.json";

export const useLookupApi = () => {
  return useBaseApi<Lookup>({
    basePath: "lookups",
    idKey: "Id",
    mode: "mock",
    mockData: mockLookups,
  });
};
