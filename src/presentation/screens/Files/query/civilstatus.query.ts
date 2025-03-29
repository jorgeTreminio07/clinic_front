import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";
import { ICivilStatus } from "../../../../interfaces/civil.status.interface";

const BASE_URL = "/civilstatus";
export async function GetAllCivilStatus() {
  const { data } = await axiosInstance.get<ICivilStatus[]>(BASE_URL);
  return data;
}

export function useGetAllCivilStatus() {
  return useQuery({
    queryKey: ["getAllCivilStatus"],
    queryFn: GetAllCivilStatus,
  });
}
