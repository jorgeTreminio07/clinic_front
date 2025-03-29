export class ConstData {
    public static readonly APP_NAME = `${import.meta.env.VITE_APP_NAME}`;
    public static readonly HasElectronMode = !!window.electronAPI;
}