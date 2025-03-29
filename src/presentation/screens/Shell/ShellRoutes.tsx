import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../storage/auth.storage";
import { lazy } from "react";
import { RolEnum } from "../../../enum/rol/rol.enum";
import { useGetMe } from "../../querys/auth/auth.query";
import { LoadingScreen } from "../LoadingScreen";
import { LogOutButton } from "../../components/Buttons/LogOutButton";

const AdminRoutesLazy = lazy(() => import("../Admin/AdminRoutes"));
const SellerRoutesLazy = lazy(() => import("../Seller/SellerRoutes"));
const CustomerRoutesLazy = lazy(() => import("../Customer/CustomerRoutes"));

export default function ShellRoutes() {
  const { isAuth } = useAuthStore(); // Obtener estado y funciones del store
  const { data: dataMe } = useGetMe(); // Llamada a la API para obtener datos del usuario
  const location = useLocation();
  const rutaActual = location.pathname.split("/");
  // Función para verificar si una cadena es un UUID (parámetro)
  const esParametro = (cadena: string) => {
    // Expresión regular para validar un UUID
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(cadena);
  };

  // Obtener la última parte de la ruta que no sea un parámetro
  let ultimaRuta = rutaActual
    .filter((part) => part !== "" && !esParametro(part)) // Filtrar partes vacías y parámetros
    .pop(); // O

  const isAuthenticated = isAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated) {
    const rolid = dataMe?.rol?.rol?.id;

    if (dataMe?.routes && ultimaRuta && ultimaRuta !== "") {
      if (!dataMe.routes.includes(ultimaRuta)) {
        return (
          <>
            <LoadingScreen
              message="No tienes permiso para acceder a esta ruta"
              showBackButton
              showLogOut
            />
          </>
        );
      }
    }

    if (rolid === RolEnum.ADMIN) {
      return <AdminRoutesLazy />;
    } else if (rolid === RolEnum.RECEPTION) {
      return <SellerRoutesLazy />;
    } else if (rolid === RolEnum.CUSTOMER) {
      return <CustomerRoutesLazy />;
    }
  }

  return <LoadingScreen />;
}
