import { Navbar, Button, NavbarMenu } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { listItemSidebar } from "../../const/sidebar.const";
import { useCallback } from "react";
import { LogOutButton } from "./Buttons/LogOutButton";
import { ISidebarItem } from "../../interfaces/sidebar.interfaces";
import { useNavBarStorage } from "../storage/navbar.storage";
import { AccordionInput } from "../screens/Admin/components/AccordionInput";

export function NavBar() {
  const { showNavbar, toggleNavBar } = useNavBarStorage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = useCallback((item: ISidebarItem) => {
    if(!item.path) return
    
    navigate(item.path);
    toggleNavBar();
  }, []);

  return (
    <Navbar className="hidden" isMenuOpen={showNavbar} onMenuOpenChange={toggleNavBar}>
      <NavbarMenu>
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
              onClick={() => handleClick(item)}
            >
              {item.name}
            </Button>
          );
        })}
        <LogOutButton/>
      </NavbarMenu>
    </Navbar>
  );
}
