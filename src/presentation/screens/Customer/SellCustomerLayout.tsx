import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Me } from "../../components/Me";
import { Button, Divider } from "@nextui-org/react";
import { useNavBarStorage } from "../../storage/navbar.storage";
import { Suspense, useEffect, useState } from "react";
import { listItemSidebar } from "../../../const/sidebar.const";
import { AccordionInput } from "../Admin/components/AccordionInput";
import { LogOutButton } from "../../components/Buttons/LogOutButton";
import { IoMenu } from "react-icons/io5";
import { NavBar } from "../../components/NavBar";
import { LoadingScreen } from "../LoadingScreen";

export function SellCustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const toggleNavbar = useNavBarStorage((state) => state.toggleNavBar);

  // Estado para la clínica
  const [clinica, setClinica] = useState({
    nombre: "",
    imagen: null as string | ArrayBuffer | null,
  });

  // Cargar los datos de la clínica desde localStorage
  useEffect(() => {
    const storedClinicaData = localStorage.getItem("clinicaData");
    if (storedClinicaData) {
      setClinica(JSON.parse(storedClinicaData));
    }
  }, []);
  return (
    <>
      <div className="w-full h-screen flex flex-row">
        {/* sidebar */}
        <div className="w-1/5 min-w-[230px] hidden md:flex md:flex-col md:justify-between h-full bg-gray-100 px-4">
          {/* header */}
          <div className="h-14 flex flex-row items-center">
            {/* Mostrar la imagen y el nombre de la clínica */}
            {clinica.imagen ? (
              <img
                src={clinica.imagen as string}
                alt="Imagen de la clínica"
                className="w-10 h-10 rounded-full object-cover mr-4" // Imagen redondeada
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div> // Imagen predeterminada si no hay imagen
            )}

            <div className="flex flex-col">
              <b>
                <h1 className="">{clinica.nombre || "Nombre de la clínica"}</h1>
              </b>
              <p className="text-sm text-gray-600 mt-0">Clínica</p>
            </div>
          </div>

          <Divider className="mb-3" />

          <div className="flex flex-col gap-3">
            {listItemSidebar.map((item) => {
              if (item.children) {
                const isActive = (item.children ?? []).some((e) =>
                  location.pathname.includes(e.key)
                );
                return (
                  <AccordionInput
                    parentPath={item.path}
                    key={item.key}
                    icon={item.icon}
                    isActive={isActive}
                    name={item.name}
                    children={item.children}
                  />
                );
              }

              const isActive = location.pathname.includes(item.key);

              return (
                <Button
                  key={item.key}
                  startContent={
                    <div className='text-small ${isActive ? "bg-gray-300" : ""}0'>
                      {item.icon}
                    </div>
                  }
                  color={isActive ? "primary" : "default"}
                  variant={isActive ? "solid" : "flat"}
                  radius="sm"
                  size="md"
                  fullWidth
                  className='flex justify-start ${isActive ? "bg-gray-300" : ""}'
                  onClick={() => {
                    if (!isActive) navigate(item.path!);
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>

          <div className="flex-grow"></div>

          <div className="mb-5 flex flex-col gap-2">
            <LogOutButton />
          </div>
        </div>
        {/* home */}
        <div className="flex-1 flex flex-col">
          <div className="w-full h-14 flex items-center justify-between sm:justify-end px-4">
            <Button
              onClick={() => toggleNavbar()}
              isIconOnly
              variant="flat"
              className="sm:hidden mr-2 flex items-center justify-center"
            >
              <IoMenu />
            </Button>
            <Me />
          </div>
          <Divider className="ml-1 w-[99%]" />
          <div className="flex-1 overflow-auto">
            <Suspense fallback={<LoadingScreen message="Cargando Sección" />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
      <NavBar />
    </>
  );
}
