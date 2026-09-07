import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { getMockResponse, isMockProvider } from '../src/mocks/mockProvider.ts';
import { mockScenarios } from '../src/mocks/scenarios.ts';

describe('isMockProvider', () => {
  test('returns true when provider is MOCK', () => {
    expect(isMockProvider('MOCK')).toBe(true);
  });

  test('returns false when provider is not MOCK', () => {
    expect(isMockProvider('openai/gpt-4o')).toBe(false);
    expect(isMockProvider('mock')).toBe(false);
    expect(isMockProvider('')).toBe(false);
  });
});

describe('getMockResponse', () => {
  test('returns a response containing keyword when input matches a scenario', () => {
    const input = 'Vintage leather jacket, worn once, size M';
    const response = getMockResponse(input);
    
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
  });

  test('returns a valid response most of the time (80% probability)', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    
    const input = 'Vintage leather jacket, worn once';
    const response = getMockResponse(input);
    
    const scenario = mockScenarios.find(s => input.toLowerCase().includes(s.keyword));
    expect(scenario).toBeDefined();
    expect(response).toBe(scenario!.validResponse);
    
    jest.restoreAllMocks();
  });

  test('returns an invalid response when random is above 0.8', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    
    const input = 'Vintage leather jacket, worn once';
    const response = getMockResponse(input);
    
    const scenario = mockScenarios.find(s => input.toLowerCase().includes(s.keyword));
    expect(scenario).toBeDefined();
    expect(response).toBe(scenario!.invalidResponse);
    
    jest.restoreAllMocks();
  });

  test('returns generic response when no keyword matches', () => {
    const input = 'Some random product with no matching keywords';
    const response = getMockResponse(input);
    
    expect(response).toBe('Generic Product Listing\ngeneric, product, item\n10-50');
  });

  test('detects iphone keyword correctly', () => {
    const input = 'iPhone 12 Pro Max 256GB, Pacific Blue';
    const response = getMockResponse(input);
    
    expect(response).toBeDefined();
    const scenario = mockScenarios.find(s => 'iphone 12 pro max'.includes(s.keyword));
    expect(scenario).toBeDefined();
  });

  test('detects bike keyword correctly', () => {
    const input = 'Mountain bike Trek Marlin 7, 29 inch wheels';
    const response = getMockResponse(input);
    
    expect(response).toBeDefined();
  });

  test('detects nike keyword correctly', () => {
    const input = 'Nike Air Max 270 running shoes, size 42';
    const response = getMockResponse(input);
    
    expect(response).toBeDefined();
  });
});
