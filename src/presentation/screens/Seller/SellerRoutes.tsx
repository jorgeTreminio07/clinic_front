import { Routes, Route, Navigate } from "react-router-dom";
import { ShellSellerLayout } from "./ShellSellerLayout";
import { lazy } from "react";

const DashboardRoutesLazy = lazy(() => import("../Dashboard/DashboardRoutes"));
const FilesRoutesLazy = lazy(() => import("../Files/FilesRoutes"));
const UserScreenLazy = lazy(() => import("../Users/UserScreen"));
const ReportsRoutesLazy = lazy(() => import("../Reports/ReportsRoutes"));
const BackupsScreenLazy = lazy(() => import("../Backups/BackupScreen"));
const NotFoundScreenLazy = lazy(() => import("../NotFoundScreen"));
const RolesRoutesLazy = lazy(() => import("../Roles/RolesRoutes"));
const ConfiguracionesRoutesLazy = lazy(
  () => import("../Configurations/consfigurationsRoutes")
);

export default function SellerRoutes() {
  return (
    <Routes>
      <Route element={<ShellSellerLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardRoutesLazy />} />
        <Route path="files/*" element={<FilesRoutesLazy />} />
        <Route path="users" element={<UserScreenLazy />} />
        <Route path="reports" element={<ReportsRoutesLazy />} />
        <Route path="roles" element={<RolesRoutesLazy />} />

        <Route path="backups" element={<BackupsScreenLazy />} />
        <Route path="configuraciones" element={<ConfiguracionesRoutesLazy />} />
        <Route path="*" element={<NotFoundScreenLazy />} />
      </Route>
    </Routes>
  );
}
