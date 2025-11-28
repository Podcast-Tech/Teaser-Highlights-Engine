// Augment the NodeJS namespace to include API_KEY in ProcessEnv
// This ensures TypeScript recognizes process.env.API_KEY without conflicting with existing process declarations
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
