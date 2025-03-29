import * as Yup from "yup";
import { useUserStore } from "../store/user.store";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";

// Validation schema
export const userSchemaValidation = () => {
  const useUserState = useUserStore.getState();
  const isCreateMode = useUserState.modeForm === MODEFORMENUM.CREATE;

  return Yup.object().shape({
    Name: Yup.string().required("El nombre es requerido").matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/, "El nombre solo puede contener letras y espacios").max(35, "El nombre no puede ser mayor a 35 caracteres").min(4, "El nombre debe tener al menos 4 caracteres"), // No permite números ni caracteres especiales
    Rol: Yup.string().required("El Rol es requerido"),
    ...(isCreateMode && {
      Email: Yup.string()
        .email("Debe ser un correo valido")
        .required("El correo es requerido").max(80, "El correo no puede ser mayor a 80 caracteres").min(13, "El correo debe tener al menos 13 caracteres"),
        
        Password: Yup.string().required("La contraseña es requerida").max(30, "La contraseña no puede ser mayor a 30 caracteres"),
    }),
    
  });
};
