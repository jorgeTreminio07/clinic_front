import { AssetsConst } from "../../const/assets.const";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div className="w-1/2 h-1/2 aspect-square">
        {/* <Lottie
          options={{
            path: AssetsConst.NotFoundAnimation,
          }}
        /> */}
      </div>
      <h1 className="text-2xl font-semibold text-center text-gray-500">
        Página no encontrada
      </h1>
      <Button
        onClick={() => navigate("/")}
        variant="faded"
        size="sm"
        className="w-1/4"
      >
        Home
      </Button>
    </div>
  );
}
