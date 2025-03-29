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
import { useDeleteUser } from "../query/user.query";
import { useUserStore } from "../store/user.store";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { useQueryClient } from "@tanstack/react-query";
import { UserEntity } from "../../../../domain/entity/user/user.entity";

interface IProps {
  id: string;
}

export function UserAction({ id }: IProps) {
  const showModalConfirm = useConfirmStore((state) => state.showConfirm);
  const { status: statusDeleteUser, mutate: handleDeleteUser } =
    useDeleteUser();
  const { toggleForm, setModeForm, setUser } = useUserStore();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    showModalConfirm("Eliminar", "¿Desea eliminar el usuario?", () =>
      handleDeleteUser(id)
    );
  };

  const handleUpdate = () => {
    const user = (queryClient.getQueryData<UserEntity[]>(["getAllUsers"]) ?? []).find(
      (user: any) => user.id === id
    );
    
    if(!user) return;

    setUser(user);
    setModeForm(MODEFORMENUM.UPDATE);
    toggleForm();    
  };

  const isLoadindDeleteUser = statusDeleteUser === "pending";

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Dropdown backdrop="blur" className="rounded-md">
        <DropdownTrigger>
          <Button
            isLoading={isLoadindDeleteUser}
            size="sm"
            isIconOnly
            variant="light"
          >
            <FaEllipsisVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            onClick={handleUpdate}
            showDivider
            startContent={<MdEdit />}
            key="edit"
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
