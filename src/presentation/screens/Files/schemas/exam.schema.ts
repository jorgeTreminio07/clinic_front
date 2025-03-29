import * as Yup from "yup";
import { IExamReqDto } from "../../../../Dto/Request/exam.req.dto";

export function examSchemaValidation(): Yup.Schema<Partial<IExamReqDto>> {
  return Yup.object().shape({
    group: Yup.string().required("El grupo es requerido"),
    name: Yup.string().required("El nombre es requerido").max(35, "El nombre no puede ser mayor a 35 caracteres").min(3, "El nombre debe tener al menos 3 caracteres"),
  });
}
