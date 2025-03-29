import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/query.config.ts";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <div className="w-screen h-screen bg-gray-50 ">
            <App />
            <Toaster />
          </div>
        </QueryClientProvider>
      </BrowserRouter>
    </NextUIProvider>
  </StrictMode>
);
