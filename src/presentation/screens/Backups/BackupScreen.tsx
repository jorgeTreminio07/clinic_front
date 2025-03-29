import { Button } from "@nextui-org/react";
import { RiAiGenerate } from "react-icons/ri";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGenerateBackup, useGetAllBackups } from "./querys/backup.query";
import { useMemo } from "react";
import { useConfirmStore } from "../../storage/confim.storage";
import { OptionTableBackup } from "./components/OptionTableBackup";
import { BaseScreen } from "../BaseScreen";
import { ConstData } from "../../../const/const";
import { RefreshButton } from "../../components/Buttons/RefreshButton";

const columns: GridColDef[] = [
  { field: "col1", headerName: "Nombre", flex: 1 },
  { field: "col2", headerName: "Fecha de creación", flex: 1 },
  { field: "col3", headerName: "Hace", flex: 1 },
  {
    field: "col4",
    headerName: "Acciones",
    flex: 1,
    filterable: false,
    sortable: false,
    renderCell: (params) => <OptionTableBackup id={params.id.toString()} />,
  },
];

export default function BackupScreen() {
  const {
    data: dataBackups,
    status: statusGetBackups,
    refetch: refetchBackups,
    isRefetching: isRefetchingBackups,
  } = useGetAllBackups();
  const { status: statusGenerateBackup, mutate: handleGenerateBackup } =
    useGenerateBackup();
  const showModalConfirm = useConfirmStore((state) => state.showConfirm);

  const rows = useMemo(() => {
    if (!dataBackups) {
      return [];
    }

    return dataBackups
      .sort((a, b) => {
        const getTimeStamp = (name: string) => {
          const match = name.match(/(\d{14})/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getTimeStamp(b.name) - getTimeStamp(a.name);
      })
      .map((backup) => ({
        id: backup.id,
        col1: backup.name,
        col2: backup.createdAt,
        col3: backup.relactiveDate,
      }));
  }, [dataBackups]);

  const isLoadingBackups =
    statusGetBackups === "pending" || isRefetchingBackups;
  const isLoadingGenerateBackup = statusGenerateBackup === "pending";

  return (
    <BaseScreen
      titlePage="Backups"
      actions={
        <>
          <Button
            isLoading={isLoadingGenerateBackup}
            onClick={() =>
              showModalConfirm(
                "Generar Backup",
                "¿Deseas generar un backup?",
                () => handleGenerateBackup()
              )
            }
            startContent={<RiAiGenerate />}
            color="primary"
          >
            Generar Backup
          </Button>
          {ConstData.HasElectronMode && (
            <RefreshButton onClick={() => refetchBackups()} />
          )}
        </>
      }
    >
      <div className="flex-1">
        <DataGrid
          loading={isLoadingBackups}
          disableColumnMenu
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
              },
            },
          }}
          pageSizeOptions={[7]}
        />
      </div>
    </BaseScreen>
  );
}
