import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { LoadingScreen } from "./presentation/screens/LoadingScreen";
import ShellRoutes from "./presentation/screens/Shell/ShellRoutes";

const AuthRoutesLazy = lazy(
  () => import("./presentation/screens/Auth/AuthRoutes")
);

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/*" element={<ShellRoutes />} />
        <Route path="auth/*" element={<AuthRoutesLazy />} />
      </Routes>
    </Suspense>
  );
}

export default App;
