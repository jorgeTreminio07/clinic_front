import * as Yup from "yup";

import { ISubRolReqDto } from "../../../../Dto/Request/subrol.req.dto";

export function subRolSchemaValidation(): Yup.Schema<Partial<ISubRolReqDto>> {
  return Yup.object().shape({
    rolId: Yup.string().required("El Rol es requerido"),
    name: Yup.string().required("El Nombre es requerido").matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/, "El nombre solo puede contener letras y espacios").max(35, "El nombre no puede ser mayor a 35 caracteres").min(3, "El nombre debe tener al menos 3 caracteres"),
  });
}