import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";
// import { IRol } from "../../../../interfaces/rol.interface";
import { ISubRolReqDto } from "../../../../Dto/Request/subrol.req.dto";
import toast from "react-hot-toast";
import { ISubRol } from "../../../../interfaces/subrol.interface";

const BASE_URL = "/Rol/subrol";

export async function GetAllSubRol() {
    const { data } = await axiosInstance.get<ISubRol[]>(BASE_URL);
    return data;
}

export async function AddSubRol(params: ISubRolReqDto) {
    await axiosInstance.post<ISubRol>(BASE_URL, params);
}

export async function UpdateSubRol(params: Partial<ISubRolReqDto>){
    await axiosInstance.put<ISubRol>(`${BASE_URL}`, params);
}

  export async function DeleteSubRol(id: string) {
    await axiosInstance.delete<ISubRol>(`${BASE_URL}/${id}`);
}



export function useGetSubRol() {
    return useQuery({
      queryKey: ["getAllSubRol"],
      queryFn: GetAllSubRol,
    });
}

export function useAddSubRol() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["addSubRol"],
      mutationFn: AddSubRol,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllSubRol"] });
        toast.success("SubRol creado", {
          position: "top-right",
          duration: 3000,
        });
      },
      onError: () => {
        toast.error("Error al crear SubRol", {
          position: "top-right",
          duration: 3000,
        });
      },
    });
  }

  export function useUpdateSubRol() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["updateSubRol"],
      mutationFn: UpdateSubRol,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllSubRol"] });
        toast.success("SubRol actualizado", {
          position: "top-right",
          duration: 3000,
        });
      },
      onError: () => {
        toast.error("Error al actualizar SubRol", {
          position: "top-right",
          duration: 3000,
        });
      },
    });
  }

  export function useDeleteSubRol() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["deleteSubRol"],
      mutationFn: DeleteSubRol,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllSubRol"] });
        toast.success("SubRol eliminado", {
          position: "top-right",
          duration: 3000,
        });
      },
      onError: () => {
        toast.error("Error al eliminar subRol", {
          position: "top-right",
          duration: 3000,
        });
      },
    });
  }