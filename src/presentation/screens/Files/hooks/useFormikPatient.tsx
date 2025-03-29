import { useFormik } from "formik";
import { IPatientReqDto } from "../../../../Dto/Request/patient.req.dto";
import { patientSchemaValidation } from "../schemas/patient.schema";
import { useAddPatient, useUpdatePatient } from "../query/patient.query";
import { usePatientStore } from "../store/patient.store";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";

export function useFormikPatient() {
  const { mutate, status: statusAddPatient } = useAddPatient();
  const { mutate: mutateUpdate, status: statusUpdatePatient } = useUpdatePatient();
  const { patient, modeForm } = usePatientStore();

  const isCreateMode = modeForm === MODEFORMENUM.CREATE;

  const initialValues: Partial<IPatientReqDto> = isCreateMode
    ? {}
    : {
        name: patient?.name,
        identification: patient?.identification,
        phone: patient?.phone,
        address: patient?.address,
        age: patient?.age,
        contactPerson: patient?.contactPerson,
        contactPhone: patient?.contactPhone,
        birthday: patient?.birthday,
        typeSex: patient?.typeSex,
        civilStatus: patient?.civilStatus.id,
        avatar: undefined,
      };

  const {
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    submitForm: submitForm,
    errors,
    values,
  } = useFormik<Partial<IPatientReqDto>>({
    initialValues,
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    validationSchema: () => patientSchemaValidation(),
    onSubmit: (values) => {
      if (isCreateMode) {
        mutate({
          name: values.name!,
          identification: values.identification!,
          phone: values.phone!,
          address: values.address!,
          age: values.age!,
          contactPerson: values.contactPerson!,
          contactPhone: values.contactPhone!,
          birthday: values.birthday!,
          typeSex: values.typeSex!,
          civilStatus: values.civilStatus!,
        });
      } else{
        mutateUpdate({
          id: patient?.id!,
          ...values
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
    statusAddPatient,
    statusUpdatePatient,
  };
}
