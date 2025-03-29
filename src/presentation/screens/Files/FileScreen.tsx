import { Button, Input } from "@nextui-org/react";
import { BaseScreen } from "../BaseScreen";
import { MdAdd } from "react-icons/md";
import { useGetAllPatient } from "./query/patient.query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { ActionPatient } from "./components/ActionPatient";
import { usePatientStore } from "./store/patient.store";
import { ModalPatient } from "./components/ModalPatient";
import moment from "moment";
import { CiSearch } from "react-icons/ci";
import { MODEFORMENUM } from "../../../enum/mode/mode.enum";
import { ImFilesEmpty } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { BaseModal } from "../../components/Base/BaseModal";
import { useConsutlFormStore } from "../../storage/form.storage";
import { FormConsult } from "./components/FormConsult";

const columns: GridColDef[] = [
  { field: "colId", headerName: "Código", width: 90 },
  {
    field: "col1",
    headerName: "Nombre",
    flex: 1,
  },
  {
    field: "col3",
    headerName: "Dirrección",
    flex: 1,
  },
  {
    field: "col4",
    headerName: "Teléfono",
    flex: 1,
  },
  {
    field: "col5",
    headerName: "Sexo",
    flex: 1,
  },
  {
    field: "col6",
    headerName: "Estado Civil",
    flex: 1,
  },
  {
    field: "col9",
    headerName: "N. Consultas",
    flex: 1,
  },
  {
    field: "col8",
    headerName: "Fecha de creación",
    flex: 1,
  },
  {
    field: "col7",
    headerName: "Acciones",
    width: 100,
    sortable: false,
    filterable: false,
    pinnable: false,
    renderCell: (params) => <ActionPatient id={params.id.toString()} />,
  },
];

export function FileScreen() {
  const navigate = useNavigate();
  const { data: dataPatient, status: statusGetPatient } = useGetAllPatient();
  const [searchByWord, setSearchByWord] = useState<string | undefined>();
  const { toggleForm, setModeForm } = usePatientStore();
  const {
    modeForm,
    setModeForm: setModeFormConsult,
    toggleForm: toggleFormConsult,
    showForm,
  } = useConsutlFormStore();

  const row = useMemo(() => {
    if (!dataPatient) return [];

    if (searchByWord) {
      return dataPatient
        .filter(
          (patient) =>
            patient.name.toLowerCase().includes(searchByWord.toLowerCase()) ||
            patient.id
              .replace(/[^0-9]/g, "")
              .substring(0, 6)
              .toLowerCase()
              .includes(searchByWord.toLowerCase()) ||
            patient.identification
              .toLowerCase()
              .includes(searchByWord.toLowerCase())
        )
        .map((patient) => ({
          colId: patient?.id.replace(/[^0-9]/g, "").substring(0, 6),
          id: patient.id,
          col1: patient.name,
          col2: patient.phone,
          col3: patient.address,
          col4: patient.phone,
          col8: moment(patient.createdAt).format("L"),
          col5:
            patient.typeSex === "c2594acf-bb7c-49d0-9506-f556179670ab"
              ? "Femenino"
              : "Masculino",
          col6: patient.civilStatus.name,
          col9: patient.consultCount,
        }));
    }

    return dataPatient.map((patient) => ({
      colId: patient?.id.replace(/[^0-9]/g, "").substring(0, 6),
      id: patient.id,
      col1: patient.name,
      col2: patient.phone,
      col3: patient.address,
      col4: patient.phone,
      col8: moment(patient.createdAt).format("L"),
      col5:
        patient.typeSex === "c2594acf-bb7c-49d0-9506-f556179670ab"
          ? "Femenino"
          : "Masculino",
      col6: patient.civilStatus.name,
      col9: patient.consultCount,
    }));
  }, [dataPatient, searchByWord]);

  const isLoadingPatient = statusGetPatient === "pending";

  return (
    <>
      <BaseScreen
        titlePage="Expedientes"
        actions={
          <>
            <Button
              onClick={() => {
                setModeForm(MODEFORMENUM.CREATE);
                toggleForm();
              }}
              startContent={<FiUserPlus />}
              color="primary"
            >
              Nuevo paciente
            </Button>

            <Button
              onClick={() => {
                setModeFormConsult(MODEFORMENUM.CREATE);
                toggleFormConsult();
              }}
              startContent={<MdAdd />}
              color="warning"
            >
              Nueva Consulta
            </Button>

            <Button
              onClick={() => {
                navigate("/files/exams");
              }}
              startContent={<ImFilesEmpty />}
              color="success"
            >
              Exámenes
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2 flex-1">
          <Input
            label=""
            placeholder="Buscar Expediente..."
            variant="bordered"
            startContent={<CiSearch />}
            onChange={(e) => setSearchByWord(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex-1 overflow-auto">
            <DataGrid
              loading={isLoadingPatient}
              columns={columns}
              rows={row}
              disableColumnMenu
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              pageSizeOptions={[6]}
            />
          </div>
        </div>
      </BaseScreen>
      <ModalPatient />
      <BaseModal
        size="full"
        scrollBehavior="inside"
        isOpen={showForm}
        onOpenChange={toggleFormConsult}
        title={
          modeForm === MODEFORMENUM.CREATE
            ? "Nueva Consulta"
            : "Editar Consulta"
        }
      >
        <FormConsult id={""} />
      </BaseModal>
    </>
  );
}
