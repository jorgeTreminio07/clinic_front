import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;

const createWindow = () => {
  const isDev = process.env.NODE_ENV === "development";


  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Opcional
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: isDev,
    },
  });

  const url = isDev
    ? "http://localhost:5173" // Puerto por defecto de Vite
    : `file://${path.join(__dirname, "dist/index.html")}`;

  mainWindow.loadURL(url);
};

// Manejo del canal IPC para obtener la versión de la app
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
