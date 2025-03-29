import { Button, Tooltip } from "@nextui-org/react";
import { BiRefresh } from "react-icons/bi";
interface Props {
  onClick: () => void;
}
export function RefreshButton({ onClick }: Props) {
  return (
    <Tooltip showArrow content="Refrescar">
      <Button onClick={onClick} isIconOnly >
        <BiRefresh />
      </Button>
    </Tooltip>
  );
}
