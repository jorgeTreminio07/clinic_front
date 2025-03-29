import {
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useGetMe } from "../querys/auth/auth.query";
import { LogOutButton } from "./Buttons/LogOutButton";

export function Me() {
  const { data: dataMe } = useGetMe();

  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <div className="flex flex-row items-center select-none cursor-pointer bg-white shadow-sm rounded-lg px-2 py-1 gap-1">
          <Image
            isBlurred
            src={dataMe?.avatar?.compactUrl}
            className="rounded-full w-8 aspect-square"
          />
          <div className="w-2 sm:block hidden"></div>
          <h1 className="text-medium hidden md:block">{dataMe?.name}</h1>
        </div>
      </PopoverTrigger>
      <PopoverContent className="rounded-md">
        <LogOutButton />
      </PopoverContent>
    </Popover>
  );
}
