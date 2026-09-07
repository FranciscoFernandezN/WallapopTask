# Listing Beautifier - Development Guide

## Project Structure

```
code/
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment variable template
├── shared/               # Shared types and error codes between frontend and backend
│   ├── errors/codes.ts   # Error code constants and ErrorCode type
│   └── types/beautify.ts # Request/response types for the beautifier API
├── backend/              # Express.js API server (Node.js + TypeScript)
│   ├── src/
│   │   ├── app.ts        # Express app entry point
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # Route definitions
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Environment, errors
│   │   └── mocks/        # Mock AI provider (scenarios + provider logic)
│   └── tests/            # Jest tests
└── frontend/
    └── listing-beautifier/  # React + Vite SPA
        ├── src/
        │   ├── components/  # Reusable UI components (header, loading overlay, error popup)
        │   ├── screens/     # Page-level components (beautifyscreen)
        │   ├── utils/       # API client, env, errors, i18n
        │   └── locales/     # Translation files (en.json, es.json)
        └── tests/           # Vitest tests
```

## Shared Code Between Frontend and Backend

The `shared/` directory contains code imported by both frontend and backend via deep relative paths (e.g., `../../../shared/errors/codes.ts`). It is NOT a published package. It has its own `package.json` with `{ "type": "module" }`.

### Adding a new error code

1. Add the code to `shared/errors/codes.ts` in the `ErrorCodes` const object.
2. The `ErrorCode` type is automatically derived from the object values.
3. Backend: throw `new AppError(ErrorCodes.YOUR_CODE, 'message')`.
4. Frontend: add a new class extending `BackendError` in `frontend/.../utils/errors.ts` and add a case in `mapErrorCode()`.

### Adding a new shared type

1. Add the type/interface to `shared/types/`.
2. Import from both backend and frontend using relative paths with `.ts` extension.
3. Use `import type { ... }` for type-only imports (enforced by `verbatimModuleSyntax`).

## Internationalization (i18n)

All user-facing text must be internationalized. At minimum, Spanish (`es`) and English (`en`) are supported.

### Adding a new translatable string

1. Add the key to `frontend/listing-beautifier/src/locales/en.json` with the English text.
2. Add the same key to `frontend/listing-beautifier/src/locales/es.json` with the Spanish text.
3. Use the key in components via `t('namespace.key')` from `useTranslation()`.
4. For error messages constructed outside React components, use `i18next.t('namespace.key')` directly.

### Key structure

Keys are nested objects with dot-notation access. Top-level namespaces: `errors`, `header`, `beautify`, `loading`. Use camelCase within each level. Interpolation uses `{variable_name}` syntax.

## Retries and Model Provider Rotation

The backend supports multiple AI model providers with automatic fallback.

### How it works

1. `AI_MODEL_PROVIDER` env var is a comma-separated list of models (e.g., `openai/gpt-4o,anthropic/claude-3.5-sonnet`).
2. Parsed into `env.aiModelProviders` array at startup.
3. `beautifySellerDetails()` iterates through providers in order.
4. For each provider, it retries up to `AI_MAX_RETRIES` times.
5. A retry attempt is considered failed if:
   - The AI model throws an error (network, timeout, parse failure).
   - The response doesn't follow the expected 3-line format.
   - The title doesn't contain at least `MIN_WORDS_IN_TITLE` words from the original input.
6. If all retries for a provider fail, it moves to the next provider.
7. If all providers are exhausted, throws `AppError` with `BEAUTIFIER_MAX_RETRIES` code.

### Mock provider

Set `AI_MODEL_PROVIDER=MOCK` to use the mock provider instead of a real AI API. The mock:
- Matches user input against keywords defined in `backend/src/mocks/scenarios.ts`.
- Returns a valid response 80% of the time and an invalid response 20% of the time.
- If no keyword matches, returns a generic valid response.
- Goes through the same retry logic as real providers.

### Timeout

Each AI model call is wrapped in a `Promise.race` against a timeout (`AI_MODEL_TIMEOUT` ms). If the model doesn't respond in time, the attempt fails and counts toward retries.

## Visual Style

The frontend uses Wallapop's brand identity:

- **Primary color:** `#13C1AC` (Wallapop green) with hover variant `#0fa896`.
- **Fonts:** Custom `WallieChunky` (headings, titles) and `WallieFit` (body text, inputs) loaded via `@font-face` from `public/fonts/`.
- **Layout:** Centered container with max-width 800px, responsive at 768px breakpoint.
- **Components:** Plain CSS only (no CSS modules, no Tailwind, no preprocessor). CSS variables defined in `App.css`.
- **Loading overlay:** Fixed overlay with backdrop blur, rotating through 3 spinner types from `react-loader-spinner` every 2 seconds.
- **Error popup:** Fixed overlay with semi-transparent background, click-outside-to-close.

## JSDoc

All exported functions, classes, interfaces, and types must have JSDoc comments. This is mandatory.

### Format

```typescript
/**
 * Brief description of what this does.
 *
 * @param paramName - Description of the parameter.
 * @returns Description of the return value.
 * @throws {ErrorType} When this error occurs.
 */
```

For interfaces:
```typescript
/** Description of the interface. */
export interface Foo {
  /** Description of the property. */
  bar: string;
}
```

## Testing

### Backend (Jest)

- Config: `backend/jest.config.js`, setup: `backend/jest.setup.js` (loads `.env`).
- Tests live in `backend/tests/` matching `**/*.test.ts`.
- Run: `npm test` from `backend/`.
- Use `@jest/globals` imports: `import { describe, expect, test, jest, beforeEach } from '@jest/globals'`.
- Mock external dependencies with `jest.mock()`. Use `require()` inside test bodies to access mock internals.
- Use `--forceExit` flag if tests hang due to open handles (e.g., timeout timers).

### Frontend (Vitest)

- Config: `frontend/listing-beautifier/vitest.config.ts`, setup: `frontend/listing-beautifier/src/setup.ts`.
- Tests live in `frontend/listing-beautifier/tests/`.
- Run: `npm test` from `frontend/listing-beautifier/`.
- Use `vitest` imports: `import { describe, expect, test, vi, beforeEach } from 'vitest'`.
- Use `@testing-library/react` for component tests (`render`, `screen`, `fireEvent`, `waitFor`).
- Mock API calls with `vi.mock()`, mock spinner components to avoid rendering issues.
- Always call `i18n.changeLanguage('en')` in `beforeEach` for deterministic translations.

### What to test

- **Backend services:** Pure functions (`parseListingResponse`, `titleContainsMinWords`), retry logic, error codes, mock provider behavior.
- **Frontend components:** Rendering, user interactions (input, button clicks), disabled states, error display, tooltip hints.
- **Shared code:** Error code values, type contracts.

## Code Conventions

### TypeScript

- **Strict mode** enabled in all tsconfigs.
- **`erasableSyntaxOnly`** enabled: use explicit property declarations instead of parameter properties (e.g., declare `public readonly code: ErrorCode` as a class field, not in the constructor signature).
- **`verbatimModuleSyntax`** enabled: use `import type { ... }` for type-only imports.
- **Relative imports** must include `.ts`/`.tsx` extension (enabled by `rewriteRelativeImportExtensions` in backend, `allowImportingTsExtensions` in frontend).

### Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `BeautifyScreen` |
| Functions | camelCase | `beautifySellerDetails` |
| Types/Interfaces | PascalCase | `ParsedListing` |
| Constants | UPPER_SNAKE_CASE | `MIN_WORDS_IN_TITLE` |
| Error classes | PascalCase + Error suffix | `AppError`, `BackendError` |
| CSS classes | kebab-case | `.input-field` |
| Files | camelCase | `mockProvider.ts` |
| Directories | lowercase | `utils/`, `mocks/` |

### Style

- Single quotes for strings.
- Semicolons required.
- `const` preferred; `let` only for mutable loop counters.
- Arrow functions for callbacks and inner component functions.
- Regular function declarations for top-level exports and React components.
- Named exports for components and service functions; `export default` for app entry points and router.
- Backend uses 4-space indentation in services and mocks, 2-space in controllers/routes/utils.
- Frontend uses 2-space indentation throughout.

### Error handling

- Backend throws `AppError` with a code from `shared/errors/codes.ts`.
- Controller catches `AppError` and returns `{ error: string, code: string }` with HTTP 500.
- Unknown errors return `INTERNAL_ERROR` code.
- Frontend `api.ts` maps error codes to typed error classes via `mapErrorCode()`.
- Frontend components check `instanceof BackendError` to display localized error messages.

## Verification Commands

Before considering any task complete, run:

```bash
# Backend
cd backend
npx tsc --noEmit
npx jest --no-coverage --forceExit

# Frontend
cd frontend/listing-beautifier
npx tsc -b
npm run lint
npm test
```
