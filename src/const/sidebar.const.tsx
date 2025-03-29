import { ISidebarItem } from "../interfaces/sidebar.interfaces";
import { MdBackup, MdDashboard } from "react-icons/md";
import { FaUserGear, FaUsersGear } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { VscFileSubmodule } from "react-icons/vsc";
import { GrConfigure } from "react-icons/gr";

export const listItemSidebar: ISidebarItem[] = [
  {
    name: "Dashboard",
    key: "dashboard",
    path: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    name: "Expedientes",
    key: "files",
    path: "/files",
    icon: <VscFileSubmodule />,
  },

  {
    name: "Usuarios",
    key: "users",
    path: "/users",
    icon: <FaUsersGear />,
  },
  {
    name: "Roles",
    key: "roles",
    path: "/roles",
    icon: <FaUserGear />,
  },
  {
    name: "Reportes",
    key: "reports",
    path: "/reports",
    icon: <IoDocumentText />,
  },
  {
    name: "Copias de seguridad",
    key: "backups",
    path: "/backups",
    icon: <MdBackup />,
  },
  {
    name: "Configuraciones",
    key: "configuraciones",
    path: "/configuraciones",
    icon: <GrConfigure />,
  },
];
