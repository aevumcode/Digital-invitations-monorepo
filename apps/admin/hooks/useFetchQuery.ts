import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

type FetchQueryOptions<TData, TError = unknown> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
} & Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">;

export function useFetchQuery<TData, TError = unknown>(
  options: FetchQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData>({
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 60 * 1000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    ...options,
  });
}
