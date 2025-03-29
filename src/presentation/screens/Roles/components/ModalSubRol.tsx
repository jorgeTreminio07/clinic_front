import { BaseModal } from "../../../components/Base/BaseModal";
import { useSubRolStore } from "../store/subrol.store";
import { FormSubRol } from "./FormSubRol";

export function ModalSubRol() {
  const { toggleForm, showForm, titleForm } = useSubRolStore();
  return (
    <BaseModal
      isOpen={showForm}
      onOpenChange={toggleForm}
      title={titleForm}
      size="4xl"
    >
      <FormSubRol />
    </BaseModal>
  );
}
