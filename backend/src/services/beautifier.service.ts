import { env, loadPromptText } from '../utils/env.ts';
import { OpenRouter } from '@openrouter/sdk';
import { AppError } from '../utils/errors.ts';
import { ErrorCodes } from '../../../shared/errors/codes.ts';
import { getMockResponse, isMockProvider } from '../mocks/mockProvider.ts';

/** Minimum number of words from the original input that must appear in the AI-generated title. */
const MIN_WORDS_IN_TITLE = 2;

/**
 * Structured listing data parsed from the AI model's 3-line text response.
 *
 * @property title - Optimized product title.
 * @property tags - Relevant search tags.
 * @property priceRange - Estimated price range as [min, max].
 */
export interface ParsedListing {
    title: string;
    tags: string[];
    priceRange: [number, number];
}

/**
 * Parses the AI model's raw 3-line response into a structured listing.
 *
 * Expected format:
 *   Line 1: Title
 *   Line 2: Comma-separated tags
 *   Line 3: Price range as `min-max`
 *
 * @param response - Raw text response from the AI model.
 * @returns Parsed listing object.
 * @throws {AppError} When the response has fewer than 3 lines or the price range format is invalid.
 */
export function parseListingResponse(response: string): ParsedListing {
    const lines = response.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (lines.length < 3) {
        throw new AppError(ErrorCodes.BEAUTIFIER_MALFORMED_RESPONSE, 'Invalid response format: expected at least 3 lines');
    }

    const title = lines[0];
    const tags = lines[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const priceMatch = lines[2].match(/^(\d+)-(\d+)$/);

    if (!priceMatch) {
        throw new AppError(ErrorCodes.BEAUTIFIER_MALFORMED_RESPONSE, `Invalid price range format: ${lines[2]}`);
    }

    const minPrice = Number.parseInt(priceMatch[1], 10);
    const maxPrice = Number.parseInt(priceMatch[2], 10);

    return {
        title,
        tags,
        priceRange: [minPrice, maxPrice]
    };
}

/**
 * Checks whether the AI-generated title contains enough words from the original input.
 *
 * Used as a quality gate to reject hallucinated or irrelevant titles.
 *
 * @param title - The AI-generated title to validate.
 * @param originalDetails - The seller's original product description.
 * @param minWords - Minimum number of matching words required (defaults to `MIN_WORDS_IN_TITLE`).
 * @returns `true` if the title contains at least `minWords` words from the original input.
 */
export function titleContainsMinWords(title: string, originalDetails: string, minWords: number = MIN_WORDS_IN_TITLE): boolean {
    const originalWords = new Set(originalDetails.toLowerCase().split(' ').map(word => word.trim()));

    const matchCount = title.toLowerCase().split(' ').filter(word => originalWords.has(word)).length;

    return matchCount >= minWords;
}

/**
 * Sends a request to the specified AI model and parses the response.
 *
 * If the model is `MOCK`, returns a mock response instead.
 * Wraps the real API call in a `Promise.race` against a timeout.
 *
 * @param model - AI model identifier (e.g. `openai/gpt-4o`) or `MOCK`.
 * @param sellerDetails - Raw product description to beautify.
 * @returns Parsed listing from the AI response.
 * @throws {Error} When the response is a stream or the timeout is exceeded.
 * @throws {AppError} When the response format is invalid.
 */
async function askAIModel(model: string, sellerDetails: string): Promise<ParsedListing> {
    if (isMockProvider(model)) {
        const mockResponse = getMockResponse(sellerDetails);
        return parseListingResponse(mockResponse);
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`AI model timeout after ${env.aiModelTimeout}ms`)), env.aiModelTimeout);
    });

    const openrouter = new OpenRouter({
        apiKey: env.aiModelProviderApiKey,
        appTitle: 'Listing beautifier'
    });

    const completion = await Promise.race([
        openrouter.chat.send({
            chatRequest: {
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: loadPromptText(),
                    },
                    {
                        role: 'user',
                        content: sellerDetails,
                    },
                ],
            },
        }),
        timeoutPromise,
    ]);

    if (completion instanceof ReadableStream) {
        throw new Error('Expected a non-streaming response');
    }

    const responseText = completion.choices[0].message.content?.toString() || '';
    return parseListingResponse(responseText);
}

/**
 * Beautifies seller details by trying each configured AI model provider in order.
 *
 * For each provider, retries up to `env.maxRetries` times.
 * A retry is considered failed if the model throws, returns an invalid format,
 * or the title doesn't contain enough words from the original input.
 * If all providers are exhausted, throws an `AppError`.
 *
 * @param sellerDetails - Raw product description to beautify.
 * @returns Parsed and validated listing.
 * @throws {AppError} With `BEAUTIFIER_MAX_RETRIES` code when all providers fail.
 */
export async function beautifySellerDetails(sellerDetails: string): Promise<ParsedListing> {
    for (const model of env.aiModelProviders) {
        const result = await tryProviderWithRetries(model, sellerDetails);
        if (result !== null) {
            return result;
        }
    }
    throw new AppError(ErrorCodes.BEAUTIFIER_MAX_RETRIES, 'All providers exhausted');
}

/**
 * Attempts to get a valid listing from a single AI model provider within the retry limit.
 *
 * @param model - AI model identifier to query.
 * @param sellerDetails - Raw product description to beautify.
 * @returns A valid `ParsedListing` on success, or `null` if all retries fail.
 */
async function tryProviderWithRetries(model: string, sellerDetails: string): Promise<ParsedListing | null> {
    for (let i = 0; i < env.maxRetries; i++) {
        try {
            const result = await askAIModel(model, sellerDetails);
            if (titleContainsMinWords(result.title, sellerDetails)) {
                return result;
            }
        } catch (e) { }
    }
    return null;
}
