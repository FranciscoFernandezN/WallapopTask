import { mockScenarios, type MockScenario } from './scenarios.ts';

/** Probability (0-1) that the mock returns a valid response instead of an invalid one. */
const VALID_RESPONSE_PROBABILITY = 0.8;

/**
 * Finds the first mock scenario whose keyword appears in the input.
 *
 * @param input - Seller's product description (case-insensitive match).
 * @returns The matching scenario, or `null` if no keyword matches.
 */
function findMatchingScenario(input: string): MockScenario | null {
    const normalizedInput = input.toLowerCase();
    for (const scenario of mockScenarios) {
        if (normalizedInput.includes(scenario.keyword)) {
            return scenario;
        }
    }
    return null;
}

/**
 * Generates a mock AI response for the given seller details.
 *
 * Matches the input against known scenario keywords. If a match is found,
 * returns the valid response 80% of the time and the invalid response 20% of the time.
 * If no keyword matches, returns a generic valid response.
 *
 * @param sellerDetails - Raw product description from the seller.
 * @returns A 3-line string mimicking an AI model response.
 */
export function getMockResponse(sellerDetails: string): string {
    const scenario = findMatchingScenario(sellerDetails);
    
    if (!scenario) {
        return 'Generic Product Listing\ngeneric, product, item\n10-50';
    }
    
    return Math.random() < VALID_RESPONSE_PROBABILITY ? scenario.validResponse : scenario.invalidResponse;
}

/**
 * Checks whether the given provider identifier is the mock provider.
 *
 * @param provider - The provider string from the `AI_MODEL_PROVIDER` env var.
 * @returns `true` if the provider is exactly `'MOCK'`.
 */
export function isMockProvider(provider: string): boolean {
    return provider === 'MOCK';
}
