import { Route, Routes } from "react-router-dom";
import { ReportsScreen } from "./ReportsScreen";


export default function ReportsRoutes() {
    return (
        <Routes>
          <Route index element={<ReportsScreen />} />
        </Routes>
      );
}