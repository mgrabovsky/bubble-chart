/// <reference types="vite/client" />

declare module '*.csv' {
    const path: string;
    export default path;
}