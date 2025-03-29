import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";

interface IRangeDate {
  startDate: string;
  endDate: string;
}

const BASE_URL = "/Report";

// Para obtener datos maestros
// Opcionalmente, filtrar por fechas si es necesario
export async function getMasterData(params?: IRangeDate) {
  console.log(params);
  const queryParams = new URLSearchParams();

 
  if (params?.endDate) queryParams.append("endDate", params.endDate.toString());
  if (params?.startDate) queryParams.append("startDate", params.startDate.toString());

  const { data } = await axiosInstance.get(
    `${BASE_URL}/master${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  return data;
}

export function useGetMasterData(params?: IRangeDate) {
  return useQuery({
    queryKey: ["getMasterData"],
    queryFn: () => getMasterData(params),
    enabled: false,
  });
}