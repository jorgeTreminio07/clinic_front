import { LineChart } from "@mui/x-charts";
import { BaseScreen } from "../BaseScreen";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  useGetTopPatient,
  useGetConsultByDate,
  useGetPatientByDate,
} from "./querys/reports.query";
import { useMemo } from "react";
import moment from "moment";

export function DashboardScreen() {
  const { data: dataTopPatient, status: statusGetTopPatient } =
    useGetTopPatient();

  const { data: dataConsultByDate, isLoading: isLoadingConsult } =
    useGetConsultByDate();
  const { data: dataPatientByDate, isLoading: isLoadingPatient } =
    useGetPatientByDate();

  console.log(dataConsultByDate);

  const { dataXaxis, dataCountConsult, dataCountPatatient } = useMemo(() => {
    if (!dataConsultByDate || !dataPatientByDate)
      return {
        dataXaxis: [],
        dataCountConsult: [],
        dataCountPatatient: [],
      };
    // get date utc

    const dataXaxis = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return moment(date).format("l");
    }).reverse();

    // Inicializamos los datos con ceros
    const dataCountConsult = Array(dataXaxis.length).fill(0);
    const dataCountPatatient = Array(dataXaxis.length).fill(0);

    // Mapeamos los datos de movimiento a índices correspondientes
    for (let i = 0; i < dataXaxis.length; i++) {
      const formattedDate = moment.utc(dataXaxis[i]).format("l");
      const consult = dataConsultByDate.find(
        (item) => moment(item.date).format("l") === formattedDate
      );
      const patient = dataPatientByDate.find(
        (item) => moment(item.date).format("l") === formattedDate
      );
      if (consult) {
        dataCountConsult[i + 1] = consult.count;
      }
      if (patient) {
        dataCountPatatient[i + 1] = patient.count;
      }
    }

    return {
      dataXaxis,
      dataCountConsult,
      dataCountPatatient,
    };
  }, [dataConsultByDate, dataPatientByDate]);

  return (
    <div>
      <div className=" flex flex-col gap-2">
        <div className="bg-white flex flex-col  rounded-md shadow-lg items-center justify-center mt-3">
          <h1 className="text-md font-semibold">Pacientes más recurrentes</h1>

          {/* Gráfico de barras */}
          <div className="w-full flex">
            <BarChart
              dataset={(dataTopPatient ?? []).map((item) => ({
                title: item.name ?? "",
                cantidad: item.total ?? 0,
              }))}
              loading={statusGetTopPatient === "pending"}
              yAxis={[
                {
                  dataKey: "title",
                  scaleType: "band",
                  // valueFormatter: (value) => (value ?? "").split(" ")[0],
                },
              ]}
              series={[
                {
                  dataKey: "cantidad",
                  label: "Consultas",
                },
              ]}
              layout="horizontal"
              width={450} // Tamaño igualado
              height={253} // Tamaño igualado
            />
          </div>
        </div>
        {/* Gráfico de líneas */}
        <div className="bg-white rounded-md shadow-lg flex flex-col items-center justify-center">
          <h1 className="text-md font-semibold">
            Pacientes y Consultas creadas los ultimos 7 días
          </h1>
          <LineChart
            series={[
              {
                data: dataCountConsult,
                label: "Consultas",
                color: "green",
              },
              {
                data: dataCountPatatient,
                label: "Pacientes",
                color: "red",
              },
            ]}
            xAxis={[{ data: dataXaxis, scaleType: "band" }]}
            className="flex-1"
            loading={isLoadingConsult || isLoadingPatient}
            width={600} // Tamaño igualado
            height={252} // Tamaño igualado
          />
        </div>
      </div>
    </div>
  );
}
