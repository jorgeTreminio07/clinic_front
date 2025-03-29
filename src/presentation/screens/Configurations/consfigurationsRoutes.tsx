import { Route, Routes } from "react-router-dom";
import { ConfigurationsScreen } from "./configurationsScreen";

export default function RolesRoutes() {
  return (
    <Routes>
      <Route index element={<ConfigurationsScreen />} />
    </Routes>
  );
}
