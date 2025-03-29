import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Input } from "@nextui-org/react";
import { useGetAllUsers } from "./query/user.query";
import { useEffect, useMemo, useState } from "react";
import { AvatarAndNameUser } from "./components/AvatarAndNameUser";
import { UserAction } from "./components/UserAction";
import { BaseModal } from "../../components/Base/BaseModal";
import { FormUser } from "./components/FormUser";
import { BaseScreen } from "../BaseScreen";
import { useUserStore } from "./store/user.store";
import { MODEFORMENUM } from "../../../enum/mode/mode.enum";
import { RefreshButton } from "../../components/Buttons/RefreshButton";
import { ConstData } from "../../../const/const";
import { TiUserAdd } from "react-icons/ti";
import { CiSearch } from "react-icons/ci";

const columns: GridColDef[] = [
  {
    field: "col1",
    renderCell: (params) => (
      <AvatarAndNameUser name={params.value.name} url={params.value.url} />
    ),
    headerName: "Nombre",
    flex: 1,
  },
  { field: "col2", headerName: "Correo", flex: 1 },
  { field: "col3", headerName: "Rol", flex: 1 },
  {
    field: "col5",
    headerName: "Acciones",
    width: 100,
    sortable: false,
    filterable: false,
    pinnable: false,
    renderCell: (params) => <UserAction id={params.id.toString()} />,
  },
];

export default function UserScreen() {
  const {
    data: usersData,
    status: statusGetUsers,
    refetch: refetchUsers,
    isRefetching: isRefetchingUsers,
  } = useGetAllUsers();

  const [searchByWord, setSearchByWord] = useState<string | undefined>();

  const { titleForm, toggleForm, showForm, setModeForm } = useUserStore();

  const rows = useMemo(() => {
    if (!usersData) {
      return [];
    }

    const filteredData = searchByWord
      ? usersData.filter((user) =>
          user.name.toLowerCase().includes(searchByWord.toLowerCase())
        )
      : usersData;

    // Ordenar alfabéticamente por nombre
    const sortedData = filteredData.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return sortedData.map((user) => ({
      id: user.id,
      col1: {
        name: user.name,
        url: user.avatar?.compactUrl,
      },
      col2: user.email,
      col3: user.rol?.name,
    }));
  }, [usersData, searchByWord]);

  console.log(usersData);

  useEffect(() => {
    console.log(statusGetUsers);
  }, [statusGetUsers]);

  const isLoadingUsers = statusGetUsers === "pending" || isRefetchingUsers;

  return (
    <BaseScreen
      titlePage="Usuarios"
      actions={
        <>
          <Button
            color="primary"
            onClick={() => {
              setModeForm(MODEFORMENUM.CREATE);
              toggleForm();
            }}
          >
            <TiUserAdd />
            Nuevo usuario
          </Button>
          {ConstData.HasElectronMode && (
            <RefreshButton onClick={() => refetchUsers()} />
          )}
        </>
      }
    >
      <>
        <Input
          label=""
          placeholder="Buscar Usuario..."
          variant="bordered"
          startContent={<CiSearch />}
          className="max-w-sm"
          onChange={(e) => setSearchByWord(e.target.value)}
        />
        <div className="flex-1">
          <DataGrid
            loading={isLoadingUsers}
            disableColumnMenu
            rows={rows}
            columns={columns}
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
        <BaseModal
          title={titleForm}
          onOpenChange={toggleForm}
          isOpen={showForm}
        >
          <FormUser />
        </BaseModal>
      </>
    </BaseScreen>
  );
}
