import { useFormik } from "formik";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { IConsultReqDto } from "../../../../Dto/Request/consult.req.dto";
import { useConsutlFormStore } from "../../../storage/form.storage";
import { consultSchemaValidation } from "../schemas/consult.schema";
import { useCreateConsult, useUpdateConsult } from "../query/consult.query";
import moment from "moment";

export function useFormikConsult() {
  const { status: addConsultStatus, mutate: createConsult } =
    useCreateConsult();
  const { status: updateConsultStatus, mutate: updateConsult } =
    useUpdateConsult();
  const { item, modeForm } = useConsutlFormStore();

  const isCreateMode = modeForm === MODEFORMENUM.CREATE;

  const initialValues: Partial<IConsultReqDto> = isCreateMode
    ? {}
    : {
        patient: item?.patient?.id,
        nextappointment: item?.nextappointment,
        weight: item?.weight,
        size: item?.size,
        recipe: item?.recipe,
        motive: item?.motive,
        antecedentPerson: item?.antecedentPersonal,
        diagnostic: item?.diagnosis,
        clinicalhistory:
          item?.clinicalhistory !== null ? item?.clinicalhistory : undefined,
        bilogicalEvaluation:
          item?.bilogicalEvaluation !== null
            ? item?.bilogicalEvaluation
            : undefined,
        psychologicalEvaluation:
          item?.psychologicalEvaluation !== null
            ? item?.psychologicalEvaluation
            : undefined,
        socialEvaluation:
          item?.socialEvaluation !== null ? item?.socialEvaluation : undefined,
        functionalEvaluation:
          item?.functionalEvaluation !== null
            ? item?.functionalEvaluation
            : undefined,
        pulse: item?.pulse !== null ? Number(item?.pulse) : undefined,
        oxygenSaturation:
          item?.oxygenSaturation !== null
            ? Number(item?.oxygenSaturation)
            : undefined,
        systolicPressure:
          item?.systolicPressure !== null
            ? Number(item?.systolicPressure)
            : undefined,
        diastolicPressure:
          item?.diastolicPressure !== null
            ? Number(item?.diastolicPressure)
            : undefined,
        antecedentFamily:
          item?.antecedentFamily !== null ? item?.antecedentFamily : undefined,
        examComplementary:
          item?.complementaryTest !== null
            ? String(item?.complementaryTest.id)
            : undefined,
        image: item?.image !== null ? String(item?.image) : undefined,
      };

  const {
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    submitForm: submitForm,
    errors,
    values,
  } = useFormik<Partial<IConsultReqDto>>({
    initialValues,
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    validationSchema: () => consultSchemaValidation(),
    onSubmit: (values) => {
      if (isCreateMode) {
        createConsult({
          ...values,
          patient: values.patient!,
          nextappointment: values.nextappointment!,
          weight: values.weight!,
          size: values.size!,
          diagnostic: values.diagnostic!,
          recipe: values.recipe!,
          antecedentPerson: values.antecedentPerson!,
          motive: values.motive!,
        });
      } else {
        updateConsult({
          id: item?.id!,
          ...values,
          nextappointment: values.nextappointment!,
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
    addConsultStatus,
    updateConsultStatus,
  };
}
