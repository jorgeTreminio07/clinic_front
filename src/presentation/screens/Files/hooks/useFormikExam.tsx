import { useFormik } from "formik";
import { IExamReqDto } from "../../../../Dto/Request/exam.req.dto";
import { examSchemaValidation } from "../schemas/exam.schema";
import { useAddExam, useUpdateExam } from "../query/exam.query";
import { useGroupsStore } from "../store/groups.store";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";

export function useFormikExam() {
  const { mutate, status: statusAddExam } = useAddExam();
  const { mutate: mutateUpdateExam, status: statusUpdateExam } =
    useUpdateExam();
  //   const { mutate: mutateUpdate, status: statusUpdatePatient } = useUpdatePatient();
  const { exam, modeForm } = useGroupsStore();

  const isCreateMode = modeForm === MODEFORMENUM.CREATE;

  const initialValues: Partial<IExamReqDto> = isCreateMode
    ? { group: "", name: "" }
    : {
        group: exam?.group.id,
        name: exam?.name,
      };

  const {
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    submitForm: submitForm,
    errors,
    values,
  } = useFormik<Partial<IExamReqDto>>({
    initialValues,
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    validationSchema: () => examSchemaValidation(),
    onSubmit: (values) => {
      if (isCreateMode) {
        mutate({ group: values.group!, name: values.name! });
      } else {
        mutateUpdateExam({
          id: exam?.id,
          group: values.group,
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
    statusAddExam,
    statusUpdateExam,
  };
}
