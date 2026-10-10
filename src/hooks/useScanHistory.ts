import { useQuery } from "@tanstack/react-query";
import { fetchScanHistory } from "@/lib/scan-history";
import { useAuth } from "@/hooks/useAuth";

export function useScanHistory(limit = 20) {
  const { authReady, user } = useAuth();

  return useQuery({
    queryKey: ["scan-history", user?.id ?? "guest", limit],
    enabled: authReady,
    queryFn: () => fetchScanHistory(user?.id, limit),
    staleTime: 15_000,
  });
}
