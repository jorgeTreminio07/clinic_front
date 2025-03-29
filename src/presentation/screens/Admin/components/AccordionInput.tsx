import { Button } from "@nextui-org/react";
import { useToggle } from "../../../hooks/useToggle";
import { ISidebarItem } from "../../../../interfaces/sidebar.interfaces";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface IProps {
  icon: JSX.Element;
  isActive: boolean;
  name: string;
  parentPath?: string;
  children?: ISidebarItem[];
}
export function AccordionInput({
  name,
  icon,
  parentPath,
  isActive,
  children,
}: IProps) {
  const [show, handleToggle] = useToggle();
  const navigate = useNavigate();
  return (
    <>
      <Button
        startContent={
          <div className='text-small ${isActive ? "bg-gray-300" : ""}0'>
            {icon}
          </div>
        }
        onClick={handleToggle}
        color={isActive ? "primary" : "default"}
        variant={isActive ? "solid" : "flat"}
        radius="sm"
        size="md"
        fullWidth
        className='flex justify-start ${isActive ? "bg-gray-300" : ""}'
        endContent={show ? <IoIosArrowDown /> : <IoIosArrowForward />}
      >
        {name}
        <div className="flex-grow"></div>
      </Button>
      {show && (
        <div className="pl-2 flex flex-col gap-4">
          {(children ?? [])?.map((e) => {
            const isActive = location.pathname.includes(e.key);

            return (
              <Button
                key={e.key}
                startContent={
                  <div className='text-small ${isActive ? "bg-gray-300" : ""}0'>
                    {e.icon}
                  </div>
                }
                color={isActive ? "primary" : "default"}
                variant={isActive ? "bordered" : "flat"}
                radius="sm"
                size="md"
                fullWidth
                className='flex justify-start ${isActive ? "bg-gray-300" : ""}'
                onClick={() => navigate(parentPath + e.path!)}
              >
                {e.name}
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
}
