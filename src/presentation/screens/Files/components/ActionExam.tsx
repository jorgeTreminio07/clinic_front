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
import { useDeleteExam } from "../query/exam.query";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { useGroupsStore } from "../store/groups.store";
import { IExam } from "../../../../interfaces/exam.interface";
import { useQueryClient } from "@tanstack/react-query";
//   import { useExamStore } from "../store/Exam.store";
//   import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
//   import { useQueryClient } from "@tanstack/react-query";
//   import { IExam } from "../../../../interfaces/Exam.interface";
//   import { useConfirmStore } from "../../../storage/confim.storage";
//   import { useDeleteExam } from "../query/Exam.query";

interface IProps {
  id: string;
}

export function ActionExam({ id }: IProps) {
  const { toggleForm, setModeForm, setExam } = useGroupsStore();
  const { status: statusDeleteExam, mutate: handleDeleteExam } =
    useDeleteExam();
  const clientQuery = useQueryClient();
  const showConfirm = useConfirmStore((state) => state.showConfirm);

  const handleUpdate = () => {
    const Exam = (clientQuery.getQueryData<IExam[]>(["getAllExam"]) ?? []).find(
      (Exam) => Exam.id === id
    );

    if (!Exam) return;

    setExam(Exam);
    setModeForm(MODEFORMENUM.UPDATE);
    toggleForm();
  };

  const handleDelete = () => {
    showConfirm("Eliminar", "¿Desea eliminar el Examen?", () => {
      handleDeleteExam(id);
    });
  };

  return (
    <div className="flex flex-row gap-2 items-center justify-center h-full w-full">
      <Dropdown backdrop="blur" className="rounded-md">
        <DropdownTrigger>
          <Button
            isLoading={statusDeleteExam === "pending"}
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
