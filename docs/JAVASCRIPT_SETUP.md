# JavaScript setup notes

This is the JavaScript/JSX conversion of the Codyza Team 01 SyllabusAI starter.

- Use `.jsx` for React components and pages containing JSX.
- Use `.js` for server routes, libraries, and tests.
- `jsconfig.json` replaces `tsconfig.json`.
- No TypeScript compiler or `npm run typecheck` is required.
- Use Zod in `lib/schemas.js` to validate Gemini JSON and API inputs at runtime.
- `npm run lint`, `npm test`, and `npm run build` remain the verification commands.
- The extract API route is deliberately a 501 placeholder. The project is not a completed AI app.

To run: copy `.env.example` to `.env.local`, configure Supabase keys, run `npm install` then `npm run dev`.
