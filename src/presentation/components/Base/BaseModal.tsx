import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface IProps {
  children?: JSX.Element;
  title?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  showActions?: boolean;
  size?: "4xl" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "5xl" | "full" | undefined;
  scrollBehavior?: "inside" | "normal" | "outside" | undefined
}

export function BaseModal({
  children,
  isOpen,
  onOpenChange,
  title,
  showActions,
  size,
  scrollBehavior
}: IProps) {
  return (
    <Modal scrollBehavior={scrollBehavior} size={size} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              {showActions && (
                <>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
