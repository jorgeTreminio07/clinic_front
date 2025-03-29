import * as Yup from "yup";
import { IConsultReqDto } from "../../../../Dto/Request/consult.req.dto";

export function consultSchemaValidation(): Yup.Schema<Partial<IConsultReqDto>> {
  return Yup.object().shape({
    patient: Yup.string().required("El paciente es requerido"),
    nextappointment: Yup.string().required("La proxima cita es requerida"),
    weight: Yup.number().required("El peso es requerido").positive("Debe ser un número positivo").max(881, "El peso no puede ser mayor a 881 Lb"),
    size: Yup.number().required("El tamaño es requerido").positive("Debe ser un número positivo").integer("Debe ser un número entero").max(200, "La estatura no puede ser mayor a 220 Cm").min(15, "La estatura debe ser mayor a 15 Cm"),
    diagnostic: Yup.string().required("El diagnostico es requerido").max(110, "El diagnostico no puede tener mas de 110 caracteres"),
    examComplementary: Yup.string().optional(),
    motive: Yup.string().required("El motivo es requerido").max(100, "El Motivo no puede tener mas de 100 caracteres"),
    antecedentPerson: Yup.string().required("El antecedente personal es requerido").max(300, "El antecedente personal no puede tener mas de 300 caracteres"),
    recipe: Yup.string().required("La receta es requerida").max(300, "La receta no puede tener mas de 300 caracteres"),
    antecedentFamily: Yup.string().optional().max(300, "El antecedente familiar no puede tener mas de 300 caracteres"),
    clinicalhistory: Yup.string().optional().max(300, "El Historial Clinico no puede tener mas de 300 caracteres"),
    bilogicalEvaluation: Yup.string().optional().max(300, "La Evaluacion Biológica no puede tener mas de 300 caracteres"),  
    psychologicalEvaluation: Yup.string().optional().max(300, "La Evaluacion Psicologica no puede tener mas de 300 caracteres"),
    socialEvaluation: Yup.string().optional().max(300, "La Evaluacion Social no puede tener mas de 300 caracteres"),
    functionalEvaluation: Yup.string().optional().max(300, "La Evaluacion Funcional no puede tener mas de 300 caracteres"),
    pulse: Yup.number().optional().positive("Debe ser un número positivo").integer("Debe ser un número entero").max(300, "El pulso no puede ser mayor a 300 Lpm"),
    oxygenSaturation: Yup.number().optional().positive("Debe ser un número positivo").integer("Debe ser un número entero").max(100, "La saturación de oxigeno no puede ser mayor a 100 %"),
    systolicPressure: Yup.number().optional().positive("Debe ser un número positivo").integer("Debe ser un número entero").max(200, "La presión sistólica no puede ser mayor a 200 mmHg"),
    diastolicPressure: Yup.number().optional().positive("Debe ser un número positivo").integer("Debe ser un número entero").max(140, "La presión diastólica no puede ser mayor a 140 mmHg"),
    imageExam: Yup.string().optional(),
});
}
