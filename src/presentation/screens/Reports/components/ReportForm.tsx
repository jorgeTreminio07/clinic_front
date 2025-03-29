import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DateRangePicker,
  DateValue,
  RangeValue,
  Spinner,
} from "@nextui-org/react";
import { useGetRecentDiagnostics } from "../query/diagnostic.query";
import { useGetMasterData } from "../query/master.query";
import { useGetNextConsults } from "../query/nextconsult.query";
import { useGetRegisteredPatientsByUser } from "../query/registerpatientbyuser.query";
import { useGetRegisteredPatients } from "../query/register.patient.query";
import { useGetRecentConsults } from "../query/consult.query";
import { useEffect, useState } from "react";
import { useReportFormStore } from "../../../storage/form.storage";
import moment from "moment";
import * as XLSX from "xlsx";
import { SiCcleaner } from "react-icons/si";
import toast from "react-hot-toast";
import { useGetAllUsers } from "../../Users/query/user.query";
import { useFormikUser } from "../../Users/hooks/useFormikUser";
import { RiAiGenerate } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";
import { create } from "@mui/material/styles/createTransitions";

interface ReportData {
  [key: string]: string | number | boolean | null;
}

export const ReportForm = () => {
  const item = useReportFormStore((state) => state.item);
  const [rangeDate, setRangeDate] = useState<RangeValue<DateValue>>();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [isReady, setIsReady] = useState<boolean | null>(false);

  const { data: allUser, status: statusGetAllUser } = useGetAllUsers();

  const isLoading = statusGetAllUser === "pending";

  const toggleForm = useReportFormStore((state) => state.toggleForm);

  const { setFieldValue } = useFormikUser();

  const { data: dataRecentDiagnostics, refetch: handleGetRecentDiagnostics } =
    useGetRecentDiagnostics(
      rangeDate
        ? {
            startDate: moment(rangeDate.start.toString()).format("l"),
            endDate: moment(rangeDate.end.toString()).format("l"),
          }
        : undefined
    );

  const { data: dataMaster, refetch: handleGetMasterData } = useGetMasterData(
    rangeDate
      ? {
          startDate: moment(rangeDate.start.toString()).format("l"),
          endDate: moment(rangeDate.end.toString()).format("l"),
        }
      : undefined
  );

  const { data: dataNextConsults, refetch: handleGetNextConsults } =
    useGetNextConsults(
      rangeDate
        ? {
            startDate: moment(rangeDate.start.toString()).format("l"),
            endDate: moment(rangeDate.end.toString()).format("l"),
          }
        : undefined
    );

  const {
    data: dataRegisteredPatientsByUser,
    refetch: handleGetRegisteredPatientsByUser,
  } = useGetRegisteredPatientsByUser(
    rangeDate && selectedUserId // Solo si el rango de fechas y el userId están definidos
      ? {
          startDate: moment(rangeDate.start.toString()).format("l"),
          endDate: moment(rangeDate.end.toString()).format("l"),
          userId: selectedUserId, // Aquí pasamos el userId
        }
      : undefined
  );

  const { data: dataRegisteredPatients, refetch: handleGetRegisteredPatients } =
    useGetRegisteredPatients(
      rangeDate
        ? {
            startDate: moment(rangeDate.start.toString()).format("l"),
            endDate: moment(rangeDate.end.toString()).format("l"),
          }
        : undefined
    );

  const { data: dataConsult, refetch: handleGetConsult } = useGetRecentConsults(
    rangeDate
      ? {
          startDate: moment(rangeDate.start.toString()).format("l"),
          endDate: moment(rangeDate.end.toString()).format("l"),
        }
      : undefined
  );

  useEffect(() => {
    console.log(dataRecentDiagnostics);
    console.log(dataMaster);
    console.log(dataNextConsults);
    console.log(dataRegisteredPatientsByUser);
    console.log(dataRegisteredPatients);
    console.log(dataConsult);

    if (isReady) {
      if (item === 5) {
        if (selectedUserId === null) {
          toast.error("debe seleccionar un usuario", {
            duration: 3000,
          });
          setIsReady(false);
        } else if (rangeDate === undefined) {
          toast.error("debe seleccionar un rango de fechas", {
            duration: 3000,
          });
          setIsReady(false);
        } else {
          toast.success("Datos listos para descargar el reporte Generado", {
            position: "top-right",
            duration: 3000,
          });
        }
      } else {
        toast.success("Datos listos para descargar el reporte Generado", {
          position: "top-right",
          duration: 3000,
        });
      }
    }
  }, [
    dataRecentDiagnostics,
    dataMaster,
    dataNextConsults,
    dataRegisteredPatientsByUser,
    dataRegisteredPatients,
    dataConsult,
    isReady,
  ]);

  const handleClickExport = async () => {
    setLoading(true);
    try {
      if (item === 6) await handleGetRecentDiagnostics();
      else if (item === 4) await handleGetConsult();
      else if (item === 2) await handleGetNextConsults();
      else if (item === 5) await handleGetRegisteredPatientsByUser();
      else if (item === 1) await handleGetRegisteredPatients();
      else if (item === 3) await handleGetMasterData();
    } finally {
      setLoading(false);
      setIsReady(true);
    }
  };

  const getDataForExport = (): ReportData[] => {
    const filterDataMaster = (data: ReportData[] | undefined) =>
      data
        ? data.map(({ registerBy, createdAt, ...rest }) => ({
            ...rest,
            createDate:
              typeof createdAt === "string"
                ? createdAt.split("T")[0] +
                  " " +
                  createdAt.split("T")[1].split(".")[0] // Separar la fecha y hora, eliminando los milisegundos
                : createdAt ?? "",
          }))
        : [];

    const filterDataRegisteredPatients = (data: ReportData[] | undefined) =>
      data
        ? data.map(
            ({
              rol,
              avatar,
              civilStatus,
              typeSex,
              birthday,
              createdAt,
              ...rest
            }) => ({
              ...rest,
              civilStatusName:
                typeof civilStatus === "object" && civilStatus !== null
                  ? (civilStatus as { name: string }).name // Aseguramos que civilStatus es un objeto con la propiedad name
                  : "", // Si no es un objeto o no tiene name, se devuelve una cadena vacía
              typeSex:
                typeSex === "6274ba64-08f7-4f5b-ac4a-eb82849351b4"
                  ? "Masculino"
                  : "Femenino",
              birthday:
                typeof birthday === "string"
                  ? birthday.split("T")[0]
                  : birthday ?? "", // Devuelve "" si es undefined o null
              createDate:
                typeof createdAt === "string"
                  ? createdAt.split("T")[0] +
                    " " +
                    createdAt.split("T")[1].split(".")[0] // Separar la fecha y hora, eliminando los milisegundos
                  : createdAt ?? "",
            })
          )
        : [];

    const filterDataNextConsults = (data: ReportData[] | undefined) =>
      data
        ? data.map(({ nextAppointment, ...rest }) => ({
            ...rest,
            nextcite:
              typeof nextAppointment === "string"
                ? formateDate(nextAppointment)
                : "", // Aplica la función formateDate
          }))
        : [];

    const filterDataByUser = (data: ReportData[] | undefined) =>
      data
        ? data.map(({ createdAt, ...rest }) => ({
            ...rest,
            createDate:
              typeof createdAt === "string"
                ? createdAt.replace("T", " ").split(".")[0] // Dividir por 'T' y quedarnos solo con la fecha
                : "", // Devuelve "" si createdAt no es una cadena
          }))
        : [];
    const filterDataDiagnostic = (data: ReportData[] | undefined) =>
      data
        ? data.map(({ createdAt, userCreatedBy, ...rest }) => ({
            ...rest,
            createDate:
              typeof createdAt === "string"
                ? createdAt.split("T")[0] // Dividir por 'T' y quedarnos solo con la fecha
                : "", // Devuelve "" si createdAt no es una cadena

            userCreatedByName:
              typeof userCreatedBy === "object" && userCreatedBy !== null
                ? (userCreatedBy as { name: string }).name
                : "",
          }))
        : [];

    const filterDataConsult = (data: ReportData[] | undefined) =>
      data
        ? data.map(
            ({
              id,
              patientId,
              patient,
              complementaryTest,
              userCreatedBy,
              nextappointment,
              count,
              createdAt,
              image,
              ...rest
            }) => {
              const patientName =
                typeof patient === "object" && patient !== null
                  ? (patient as { name: string }).name
                  : ""; // Aseguramos que patient es un objeto con la propiedad name

              const complementaryTestName =
                typeof complementaryTest === "object" &&
                complementaryTest !== null
                  ? (complementaryTest as { name: string }).name
                  : "";

              const userCreatedByName =
                typeof userCreatedBy === "object" && userCreatedBy !== null
                  ? (userCreatedBy as { name: string }).name
                  : "";

              const CreatedAtt =
                typeof createdAt === "string"
                  ? createdAt.replace("T", " ").split(".")[0] // Cambia 'T' por espacio y elimina 'Z'
                  : ""; // Devuelve "" si createdAt es undefined o no es una cadena
              const nextAppointmentDate =
                typeof nextappointment === "string"
                  ? nextappointment.replace("T", " ").replace("Z", "") // Cambia "T" por espacio y "Z" por vacío
                  : ""; // Devuelve "" si nextAppointment es undefined o no es una cadena
              // Reorganizamos el objeto para que `patientName` esté en la segunda posición
              return {
                id,
                patientId,
                patientName, // Se coloca al principio
                CreatedAtt,
                ...rest, // El resto de las propiedades se mantienen
                nextAppointmentDate,
                userCreatedByName,
                complementaryTestName,
              };
            }
          )
        : [];

    if (item === 6) {
      return filterDataDiagnostic(dataRecentDiagnostics) || [];
    } else if (item === 4) {
      return filterDataConsult(dataConsult) || [];
    } else if (item === 2) {
      return (filterDataNextConsults(dataNextConsults) as ReportData[]) || [];
    } else if (item === 5) {
      return filterDataByUser(dataRegisteredPatientsByUser) || [];
    } else if (item === 1) {
      return filterDataRegisteredPatients(dataRegisteredPatients || []);
    } else if (item === 3) {
      return filterDataMaster(dataMaster) || [];
    }
    return [];
  };

  const exportToExcel = () => {
    const data = getDataForExport();
    if (data.length === 0) {
      toast.error("No hay datos para exportar", {
        position: "top-right",
      });
      toggleForm();
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    // Autoajustar el ancho de las columnas
    worksheet["!cols"] = Object.keys(data[0]).map((key) => ({
      wch: Math.max(
        ...data.map((row) => {
          const valueLength = String(row[key]).length;
          return valueLength > 40 ? 40 : valueLength; // Limita a 40 caracteres como máximo
        }),
        key.length
      ),
    }));

    // Autoajustar el alto de las filas para textos largos
    worksheet["!rows"] = data.map((row) => ({
      hpx: Math.max(
        20,
        Object.values(row).some((val) => String(val).length > 50) ? 40 : 20
      ),
    }));

    // XLSX.writeFile(workbook, "Reporte_Diagnósticos_Realizados.xlsx");
    if (item === 6) {
      XLSX.writeFile(workbook, "Reporte_Diagnósticos_Realizados.xlsx");
    } else if (item === 4) {
      XLSX.writeFile(workbook, "Reporte_Consultas_Recientes.xlsx");
    } else if (item === 2) {
      XLSX.writeFile(workbook, "Reporte_Citas_Pendientes.xlsx");
    } else if (item === 5) {
      XLSX.writeFile(
        workbook,
        "Reporte_Registros_Realizados_por_Usuarios.xlsx"
      );
    } else if (item === 1) {
      XLSX.writeFile(workbook, "Reporte_Maestro-Detalle.xlsx");
    } else if (item === 3) {
      XLSX.writeFile(
        workbook,
        "Reporte_Pacientes_Registrados_Recientemente.xlsx"
      );
    }
    setIsReady(false);
    toggleForm();
  };

  const formateDate = (date: string) => {
    let dateString = date || "N/A"; // Si no existe el valor, se usará "N/A"

    if (dateString !== "N/A") {
      // Reemplazar "T" por espacio y eliminar la "Z"
      dateString = dateString.replace("T", " ").replace("Z", "");

      // Dividir la fecha en parte de fecha y hora
      let [datePart, timePart] = dateString.split(" ");

      // Extraer la hora, los minutos y los segundos
      let [hours, minutes, seconds] = timePart.split(":").map(Number);

      // Restar 6 horas
      hours -= 6;

      // Si las horas quedan por debajo de 0 (es decir, resta de un día anterior), ajustamos
      if (hours < 0) {
        hours += 24; // Sumar 24 horas si queda negativo
        // Ajustar el día, para eso usamos el objeto Date
        let date = new Date(datePart); // Crear un objeto Date solo con la parte de la fecha
        date.setDate(date.getDate() - 1); // Restamos un día
        datePart = date.toISOString().split("T")[0]; // Formateamos solo la fecha (YYYY-MM-DD)
      }

      // Formatear la nueva hora con los minutos y segundos
      let newTimePart = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      // Crear la nueva fecha con la hora ajustada
      var formattedDate = `${datePart} ${newTimePart}`;
      return formattedDate;

      // Mostrar el resultado en el documento
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 items-center justify-center">
        {item !== undefined && item >= 2 && item <= 6 && item !== 4 && (
          <>
            <p>Por Rango de fechas</p>
            <div className="flex gap-2 items-center">
              <DateRangePicker
                value={rangeDate ?? null}
                onChange={(value) => {
                  if (value !== null) {
                    setRangeDate(value);
                  }
                }}
                size="md"
                className="max-w-xs"
                granularity="day"
                fullWidth
              />
              <Button
                onPress={() => {
                  setRangeDate(undefined);
                }}
                fullWidth
              >
                <SiCcleaner />
              </Button>
            </div>
          </>
        )}

        <div className="w-full max-w-xs flex flex-col gap-2">
          {item === 5 && (
            <Autocomplete
              isLoading={isLoading}
              isRequired
              defaultItems={allUser ?? []}
              label="Usuario"
              size="sm"
              onSelectionChange={(e) => {
                const selectedUser = allUser?.find((user) => user.id === e);
                setSelectedUserId(selectedUser ? selectedUser.id : null);
              }}
            >
              {(item) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
          )}

          <Button
            onPress={handleClickExport}
            fullWidth
            color="success"
            isDisabled={isReady === true} // Se deshabilita solo si isReady es true
            startContent={<RiAiGenerate />}
          >
            {loading ? <Spinner size="sm" /> : "Generar Reporte"}
          </Button>

          <Button
            onPress={exportToExcel}
            color="primary"
            fullWidth
            isDisabled={isReady === false}
          >
            <HiOutlineDownload /> Descargar Reporte en Excel
          </Button>
        </div>
      </div>
    </div>
  );
};
