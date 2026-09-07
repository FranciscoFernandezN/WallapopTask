import { mockScenarios, type MockScenario } from './scenarios.ts';

const VALID_RESPONSE_PROBABILITY = 0.8;

function findMatchingScenario(input: string): MockScenario | null {
    const normalizedInput = input.toLowerCase();
    for (const scenario of mockScenarios) {
        if (normalizedInput.includes(scenario.keyword)) {
            return scenario;
        }
    }
    return null;
}

export function getMockResponse(sellerDetails: string): string {
    const scenario = findMatchingScenario(sellerDetails);
    
    if (!scenario) {
        return 'Generic Product Listing\ngeneric, product, item\n10-50';
    }
    
    return Math.random() < VALID_RESPONSE_PROBABILITY ? scenario.validResponse : scenario.invalidResponse;
}

export function isMockProvider(provider: string): boolean {
    return provider === 'MOCK';
}
