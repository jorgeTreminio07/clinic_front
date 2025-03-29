import { Input, Button } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { useToggle } from "../../hooks/useToggle";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { sleep } from "../../../utils/sleep";
import { useLogin } from "../../querys/auth/auth.query";
import img from "../Auth/login.png";

export function LoginScreen() {
  // hooks
  const { status: loginStatus, mutate: handleLogin } = useLogin();
  const navigate = useNavigate();

  // stattes
  const [isVisible, toggleVisibility] = useToggle(false);
  const inputUserName = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);

  const handleLoginClick = () => {
    if (inputUserName.current && inputPassword.current) {
      handleLogin({
        email: inputUserName.current.value,
        password: inputPassword.current.value,
      });
    }
  };

  useEffect(() => {
    if (loginStatus === "success") {
      (async () => {
        await sleep(100);
        navigate("/");
      })();
    }
    console.log(loginStatus);
  }, [loginStatus]);

  const isPending = loginStatus === "pending";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="pr-4   w-full shadow-[0px_4px_40px_rgba(0,0,0,0.5)] rounded-lg  sm:w-1/2  flex items-center justify-center gap-6">
        <div className="w-full bg-gray-200 rounded-tl-lg rounded-bl-lg">
          <img
            src={img}
            alt="Imagen"
            className="w-80 h-80 object-cover " // Tamaño fijo de 20rem
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-6 w-full sm:w-3/4">
          <b>
            <center>
              <h2>¡Bienvenido, ingrese sus credenciales!</h2>
            </center>
          </b>

          <Input
            disabled={isPending}
            size="sm"
            label="Usuario"
            ref={inputUserName}
          />
          <Input
            disabled={isPending}
            size="sm"
            label="Contraseña"
            ref={inputPassword}
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
          <Button
            color="primary"
            fullWidth
            className="flex items-center justify-center"
            onClick={handleLoginClick}
            disabled={isPending}
            isLoading={isPending}
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
