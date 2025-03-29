export {};

declare global {
  interface Window {
    electronAPI: {
      [key: string]: (...args: any[]) => Promise<any>;
    };
  }
}
