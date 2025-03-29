import { BaseModal } from "../../../components/Base/BaseModal";
import { usePatientStore } from "../store/patient.store";
import { FormPatient } from "./FormPatient";

export function ModalPatient() {
  const { toggleForm, showForm, titleForm } = usePatientStore();
  return (
    <BaseModal
      isOpen={showForm}
      onOpenChange={toggleForm}
      title={titleForm}
      size="4xl"
    >
      <FormPatient />
    </BaseModal>
  );
}
