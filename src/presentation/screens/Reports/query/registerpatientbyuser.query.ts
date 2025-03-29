import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axios.config";

// Definir una interfaz para los parámetros que incluirá la fecha y el userId
interface IReportParams {
  startDate: string;
  endDate: string;
  userId?: string; // El userId es opcional
}

const BASE_URL = "/Report";

// Función para traer los pacientes registrados por usuario y rango de fechas
export async function getRegisteredPatientsByUser(params?: IReportParams) {
  console.log(params); // Para verificar los parámetros en la consola

  const queryParams = new URLSearchParams();

  // Agregar los parámetros de fecha a la URL
  if (params?.startDate) queryParams.append("startDate", params.startDate.toString());
  if (params?.endDate) queryParams.append("endDate", params.endDate.toString());

  // Si el userId está disponible, agregarlo a la URL
  if (params?.userId) queryParams.append("userId", params.userId);

  const { data } = await axiosInstance.get(
    `${BASE_URL}/register-patient-by-user${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );

  return data; // Devolver la data obtenida de la API
}

// Hook que utiliza la función getRegisteredPatientsByUser
export function useGetRegisteredPatientsByUser(params?: IReportParams) {
  return useQuery({
    queryKey: ["getRegisteredPatientsByUser", params?.userId], // Incluye userId en la queryKey para evitar caché errónea
    queryFn: () => getRegisteredPatientsByUser(params), // Función que se ejecutará para obtener los datos
    enabled: false, // Se desactiva la ejecución automática de la query
  });
}
