import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";
import { IPagesReqDto } from "../../../../Dto/Request/pages.req.dto";
import { IPages } from "../../../../interfaces/pages.interface";
import toast from "react-hot-toast";


const BASE_URL = "/Page";

export async function GetAllPages() {
    const { data } = await axiosInstance.get<IPages[]>(BASE_URL);
    return data;
}

export async function AddPages(params: IPagesReqDto) {
    await axiosInstance.post<IPages>(`${BASE_URL}/toggle-page-permit`, params);
}

export function useGetPages() {
    return useQuery({
      queryKey: ["getAllPages"],
      queryFn: GetAllPages,
    });
}

export function useAddPages() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["addPages"],
      mutationFn: AddPages,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllPages"] });
        toast.success("Pemisos de pagina concedidos", {
          position: "top-right",
        });
      },
      onError: () => {
        toast.error("Error al crear Page", {
          position: "top-right",
        });
      },
    });
  }
