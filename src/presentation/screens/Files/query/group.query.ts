import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";
import { IGroup } from "../../../../interfaces/group.interface";


const BASE_URL = "/group";

export async function GetAllGroups() {
        const { data } = await axiosInstance.get<IGroup[]>(BASE_URL);
        return data;
}

export function useGetGroup() {
    return useQuery({
      queryKey: ["getAllGroup"],
      queryFn: GetAllGroups,
    });
}