import { Navigate, Route, Routes } from "react-router-dom";
import { LoginScreen } from "./LoginScreen";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" />} />
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
}
