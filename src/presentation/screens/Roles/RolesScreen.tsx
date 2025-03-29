import { Button, Input } from "@nextui-org/react";
import { BaseScreen } from "../BaseScreen";
import { IoIosAdd } from "react-icons/io";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { MODEFORMENUM } from "../../../enum/mode/mode.enum";
import { ModalSubRol } from "./components/ModalSubRol";
import { useSubRolStore } from "./store/subrol.store";
import { ActionSubRol } from "./components/ActionSubRol";
import { useGetSubRol } from "./querys/subrol.query";
import { CiSearch } from "react-icons/ci";

export function RolesScreen() {
  const [searchByWord, setSearchByWord] = useState<string | undefined>();
  const { toggleForm: toggleFormSubRol, setModeForm } = useSubRolStore();
  const { data: dataSubRol } = useGetSubRol();

  const columns: GridColDef[] = [
    { field: "colId", headerName: "N", width: 90 },
    {
      field: "col1",
      headerName: "Rol",
      flex: 1,
    },
    {
      field: "col2",
      headerName: "Nombre SubRol",
      flex: 1,
    },
    {
      field: "col3",
      headerName: "Acciones",
      width: 100,
      sortable: false,
      filterable: false,
      pinnable: false,
      renderCell: (params) => <ActionSubRol id={params.id.toString()} />,
    },
  ];

  const row = useMemo(() => {
    if (!dataSubRol) return [];
    console.log(dataSubRol);
    let filteredData = dataSubRol;

    if (searchByWord) {
      filteredData = filteredData.filter((rol) =>
        rol.name.toLowerCase().includes(searchByWord.toLowerCase())
      );
    }

    // Ordenar alfabéticamente por el nombre del subrol (col2)
    const sortedData = filteredData.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return sortedData.map((roldata, index) => ({
      colId: index + 1,
      id: roldata.id,
      col1: roldata.rol.name,
      col2: roldata.name,
    }));
  }, [dataSubRol, searchByWord]);

  return (
    <>
      <BaseScreen
        titlePage="Roles"
        actions={
          <Button
            onClick={() => {
              setModeForm(MODEFORMENUM.CREATE);
              toggleFormSubRol();
            }}
            startContent={<IoIosAdd />}
            color="success"
          >
            Nuevo Rol
          </Button>
        }
      >
        <div className="flex flex-col gap-2 flex-1">
          <Input
            label=""
            placeholder="Buscar Rol..."
            variant="bordered"
            startContent={<CiSearch />}
            onChange={(e) => setSearchByWord(e.target.value)}
            className="max-w-sm"
          />

          <div className="flex-1 overflow-auto">
            <DataGrid
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

      <ModalSubRol />
    </>
  );
}
