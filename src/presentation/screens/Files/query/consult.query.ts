import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";
import { IConsultReqDto } from "../../../../Dto/Request/consult.req.dto";
import toast from "react-hot-toast";
import { IConsult } from "../../../../interfaces/consult.interface";
import { useParams } from "react-router-dom";

const BASE_URL = "/consult";

export async function getConsultByPatientId(patientId: string) {
  const { data } = await axiosInstance.get<IConsult[]>(`${BASE_URL}/${patientId}`);
  return data;
}


export async function createConsult(params: IConsultReqDto) {
  await axiosInstance.post<IConsultReqDto>(BASE_URL, params);
}

export async function deleteConsult(id: string) {
  await axiosInstance.delete(`${BASE_URL}/${id}`);
}

export function useGetConsultByPatientId(patientId: string) {
  return useQuery({
    queryKey: ["getConsultByPatientId", patientId],
    queryFn: () => getConsultByPatientId(patientId),
  });
}

export async function updateConsult(params: Partial<IConsultReqDto>) {
  await axiosInstance.put(`${BASE_URL}`, params);
}

export function useUpdateConsult() {
  const queryClient = useQueryClient();
  const { patientId } = useParams();
  return useMutation({
    mutationKey: ["updateConsult"],
    mutationFn: updateConsult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPatient"] });
      queryClient.invalidateQueries({
        queryKey: ["getConsultByPatientId", patientId],
      })

      toast.success("Consulta actualizada", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Error al actualizar consulta", {
        position: "top-right",
        duration: 3000,
      });
    }
  });
}

export function useCreateConsult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createConsult"],
    mutationFn: createConsult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPatient"] });
      
      toast.success("Consulta creada", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Error al crear consulta", {
        position: "top-right",
        duration: 3000,
      });
    }
  });
}

export function useDeleteConsult() {
  const { patientId } = useParams();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["deleteConsult"],
    mutationFn: deleteConsult,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["getAllPatient"] });
      queryClient.invalidateQueries({
        queryKey: ["getConsultByPatientId", patientId],
      })

      toast.success("Consulta eliminada", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Error al eliminar consulta", {
        position: "top-right",
        duration: 3000,
      });
    }
  });
}