/// <reference types="vite/client" />

// CSS module declarations for Vite
declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.postcss' {
  const content: string;
  export default content;
}
