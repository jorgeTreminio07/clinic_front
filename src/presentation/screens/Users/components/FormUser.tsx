import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useGetAllRoles } from "../../../querys/rol/rol.query";
import { HiSelector } from "react-icons/hi";
import { useFormikUser } from "../hooks/useFormikUser";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/user.store";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { FaEye, FaEyeSlash, FaFileImage } from "react-icons/fa6";
import { useFilePicker } from "use-file-picker";
import { FileUtils } from "../../../../utils/file.utils";
import { useGetSubRol } from "../../Roles/querys/subrol.query";
import { useToggle } from "../../../hooks/useToggle";
import toast from "react-hot-toast";

export function FormUser() {
  const { openFilePicker, plainFiles, loading, clear } = useFilePicker({
    accept: ".png, .jpg, .jpeg",
    multiple: false,
  });

  const { data: dataRoles, status: statusGetRoles } = useGetSubRol();
  const [isVisible, toggleVisibility] = useToggle(false);

  const {
    errors,
    handleSubmit,
    setFieldValue,
    values,
    addUserStatus,
    updateUserStatus,
  } = useFormikUser();

  const { modeForm, toggleForm } = useUserStore();

  useEffect(() => {
    if (addUserStatus === "success" || updateUserStatus === "success") {
      toggleForm();
    }
  }, [addUserStatus, updateUserStatus]);

  useEffect(() => {
    if (plainFiles.length > 0) {
      (async () => {
        setFieldValue(
          "Avatar",
          await FileUtils.convertFileToBase64(plainFiles[0])
        );
        setFileName(plainFiles[0]?.name || "");
      })();
    }
  }, [plainFiles]);

  const isLoadingRoles = statusGetRoles === "pending";
  const isLoadingAddUser = addUserStatus === "pending";
  const isLoadingUpdateUser = updateUserStatus === "pending";

  const isCreateMode = modeForm === MODEFORMENUM.CREATE;

  const { Name: nameError, Email: emailError, Rol: rolError } = errors;
  const [passwordStrength, setPasswordStrength] = useState(0);

  const evaluatePasswordStrength = (password: string): number => {
    if (!password) return 0;

    let score = 1; // Empieza en 1 si hay al menos un carácter
    if (password.length >= 10) score += 1;
    if (password.match(/\d/)) score += 1;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]/)) score += 1;
    if (password.length >= 14) score += 1;

    return score;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFieldValue("Password", password);
    setPasswordStrength(evaluatePasswordStrength(password));
  };

  const handleSubmitNotDebile = () => {
    if (passwordStrength === 1 || passwordStrength === 2) {
      toast.error("La contraseña es poco segura.");
    } else {
      handleSubmit();
    }
  };

  const [fileName, setFileName] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <Input
        isRequired
        isInvalid={!!nameError}
        errorMessage={nameError}
        value={values.Name}
        onChange={(e) => setFieldValue("Name", e.target.value)}
        size="sm"
        label="Nombre"
        disabled={isLoadingAddUser || isLoadingUpdateUser}
      />

      {isCreateMode && (
        <Input
          isInvalid={!!emailError}
          errorMessage={emailError}
          value={values.Email}
          isRequired
          onChange={(e) => setFieldValue("Email", e.target.value)}
          size="sm"
          label="Correo"
          disabled={isLoadingAddUser}
        />
      )}

      <Select
        isInvalid={!!rolError}
        errorMessage={rolError}
        value={values.Rol ?? ""}
        label="Rol"
        disableSelectorIconRotation
        disabled={isLoadingRoles || isLoadingAddUser || isLoadingUpdateUser}
        isRequired
        selectorIcon={<HiSelector />}
        defaultSelectedKeys={[values.Rol ?? ""]}
        onChange={(e) => setFieldValue("Rol", e.target.value)}
      >
        {(dataRoles ?? []).map((roles) => (
          <SelectItem key={roles.id}>{roles.name}</SelectItem>
        ))}
      </Select>
      <Input
        isInvalid={!!errors.Password}
        errorMessage={errors.Password}
        value={values.Password}
        isRequired
        onChange={handlePasswordChange}
        size="sm"
        label="Contraseña"
        disabled={isLoadingAddUser}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
          >
            {isVisible ? (
              <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <FaEye className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
      />
      {/* Barra de progreso de seguridad de contraseña */}

      <div className="mt-2">
        <div className="h-2 w-full bg-gray-200 rounded-md overflow-hidden">
          <div
            className={`h-full transition-all duration-500 transform ${
              passwordStrength === 0
                ? "w-0 opacity-0"
                : passwordStrength === 1
                ? "w-1/4 bg-red-500 opacity-100"
                : passwordStrength === 2
                ? "w-1/2 bg-orange-400 opacity-100"
                : passwordStrength === 3
                ? "w-9/12 bg-blue-500 opacity-100"
                : "w-full bg-green-500 opacity-100"
            }`}
          />
        </div>
        {/* Texto de fortaleza de contraseña */}
        <p
          className={`text-sm font-medium mt-1 ${
            passwordStrength === 1
              ? "text-red-500"
              : passwordStrength === 2
              ? "text-orange-400"
              : passwordStrength === 3
              ? "text-blue-500"
              : passwordStrength === 4
              ? "text-green-500"
              : "hidden"
          }`}
        >
          {passwordStrength === 1
            ? "Débil"
            : passwordStrength === 2
            ? "Regular"
            : passwordStrength === 3
            ? "Buena"
            : passwordStrength === 4
            ? "Segura"
            : ""}
        </p>
      </div>

      <Button
        variant="flat"
        onPress={openFilePicker}
        // isLoading={loading}
        startContent={<FaFileImage />}
        color="primary"
        fullWidth
        // disabled={isLoadingAddProduct || isLoadingUpdateProduct}
      >
        {fileName ? fileName : "Avatar"}
      </Button>
      <div className="flex flex-row gap-4 justify-end items-center">
        <Button
          onClick={() => handleSubmitNotDebile()}
          isLoading={isLoadingAddUser || isLoadingUpdateUser}
          disabled={isLoadingRoles}
          color="primary"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
