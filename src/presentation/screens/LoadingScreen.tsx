import { Button, CircularProgress, Tooltip } from "@nextui-org/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { LogOutButton } from "../components/Buttons/LogOutButton";
import { useAuthStore } from "../storage/auth.storage";
import { useToggle } from "../hooks/useToggle";
import { MdLogout } from "react-icons/md";
import { BaseConfirmModal } from "../components/Base/BaseConfirmModal";

interface IProps {
  message?: string;
  showBackButton?: boolean;
  showLogOut?: boolean;
}
export function LoadingScreen({
  message,
  showBackButton = false,
  showLogOut = false,
}: IProps) {
  const navigate = useNavigate();
  const logOut = useAuthStore((state) => state.logOut);
  const [showConfirm, handleShowConfirm] = useToggle();
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      {showBackButton && (
        <Tooltip content="Atrás" showArrow>
          <Button
            onPress={() => navigate(-1)}
            size="sm"
            startContent={<IoMdArrowRoundBack />}
          />
        </Tooltip>
      )}
      <CircularProgress aria-label="Cargando..." />
      {message && <p>{message}</p>}
      {showLogOut && (
        <>
          <div className="flex justify-center">
            <Button
              onClick={handleShowConfirm}
              color="danger"
              variant="light"
              className="flex flex-row items-center justify-center w-auto px-4"
              startContent={<MdLogout />}
            >
              Cerrar sesión
            </Button>
          </div>
          <BaseConfirmModal
            title="Cerrar sesión"
            description="¿Deseas cerrar tu sesión?"
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
      )}
    </div>
  );
}
