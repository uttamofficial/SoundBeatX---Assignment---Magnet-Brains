declare namespace JSX {
  interface IntrinsicElements {
    // allow any HTML element without errors
    [elemName: string]: any;
  }
}

// Provide fallback module declarations for jsx-runtime if types are missing
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any): any;
  export function jsxs(type: any, props: any): any;
  export function jsxDEV(type: any, props: any): any;
}
