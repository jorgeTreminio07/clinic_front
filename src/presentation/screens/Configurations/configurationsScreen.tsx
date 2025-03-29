import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CiCamera } from "react-icons/ci";
import { FaSave } from "react-icons/fa";
import { BaseScreen } from "../BaseScreen";
import { Button } from "@nextui-org/react";

export const ConfigurationsScreen = () => {
  const [clinica, setClinica] = useState({
    nombre: "",
    telefono: "",
    horario: "",
    direccion: "",
    codigo: "",
    imagen: null as string | ArrayBuffer | null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nombre: false,
    telefono: false,
    horario: false,
    direccion: false,
    codigo: false,
  });

  const [isSaved, setIsSaved] = useState(false); // Flag para indicar si los datos se han guardado

  // Cargar los datos del localStorage cuando el componente se monte
  useEffect(() => {
    const storedClinicaData = localStorage.getItem("clinicaData");
    if (storedClinicaData) {
      setClinica(JSON.parse(storedClinicaData)); // Rellenamos el estado con los datos del localStorage
    }
  }, []);

  // Renderizar después de que los datos se guarden
  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => {
        // Al guardar los datos, se actualizará el estado y se hará una nueva renderización
        setIsSaved(false); // Restablecer el estado a falso después de la actualización
      }, 3000);
      return () => clearTimeout(timer); // Limpiar el timeout en caso de que el componente se desmonte
    }
  }, [isSaved]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClinica((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = event.target?.result ?? null;
        setClinica((prev) => ({ ...prev, imagen: image }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validación de campos requeridos
    const newErrors = {
      nombre: !clinica.nombre,
      telefono: !clinica.telefono,
      horario: !clinica.horario,
      direccion: !clinica.direccion,
      codigo: !clinica.codigo,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) {
      toast.error("Por favor, complete todos los campos requeridos", {
        position: "top-right",
      });
      return;
    }

    setLoading(true); // Activar animación de carga
    setTimeout(() => {
      localStorage.setItem("clinicaData", JSON.stringify(clinica));
      toast.success("Datos guardados Correctamente", {
        position: "top-right",
      });
      setIsSaved(true); // Indicar que los datos han sido guardados correctamente
      setLoading(false); // Desactivar animación después de 3 segundos
    }, 3000); // 3 segundos de animación antes de guardar los datos
  };

  return (
    <>
      <BaseScreen
        titlePage="Datos Clínica"
        actions={
          <Button
            onClick={handleSave}
            startContent={<FaSave />}
            color="primary"
            disabled={loading} // Deshabilitar el botón mientras está cargando
            className={`save-button ${loading ? "loading" : ""}`} // Añadir clase de animación
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        }
      >
        <>
          <div className="max-w-xl mx-auto p-6">
            {/* Contenedor de imagen y texto */}
            <div className="flex items-center mb-6">
              <div
                className="relative inline-block cursor-pointer mr-4 group"
                onClick={() => document.getElementById("imagenInput")?.click()}
              >
                {clinica.imagen ? (
                  <img
                    src={clinica.imagen as string}
                    alt="Imagen de la clínica"
                    className="w-24 h-24 rounded-full object-cover transition-all duration-300 ease-in-out group-hover:grayscale group-hover:brightness-50"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-full group-hover:grayscale group-hover:brightness-50">
                    <CiCamera className="text-3xl text-white transition-all duration-300 ease-in-out group-hover:text-gray-900" />
                  </div>
                )}
              </div>
              <span className="text-xl font-medium">Logo Clínica</span>
            </div>

            <input
              type="file"
              id="imagenInput"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }} // Ocultar el input real
            />

            {/* Formulario */}
            <div className="space-y-4">
              {/* Fila de nombre y teléfono */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="Codigo Clínica"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Código clínica
                  </label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={clinica.codigo}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.codigo ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre clínica
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={clinica.nombre}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Número de teléfono
                  </label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={clinica.telefono}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.telefono ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>

              {/* Fila de dirección y horario */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="direccion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={clinica.direccion}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.direccion ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="horario"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Horario de atención
                  </label>
                  <input
                    type="text"
                    id="horario"
                    name="horario"
                    value={clinica.horario}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.horario ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </BaseScreen>
    </>
  );
};
