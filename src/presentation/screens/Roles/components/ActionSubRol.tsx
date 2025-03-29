import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdEdit, MdDelete } from "react-icons/md";
import { useConfirmStore } from "../../../storage/confim.storage";

import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";

// import { IExam } from "../../../../interfaces/exam.interface";
// import { useQueryClient } from "@tanstack/react-query";

import { useDeleteSubRol } from "../querys/subrol.query";
import { ISubRol } from "../../../../interfaces/subrol.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useSubRolStore } from "../store/subrol.store";
//   import { useExamStore } from "../store/Exam.store";
//   import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
//   import { useQueryClient } from "@tanstack/react-query";
//   import { IExam } from "../../../../interfaces/Exam.interface";
//   import { useConfirmStore } from "../../../storage/confim.storage";
//   import { useDeleteExam } from "../query/Exam.query";

interface IProps {
  id: string;
}

export function ActionSubRol({ id }: IProps) {
  const {
    toggleForm: toggleFormSubRol,
    setModeForm,
    setSubRol,
  } = useSubRolStore();

  const { status: statusDeleteSubRol, mutate: handleDeleteSubRol } =
    useDeleteSubRol();
  const clientQuery = useQueryClient();
  const showConfirm = useConfirmStore((state) => state.showConfirm);

  const handleUpdate = () => {
    const subRol = (
      clientQuery.getQueryData<ISubRol[]>(["getAllSubRol"]) ?? []
    ).find((subRol) => subRol.id === id);

    if (!subRol) return;

    console.log(subRol);

    setSubRol(subRol);
    setModeForm(MODEFORMENUM.UPDATE);
    toggleFormSubRol();
  };

  const handleDelete = () => {
    showConfirm("Eliminar", "¿Desea eliminar el Rol?", () => {
      handleDeleteSubRol(id);
    });
  };

  return (
    <div className="flex flex-row gap-2 items-center justify-center h-full w-full">
      <Dropdown backdrop="blur" className="rounded-md">
        <DropdownTrigger>
          <Button
            isLoading={statusDeleteSubRol === "pending"}
            size="sm"
            isIconOnly
            variant="light"
          >
            <FaEllipsisVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            showDivider
            startContent={<MdEdit />}
            key="edit"
            onClick={handleUpdate}
          >
            Editar
          </DropdownItem>
          <DropdownItem
            className="text-danger"
            color="danger"
            key="edit"
            startContent={<MdDelete />}
            onClick={handleDelete}
          >
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
