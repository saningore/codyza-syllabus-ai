# TypeScript setup notes

This is the TypeScript conversion of the Codyza Team 01 SyllabusAI starter.

- Use `.tsx` for React components and pages containing JSX.
- Use `.ts` for server routes, libraries, and tests.
- `tsconfig.json` enables strict type checking and the `@/*` import alias.
- `npm run typecheck` runs the TypeScript compiler without emitting files.
- Use Zod in `lib/schemas.ts` to validate Gemini JSON and API inputs at runtime.
- Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` to verify changes.
- The extract API route is deliberately a 501 placeholder. The project is not a completed AI app.

To run: copy `.env.example` to `.env.local`, configure Supabase keys, run `npm ci` then `npm run dev`.
