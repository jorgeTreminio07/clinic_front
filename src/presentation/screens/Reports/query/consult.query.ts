import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";

interface IRangeDate {
  startDate: string;
  endDate: string;
}

const BASE_URL = "/Consult";

// para traer todos
// para traer por fecha
export async function getRecentConsults(params?: IRangeDate) {
  console.log(params);
  const queryParams = new URLSearchParams();

  if (params?.endDate) queryParams.append("endDate", params.endDate.toString());
  if (params?.startDate) queryParams.append("startDate", params.startDate.toString());

  const { data } = await axiosInstance.get(
    `${BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  );
  return data;
}

export function useGetRecentConsults(params?: IRangeDate) {
  return useQuery({
    queryKey: ["getRecentConsults"],
    queryFn: () => getRecentConsults(params),
    enabled: false,
  });
}
