import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";

interface IRangeDate {
  startDate: string;
  endDate: string;
}

const BASE_URL = "/Report";

// Para traer por fecha
export async function getNextConsults(params?: IRangeDate) {
  console.log(params);
  const queryParams = new URLSearchParams();

  
  if (params?.endDate) queryParams.append("endDate", params.endDate.toString());
  if (params?.startDate) queryParams.append("startDate", params.startDate.toString());

  const { data } = await axiosInstance.get(
    `${BASE_URL}/next-consults${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  return data;
}

export function useGetNextConsults(params?: IRangeDate) {
  return useQuery({
    queryKey: ["getNextConsults"],
    queryFn: () => getNextConsults(params),
    enabled: false,
  });
}

