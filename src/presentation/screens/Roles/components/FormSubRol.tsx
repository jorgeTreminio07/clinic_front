import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

// import { useFormikExam } from "../hooks/useFormikExam";
import { useEffect, useState } from "react";
import { useSubRolStore } from "../store/subrol.store";
import { useFormikSubRol } from "../hooks/useFormikSubRol";
import { useGetAllRoles } from "../../../querys/rol/rol.query";
import { HiSelector } from "react-icons/hi";
import { useGetPages } from "../querys/pages.query";
import { useAddPages } from "../querys/pages.query"; // Importamos el hook de la mutación
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { useGetSubRol } from "../querys/subrol.query";
import toast from "react-hot-toast";

export function FormSubRol() {
  const { modeForm, toggleForm: toggleFormSubRol } = useSubRolStore();

  const { data: dataSubRoles, status: statusGetSubRoles } = useGetSubRol();

  const { data: dataRoles, status: statusGetRoles } = useGetAllRoles();
  const isLoadingRoles = statusGetRoles === "pending";

  const { data: dataPage } = useGetPages();

  // Usamos el hook de la mutación para agregar las páginas seleccionadas
  const { mutate: addPagesMutation } = useAddPages();

  // Estado local para manejar las páginas seleccionadas
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    addSubRolStatus,
    updateSubRolStatus,
  } = useFormikSubRol();

  const { rolId: rolError, name: nameError } = errors;

  const isLoadingAddSubRol = addSubRolStatus === "pending";

  useEffect(() => {
    if (addSubRolStatus === "success" || updateSubRolStatus === "success") {
      toggleFormSubRol();
    }
  }, [addSubRolStatus, updateSubRolStatus]);

  // Esta función manejará el envío de las páginas seleccionadas
  const handleSubmitForm = () => {
    if (
      Array.isArray(dataSubRoles) &&
      dataSubRoles.some(
        (subrol) =>
          subrol.name === values.name &&
          (modeForm === MODEFORMENUM.CREATE || subrol.id !== values.id) // Excluye el subrol actual en edición
      )
    ) {
      toast.error("El subrol ya existe", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    const rolId = values.id ?? ""; // Si rolId es undefined, asignamos un valor vacío o cualquier valor predeterminado

    selectedPages.forEach((pageId) => {
      const data = {
        pageId, // El id de la página seleccionada
        rolId: rolId, // El rolId del formulario (ahora nunca será undefined)
      };

      addPagesMutation(data); // Enviar la mutación por cada página seleccionada
    });
    handleSubmit();
  };

  // Maneja el cambio de los checkboxes
  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedPages(checkedValues); // Actualiza el estado con los valores seleccionados
  };

  const isUpdateMode = modeForm === MODEFORMENUM.UPDATE;

  interface Rolee {
    id: string;
    name: string;
    rol: {
      id: string;
      name: string;
    };
    pages: {
      id: string;
      url: string;
    }[];
  }

  let actualName: Rolee | null = null;

  // Buscamos el sub-rol actual para actualizar el estado de los checkboxes
  if (dataSubRoles) {
    dataSubRoles.forEach((role) => {
      if (role.name === values.name) {
        actualName = role;
      }
    });
  }

  // Actualiza el estado de selectedPages al cargar la página
  useEffect(() => {
    if (isUpdateMode && actualName) {
      const selectedPagesIds = actualName.pages.map((page) => page.id);
      setSelectedPages(selectedPagesIds); // Actualizamos los checkboxes seleccionados
    }
  }, [isUpdateMode, actualName]);

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-row gap-2">
        <Autocomplete
          isLoading={isLoadingRoles}
          isRequired
          defaultItems={dataRoles ?? []}
          label="Roles"
          size="sm"
          isInvalid={!!rolError}
          errorMessage={rolError}
          selectedKey={values.rolId ?? ""}
          onSelectionChange={(e) => setFieldValue("rolId", e)}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
        <Input
          isRequired
          isInvalid={!!nameError}
          errorMessage={nameError}
          value={values.name}
          onChange={(e) => setFieldValue("name", e.target.value)}
          size="sm"
          label="Nombre Sub-Rol"
        />
      </div>

      {isUpdateMode && (
        <>
          <b>
            <h3>Permisos:</h3>
          </b>
          <CheckboxGroup
            value={selectedPages} // Vincula el estado local con los checkboxes
            onChange={handleCheckboxChange} // Actualiza el estado local cuando cambian los checkboxes
            label="Seleccione Rutas permitidas para el Sub-Rol"
            orientation="horizontal"
          >
            {dataPage &&
              dataPage.map((page) => {
                // Verificar si la URL está presente en actualName.pages
                const isChecked = selectedPages.includes(page.id); // Verificamos si el checkbox debe estar marcado

                return (
                  <Checkbox
                    key={page.id}
                    value={page.id}
                    checked={isChecked} // Marcar el checkbox si está presente en selectedPages
                  >
                    {page.url.charAt(0).toUpperCase() + page.url.slice(1)}{" "}
                    {/* Capitaliza el nombre */}
                  </Checkbox>
                );
              })}
          </CheckboxGroup>
        </>
      )}

      <div className="flex flex-row gap-4 justify-end items-center">
        <Button onPress={() => toggleFormSubRol()}>Cancelar</Button>
        <Button
          onClick={handleSubmitForm} // Usar la función de submit con bucle
          isLoading={isLoadingAddSubRol}
          color="primary"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
