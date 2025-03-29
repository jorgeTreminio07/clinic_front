import { Button } from "@nextui-org/react";
import { BaseModal } from "./BaseModal";

interface IProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isLoading?: boolean;
}

export function BaseConfirmModal({
  title,
  description,
  onConfirm,
  onCancel,
  isOpen,
  onOpenChange,
  isLoading,
}: IProps) {
  return (
    <BaseModal title={title} isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-6">
        <h1 className="text-1xl">{description}</h1>
        <div className="flex gap-4">
          <Button
            isLoading={isLoading}
            fullWidth
            color="primary"
            onPress={onConfirm}
          >
            Confirmar
          </Button>
          <Button
            disabled={isLoading}
            fullWidth
            color="danger"
            variant="flat"
            onPress={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
