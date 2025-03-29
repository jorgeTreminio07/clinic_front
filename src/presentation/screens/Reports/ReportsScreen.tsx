import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { BaseScreen } from "../BaseScreen";
import { Button, Input, Spinner } from "@nextui-org/react";
import { BaseModal } from "../../components/Base/BaseModal";
import { ReportForm } from "./components/ReportForm";
import { useReportFormStore } from "../../storage/form.storage";
import { useEffect, useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import { FiUserPlus } from "react-icons/fi";
import { FaFileImage } from "react-icons/fa6";
import toast from "react-hot-toast";
import { FaSave } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";

export function ReportsScreen() {
  const [reportName, setReportName] = useState<string>("");
  const { toggleForm, showForm } = useReportFormStore();

  const columns: GridColDef[] = [
    { field: "id", headerName: "N.", width: 90 },
    {
      field: "col1",
      headerName: "Reporte",
      flex: 1,
    },
    {
      field: "col3",
      headerName: "Parametros",
      flex: 1,
    },
    {
      field: "col2",
      headerName: "Acciones",
      width: 200,
      sortable: false,
      filterable: false,
      pinnable: false,
      renderCell: (params: any) => (
        <Button
          size="sm"
          color="primary"
          onPress={() => {
            setReportName(params.row.col1); // Actualiza el nombre del reporte
            const stateForm = useReportFormStore.getState();
            stateForm.setItem(params.id);
            stateForm.toggleForm();
          }}
        >
          <RiFileExcel2Line />
          Generar Reporte
        </Button>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      col1: "Maestro-Detalle",
      col2: "#1",
      col3: "Sin Parámetros",
    },
    {
      id: 2,
      col1: "Citas Pendientes",
      col2: "#2",
      col3: "Rango de Fechas",
    },
    {
      id: 3,
      col1: "Pacientes Registrados Recientemente",
      col2: "#3",
      col3: "Rango de Fechas",
    },
    {
      id: 4,
      col1: "Historial Consultas",
      col2: "#4",
      col3: "Sin Parámetros",
    },
    {
      id: 5,
      col1: "Registros Realizados por Usuarios",
      col2: "#5",
      col3: "Usuario, Rango de Fechas",
    },
    {
      id: 6,
      col1: "Diagnósticos Realizados",
      col2: "#6",
      col3: "Rango de Fechas",
    },
  ];

  return (
    <>
      <BaseScreen titlePage="Reportes">
        <DataGrid columns={columns} rows={rows} hideFooter />
      </BaseScreen>
      <BaseModal
        title={`Generar Reporte ${reportName}`}
        size="md"
        scrollBehavior="inside"
        isOpen={showForm}
        onOpenChange={toggleForm}
      >
        <ReportForm />
      </BaseModal>
    </>
  );
}
