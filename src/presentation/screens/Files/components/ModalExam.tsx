import { BaseModal } from "../../../components/Base/BaseModal";
import { useGroupsStore } from "../store/groups.store";
import { FormExam } from "./FormExam";

export function ModalExam() {
  const { toggleForm, showForm, titleForm } = useGroupsStore();
  return (
    <BaseModal
      isOpen={showForm}
      onOpenChange={toggleForm}
      title={titleForm}
      size="4xl"
    >
      <FormExam />
    </BaseModal>
  );
}
