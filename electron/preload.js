const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
});

window.addEventListener("DOMContentLoaded", () => {
  console.log("Preload script loaded");
});