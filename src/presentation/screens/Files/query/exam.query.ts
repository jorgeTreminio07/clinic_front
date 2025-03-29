import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";
import { IExam } from "../../../../interfaces/exam.interface";
import { IExamReqDto } from "../../../../Dto/Request/exam.req.dto";
import toast from "react-hot-toast";

const BASE_URL = "/Exam";

export async function GetAllExam() {
        const { data } = await axiosInstance.get<IExam[]>(BASE_URL);
        return data;
}

export function useGetExam() {
    return useQuery({
      queryKey: ["getAllExam"],
      queryFn: GetAllExam,
    });
}

export async function AddExam(params: IExamReqDto) {
    await axiosInstance.post<IExam>(BASE_URL, params);
}

export async function DeleteExam(id: string) {
  await axiosInstance.delete<IExam>(`${BASE_URL}/${id}`);
}

export async function UpdateExman(params: Partial<IExamReqDto>){
  await axiosInstance.put<IExam>(`${BASE_URL}`, params);
}





export function useAddExam() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["addExam"],
      mutationFn: AddExam,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllExam"] });
        toast.success("Examen creado", {
          position: "top-right",
          duration: 3000,
        });
      },
      onError: () => {
        toast.error("Error al crear Examen", {
          position: "top-right",
          duration: 3000,
        });
      },
    });
  }

  export function useDeleteExam() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["deleteExam"],
      mutationFn: DeleteExam,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllExam"] });
        toast.success("Examen eliminado", {
          position: "top-right",
          duration: 3000,
        });
      },
      onError: () => {
        toast.error("Error al eliminar Examen", {
          position: "top-right",
          duration: 3000,
        });
      },
    });
  }

  export function useUpdateExam() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["updateExam"],
      mutationFn: UpdateExman,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllExam"] });
        toast.success("Examen actualizado", {
          position: "top-right",
          duration: 3000,
        });
      },
      onError: () => {
        toast.error("Error al actualizar Examen", {
          position: "top-right",
          duration: 3000,
        });
      },
    });
  }
