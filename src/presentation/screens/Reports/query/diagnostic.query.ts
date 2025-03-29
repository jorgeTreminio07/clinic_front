import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";

interface IRangeDate {
  startDate: string;
  endDate: string;
}

const BASE_URL = "/Report";

// para traer todos
// para traer por fecha
export async function getRecentDiagnostics(params?: IRangeDate) {

  console.log(params);
  const queryParams = new URLSearchParams();

  // pagina?startDate=2025&endDate=2024

  if (params?.endDate) queryParams.append("endDate", params.endDate.toString());
  if (params?.startDate) queryParams.append("startDate", params.startDate.toString());

  const { data } = await axiosInstance.get(
    `${BASE_URL}/recent-diagnostics${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  return data;
}

export function useGetRecentDiagnostics(params?: IRangeDate) {
  return useQuery({
    queryKey: ["getRecentDiagnostics"],
    queryFn: () => getRecentDiagnostics(params),
    enabled: false,
  });
}
