import { Route, Routes } from "react-router-dom";
import { RolesScreen } from "./RolesScreen";

export default function RolesRoutes() {
  return (
    <Routes>
      <Route index element={<RolesScreen />} />
    </Routes>
  );
}
