import {
  CreateCrudService,
  CreateCurdHooks,
  CreateInMemoryCredService,
  useApiClient,
} from "@unifirst/tanstack";
import { useMemo } from "react";

type SourceMode = "api" | "mock";

export interface BaseApiOptions<T extends object> {
  idKey: keyof T;
  basePath: string;
  mode?: SourceMode;
  mockData?: T[];
}

// ✅ make it a hook (recommended)
export function useBaseApi<T extends object>({
  basePath,
  idKey,
  mode = "api",
  mockData = [],
}: BaseApiOptions<T>) {
  const apiClient = useApiClient();

  return useMemo(() => {
    const service =
      mode === "mock"
        ? CreateInMemoryCredService<T>({
            initialData: mockData,
            idKey,
          })
        : CreateCrudService<T>({
            basePath,
            client: apiClient,
          });

    return CreateCurdHooks<T>({
      resource: basePath,
      service,
    });
  }, [apiClient, basePath, idKey, mode, mockData]);
}
