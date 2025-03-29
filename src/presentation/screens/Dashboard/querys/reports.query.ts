import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";
import { IReport, IConsultByDate, IPatientByDate } from "../../../../interfaces/reports.interface";


const BASE_URL = "/report";

export async function getTopPatient() {
    const { data } = await axiosInstance.get<IReport[]>(
      `${BASE_URL}/top-patient-by-consult`
    );
    return data;
}

export function useGetTopPatient() {
  return useQuery({
    queryKey: ["getTopPatient"],
    queryFn: getTopPatient,
  });
}

export async function getConsultByDate() {
  const { data } = await axiosInstance.get<IConsultByDate[]>(
    `${BASE_URL}/consult-by-date`
  );
  return data;
}

export function useGetConsultByDate() {
  return useQuery({
    queryKey: ["getConsultByDate"],
    queryFn: getConsultByDate,
  });
}

export async function getPatientByDate() {
  const { data } = await axiosInstance.get<IPatientByDate[]>(
    `${BASE_URL}/count-patient-by-date`
  );
  return data;
}

export function useGetPatientByDate() {
  return useQuery({
    queryKey: ["getPatientByDate"],
    queryFn: getPatientByDate,
  });
}








