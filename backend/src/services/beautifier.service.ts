import { env, loadPromptText } from '../utils/env.ts';
import { OpenRouter } from '@openrouter/sdk';
import { AppError } from '../utils/errors.ts';
import { ErrorCodes } from '../../../shared/errors/codes.ts';

const MIN_WORDS_IN_TITLE = 2;

const openrouter = new OpenRouter({
    apiKey: env.aiModelProviderApiKey,
    appTitle: 'Listing beautifier'
});

export interface ParsedListing {
    title: string;
    tags: string[];
    priceRange: [number, number];
}

export function parseListingResponse(response: string): ParsedListing {
    const lines = response.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length < 3) {
        throw new AppError(ErrorCodes.BEAUTIFIER_MAX_RETRIES, 'Invalid response format: expected at least 3 lines');
    }
    
    const title = lines[0];
    const tags = lines[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const priceMatch = lines[2].match(/^(\d+)-(\d+)$/);
    
    if (!priceMatch) {
        throw new AppError(ErrorCodes.BEAUTIFIER_MAX_RETRIES, `Invalid price range format: ${lines[2]}`);
    }
    
    const minPrice = Number.parseInt(priceMatch[1], 10);
    const maxPrice = Number.parseInt(priceMatch[2], 10);
    
    return {
        title,
        tags,
        priceRange: [minPrice, maxPrice]
    };
}

export function titleContainsMinWords(title: string, originalDetails: string, minWords: number = MIN_WORDS_IN_TITLE): boolean {
    const originalWords = new Set(originalDetails.toLowerCase().split(' ').map(word => word.trim()).filter(word => word.length > 0));
    const titleWords = title.toLowerCase().split(' ').map(word => word.trim()).filter(word => word.length > 0);
    
    let matchCount = 0;
    for (const word of titleWords) {
        if (originalWords.has(word)) {
            matchCount++;
        }
    }
    
    return matchCount >= minWords;
}

async function askAIModel(sellerDetails: string): Promise<ParsedListing> {
    const completion = await openrouter.chat.send({
        chatRequest: {
            model: env.aiModelProvider,
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
    });

    if (completion instanceof ReadableStream) {
        throw new AppError(ErrorCodes.BEAUTIFIER_MAX_RETRIES, 'Expected a non-streaming response');
    }

    const responseText = completion.choices[0].message.content?.toString() || '';
    return parseListingResponse(responseText);
}

export async function beautifySellerDetails(sellerDetails: string): Promise<ParsedListing> {

    for (let i = 0; i < env.maxRetries; i++) {
        try {
            const result = await askAIModel(sellerDetails);
            if (titleContainsMinWords(result.title, sellerDetails)) {
                return result;
            }
        } catch (e) {}
    }
    throw new AppError(ErrorCodes.BEAUTIFIER_MAX_RETRIES, 'Max retries exceeded');
}
