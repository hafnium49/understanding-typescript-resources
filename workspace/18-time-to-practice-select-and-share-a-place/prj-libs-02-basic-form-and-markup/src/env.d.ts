// Ambient augmentation for build-time environment variables.
//
// We do not use Node.js at runtime (this is a browser app), but at
// BUILD time the dotenv-webpack plugin replaces every reference to
// `process.env.GOOGLE_API_KEY` with a literal string from the
// workspace-root .env file.
//
// @types/node declares `process.env` as Record<string, string | undefined>.
// This declaration MERGES with that existing type and narrows the one
// key we care about to a plain string — so downstream code can drop
// the non-null assertion (!) and enjoy stricter typing.

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_API_KEY: string;
  }
}
