import { Button } from "@nextui-org/react";
import { useAuthStore } from "../../storage/auth.storage";
import { MdLogout } from "react-icons/md";
import { BaseConfirmModal } from "../Base/BaseConfirmModal";
import { useToggle } from "../../hooks/useToggle";

export function LogOutButton() {
  const logOut = useAuthStore((state) => state.logOut);
  const [showConfirm, handleShowConfirm] = useToggle();

  return (
    <>
      <Button
        onClick={handleShowConfirm}
        color="danger"
        variant="light"
        className="w-full flex flex-row items-center justify-start"
        startContent={<MdLogout />}
      >
        Cerrar sesión
      </Button>
      <BaseConfirmModal
        title="Cerrar sesión"
        description="¿Deseas cerrar tu sesión?"
        isOpen={showConfirm}
        onConfirm={() => {
          logOut();
          handleShowConfirm();
        }}
        onCancel={() => {
          handleShowConfirm();
        }}
      />
    </>
  );
}
