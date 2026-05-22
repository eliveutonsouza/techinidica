// Loose typing for cross-module references the prototype pins to `window`.
declare global {
  interface Window {
    [key: string]: any;
  }
}
export {};
