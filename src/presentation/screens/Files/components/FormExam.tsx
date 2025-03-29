import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { useGroupsStore } from "../store/groups.store";
import { useGetGroup } from "../query/group.query";
import { useFormikExam } from "../hooks/useFormikExam";
import { useEffect } from "react";
import { useGetExam } from "../query/exam.query";
import toast from "react-hot-toast";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { useSubRolStore } from "../../Roles/store/subrol.store";

export function FormExam() {
  const { modeForm, toggleForm: toggleFormGroup } = useGroupsStore();
  const { data: DataGroup, isLoading: isLoadingGroup } = useGetGroup();
  const { data: dataExam } = useGetExam();
  // const { modeForm, toggleForm: toggleFormSubRol } = useGroupsStore();

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    statusAddExam,
    statusUpdateExam,
  } = useFormikExam();

  const { group: groupError, name: nameError } = errors;

  // const isLoadingUpdateExam = statusUpdateExam === "pending";
  const isLoadingAddExam = statusAddExam === "pending";

  useEffect(() => {
    if (statusAddExam == "success" || statusUpdateExam === "success") {
      toggleFormGroup();
    }
    console.log(values.group);
  }, [statusAddExam, statusUpdateExam]);

  const handleSubmitForm = () => {
    if (
      Array.isArray(dataExam) &&
      dataExam.some(
        (exam) =>
          exam.name === values.name &&
          exam.group.id === values.group && // Compara con el ID del grupo
          (modeForm === MODEFORMENUM.CREATE || exam.id !== values.id) // Solo excluye el examen actual en edición
      )
    ) {
      if (modeForm === MODEFORMENUM.CREATE) {
        toast.error("El examen ya existe", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.error("El examen ya existe", {
          position: "top-right",
          duration: 3000,
        });
        toggleFormGroup();
      }

      return;
    }

    handleSubmit();
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-row gap-2">
        <Autocomplete
          isLoading={isLoadingGroup}
          isRequired
          defaultItems={DataGroup ?? []}
          label="Grupos"
          size="sm"
          isInvalid={!!groupError}
          errorMessage={groupError}
          selectedKey={values.group}
          onSelectionChange={(e) => setFieldValue("group", e)}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
        <Input
          isRequired
          isInvalid={!!nameError}
          errorMessage={nameError}
          value={values.name}
          onChange={(e) => setFieldValue("name", e.target.value)}
          size="sm"
          label="Nuevo examen"
          // disabled={isLoadingAddUser || isLoadingUpdateUser}
        />
      </div>

      <div className="flex flex-row gap-4 justify-end items-center">
        <Button onClick={() => toggleFormGroup()}>Cancelar</Button>
        <Button
          onClick={() => handleSubmitForm()}
          isLoading={isLoadingAddExam}
          //   disabled={isLoadingRoles}
          color="primary"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
