import { Tooltip, Button } from "@nextui-org/react";
import { MdOutlineRestorePage, MdDelete } from "react-icons/md";
import { useConfirmStore } from "../../../storage/confim.storage";
import { useDeleteBackup, useRestoreBackup } from "../querys/backup.query";

interface IProps {
  id: string;
}
export function OptionTableBackup({ id }: IProps) {
  const showConfirm = useConfirmStore((state) => state.showConfirm);
  const { mutate: handleDeleteBackup, status: statusDelete } =
    useDeleteBackup();
  const { mutate: handleRestoreBackup, status: statusRestore } =
    useRestoreBackup();

  const isLoadingDelete = statusDelete === "pending";
  const isLoadingRestore = statusRestore === "pending";

  //   handlers
  const handlerDeleteBackup = () => {
    showConfirm("Eliminar", "¿Desea eliminar el backup?", () =>
      handleDeleteBackup(id)
    );
  };

  const handlerRestoreBackup = () => {
    showConfirm("Restaurar", "¿Desea restaurar el backup?", () =>
      handleRestoreBackup(id)
    );
  };

  return (
    <div className="flex flex-row gap-2 items-center h-full">
      <Tooltip content="Restaurar">
        <Button
          onClick={handlerRestoreBackup}
          disabled={isLoadingDelete}
          isLoading={isLoadingRestore}
          isIconOnly
        >
          <MdOutlineRestorePage />
        </Button>
      </Tooltip>
      <Tooltip content="Eliminar">
        <Button
          onClick={handlerDeleteBackup}
          disabled={isLoadingRestore}
          isLoading={isLoadingDelete}
          isIconOnly
          color="danger"
        >
          <MdDelete />
        </Button>
      </Tooltip>
    </div>
  );
}
