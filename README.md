# Listing Beautifier

An AI-powered tool that transforms rough product descriptions into polished Wallapop listings with catchy titles, relevant tags, and realistic price ranges.

## Technology Stack

The technologies used with its major version:

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Typescript 6 |
| Backend | NPM 11, Node 24, Express 5, TypeScript 6 |

## System Design

![Design Diagram](./docs/Design%20diagram.png)

The backend implements a **multi-provider fallback strategy**: it tries each configured AI model sequentially, retrying up to `AI_MAX_RETRIES` times per provider. A validation step ensures the generated title retains at least 2 meaningful words from the original description.

## Running the Project

### Prerequisites

- Node.js 24+
- NPM 11+
- An [OpenRouter](https://openrouter.ai/) API key (or use mock mode)

### Setup

```bash
# Clone and copy environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key with its available models:
# AI_MODEL_PROVIDER=model1,model2,model3
# AI_MODEL_PROVIDER_API_KEY=YOUR_OPENROUTER_API_KEY

# Or use the mocked version instead:
# AI_MODEL_PROVIDER=MOCK
# AI_MODEL_PROVIDER_API_KEY=MOCK
```

See [OpenRouter Models](https://openrouter.ai/models) for available models and their capabilities.

### Start Backend

```bash
./start-backend.sh
# Or manually:
cd backend && npm install && node --env-file=../.env src/app.ts
```

Backend runs on `http://localhost:3000` by default.

### Start Frontend

```bash
./start-frontend.sh
# Or manually:
cd frontend/listing-beautifier && npm install && npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Using Mock Mode

The mock provider:
- Matches input against predefined keywords (e.g., "jacket", "iphone", "bike") and scenarios (see `backend/src/providers/mockProvider.ts` for examples)
- Returns 80% valid responses and 20% invalid responses (to test retry logic)
- Falls back to a generic response for unmatched inputs

You can mix mock with real providers: `AI_MODEL_PROVIDER=MOCK,openai/gpt-4o`

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

| Test File | Description |
|-----------|-------------|
| `beautifier.unit.test.ts` | Unit tests for parsing and validation logic |
| `beautifier.test.ts` | Integration tests with 15 real product scenarios |
| `mockProvider.test.ts` | Tests for the mock provider behavior |

Tests the most critical parts of the backend using Jest and Babel as the test runner and transpiler. I found them useful for checking that the backend works as expected, not only with unit tests, checking the retry, fallback and parsing behavior, but also with integration tests, allowing to check the performance of the AI models and the prompt.

### Frontend Tests

```bash
cd frontend/listing-beautifier
npm test
```

Tests the UI components and user flows using Vitest. I found them useful for checking that the frontend works as expected as it only has one screen and it should be up and running.

## Examples

**Input:**
```
iPhone 12 Pro Max 256GB, Pacific Blue, unlocked, includes original box and charger, minor scratches
```

**Output:**
```json
{
  "title": "iPhone 12 Pro Max 256GB - Like New",
  "tags": ["iphone-12", "apple", "smartphone", "256gb", "pro-max"],
  "priceRange": [300, 600]
}
```

**Input:**
```
Mountain bike Trek Marlin 7, 29 inch wheels, hydraulic disc brakes, 21 speeds, barely used
```

**Output:**
```json
{
  "title": "Trek Marlin 7 Mountain Bike 29\"",
  "tags": ["mountain-bike", "trek", "cycling", "29inch", "sports"],
  "priceRange": [400, 800]
}
```

## Time Investment & Future Improvements

This project was developed in approximately **8 hours**, covering:
- Full-stack TypeScript setup with shared types and errors
- AI integration with multi-provider fallback and retry logic
- Mock provider for offline testing
- Frontend UI with internationalization support
- Basic project structure and documentation, but focusing on maintainability and scalability
- Test suites (unit + integration)

### Next Steps

- **Docker containerization**: Package frontend and backend into containers for easy deployment
- **Price range improvement**: Implement web scraping of second-hand marketplaces (e.g., eBay, Vinted, Wallapop) to gather real market data and pass it as context to the AI model for more accurate pricing
- **Logging**: Implement logging to track user interactions, system performance and uncatched errors
- **Structural improvements**: Refactor code and project structure in case of future expansion, e.g., enabling to use not only OpenRouter but also other providers like OpenAI, Anthropic, Google Gemini, etc. and creating CI/CD pipelines for automated testing and deployment to production environments.
