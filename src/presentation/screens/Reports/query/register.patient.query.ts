import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";

interface IRangeDate {
  startDate: string;
  endDate: string;
}

const BASE_URL = "/Patient";


// Para traer por fecha de registro
export async function getRegisteredPatients(params?: IRangeDate) {
  console.log(params);
  const queryParams = new URLSearchParams();

 
  if (params?.endDate) queryParams.append("endDate", params.endDate.toString());
  if (params?.startDate) queryParams.append("startDate", params.startDate.toString());

  const { data } = await axiosInstance.get(
    `${BASE_URL}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  return data;
}

export function useGetRegisteredPatients(params?: IRangeDate) {
  return useQuery({
    queryKey: ["getRegisteredPatients"],
    queryFn: () => getRegisteredPatients(params),
    enabled: false,
  });
}