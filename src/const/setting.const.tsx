import { ISidebarItem } from "../interfaces/sidebar.interfaces";
import { BsShop } from "react-icons/bs";

export const ListItemSetting: ISidebarItem[] = [
  {
    name: "Tienda",
    key: "shop",
    path: "/shop",
    icon: <BsShop />,
  },
];
