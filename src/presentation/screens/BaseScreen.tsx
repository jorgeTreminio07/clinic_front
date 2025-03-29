import { Button, Tooltip } from "@nextui-org/react";
import { BaseConfirmModal } from "../components/Base/BaseConfirmModal";
import { useConfirmStore } from "../storage/confim.storage";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

interface IProps {
  children?: JSX.Element;
  titlePage?: string | JSX.Element;
  description?: string;
  actions?: JSX.Element;
  showBackButton?: boolean;
  isLoading?: boolean;
}
export function BaseScreen({
  children,
  titlePage,
  description: descriptionPage,
  actions,
  showBackButton = false,
  isLoading = false,
}: IProps) {
  const { title, description, isOpen, hideConfirm, confirm } =
    useConfirmStore();

  const navigate = useNavigate();

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4 px-4 py-2 ">
        <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between">
          <div className="flex flex-row gap-2 items-start">
            {showBackButton && (
              <Tooltip content="Atras" showArrow>
                <Button
                  onPress={() => navigate(-1)}
                  size="sm"
                  startContent={<IoMdArrowRoundBack />}
                />
              </Tooltip>
            )}
            <div className="w-full flex flex-col items-start justify-start">
              <h1 className="text-2xl font-semibold">{titlePage}</h1>
              <h3 className="text-gray-500 font-semibold text-sm">
                {descriptionPage}
              </h3>
            </div>
          </div>
          <div className="relative flex flex-row gap-2 sm:items-center items-start sm:justify-center justify-end sm:w-auto w-full">
            {actions}
          </div>
        </div>
        {isLoading ? <LoadingScreen /> : children}
      </div>
      <BaseConfirmModal
        title={title}
        description={description}
        isOpen={isOpen}
        onOpenChange={hideConfirm}
        onCancel={hideConfirm}
        onConfirm={confirm}
      />
    </>
  );
}
