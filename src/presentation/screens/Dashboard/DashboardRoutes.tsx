import { Route, Routes } from "react-router-dom";
import { DashboardScreen } from "./DashboardScreen";

export default function DashboardRoutes() {
    return (
        <Routes>
          <Route index element={<DashboardScreen />} />
        </Routes>
      );
}