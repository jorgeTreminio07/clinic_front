import { RolEnum } from "../../../../enum/rol/rol.enum";
// import { useAddUser, useUpdateUser } from "../query/user.query";
// import { userSchemaValidation } from "../schemas/user.schema";
// import { useUserStore } from "../store/user.store";
import { useFormik } from "formik";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
// import { IUserReqDto } from "../../../../domain/dto/request/user/user.req.dto";
import { ISubRolReqDto } from "../../../../Dto/Request/subrol.req.dto";
import { useSubRolStore } from "../store/subrol.store";
import { subRolSchemaValidation } from "../schemas/subrol.schema";
import { useAddSubRol, useUpdateSubRol } from "../querys/subrol.query";

export function useFormikSubRol() {
  const { status: addSubRolStatus, mutate } = useAddSubRol();
  const { status: updateSubRolStatus, mutate: mutateUpdate } = useUpdateSubRol();

  const { modeForm, subRol } = useSubRolStore();

  const isCreateMode = modeForm === MODEFORMENUM.CREATE;

  const initialValues: Partial<ISubRolReqDto> = isCreateMode
  ? {
      name: "",
      rolId: "",
    }
  : {
      id: subRol?.id,
      rolId: subRol?.rol.id,
      name: subRol?.name,
    };


  const {
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    submitForm: submitForm,
    errors,
    values,
  } = useFormik<Partial<ISubRolReqDto>>({
    initialValues: initialValues,
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    validationSchema: () => subRolSchemaValidation(),
    onSubmit: (values) => {
      if (isCreateMode) {
        mutate({
          rolId: values.rolId!,
          name: values.name!,
        });
      } else {
        mutateUpdate({
            id: values.id,
            rolId: values.rolId,
            name: values.name,
        });
      }
    },
  });

  return {
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    submitForm,
    errors,
    values,
    addSubRolStatus,
    updateSubRolStatus,
  };
}

//xd
