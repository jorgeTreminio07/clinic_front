import * as Yup from "yup";
import { IPatientReqDto } from "../../../../Dto/Request/patient.req.dto";

export function patientSchemaValidation(): Yup.Schema<Partial<IPatientReqDto>> {
  return Yup.object().shape({
    name: Yup.string()
      .required("El nombre es requerido")
      .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras y espacios").max(50, "El nombre no puede ser mayor a 50 caracteres").min(16, "El nombre debe tener al menos 16 caracteres"), // No permite números ni caracteres especiales
    identification: Yup.string()
      .required("La identificación es requerida")
      .matches(/^[A-Z0-9-]+$/, "La identificación solo puede contener letras mayúsculas, números y guiones").max(16, "La identificación no puede ser mayor a 16 caracteres").min(13, "La identificación debe tener al menos 13 caracteres"), // Solo permite letras mayúsculas, números y guiones
    phone: Yup.string()
      .required("El numero de teléfono es requerido")
      .matches(/^[\d()+-\s]*$/, "El numero de teléfono solo puede contener números, el símbolo '+' y paréntesis '()'").max(15, "El numero de teléfono no puede ser mayor a 15 caracteres").min(13, "El numero de teléfono debe tener al menos 14 caracteres"), // Solo permite números, + y ()
    address: Yup.string().required("La dirección es requerida").max(110, "La dirección no puede ser mayor a 110 caracteres").min(10, "La dirección debe tener al menos 10 caracteres"),
    age: Yup.number().required("Seleccione una fecha de nacimiento").positive("La edad debe ser un número positivo") // Solo permite números positivos
      .integer("La edad debe ser un número entero").max(120, "La edad no puede ser mayor a 120"),
    contactPerson: Yup.string().required("La persona de contacto es requerida")
      .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre de la persona de contacto solo puede contener letras y espacios").max(50, "El nombre de la persona de contacto no puede ser mayor a 50 caracteres").min(16, "El nombre de la persona de contacto debe tener al menos 16 caracteres"), // No permite números ni caracteres especiales
    contactPhone: Yup.string()
      .required("El numero de contacto es requerido")
      .matches(/^[\d()+-\s]*$/, "El numero de contacto de contacto solo puede contener números, el símbolo '+' y paréntesis '()'").max(15, "El numero de contacto no puede ser mayor a 15 caracteres").min(13, "El numero de contacto debe tener al menos 14 caracteres"), // Solo permite números, + y ()
    birthday: Yup.string().required("La fecha de nacimiento es requerida"),
    typeSex: Yup.string().required("El sexo es requerido"),
    civilStatus: Yup.string().required("El estado civil es requerido"),
    // avatar: Yup.string().optional(),
  });
}
