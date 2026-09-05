import { env, loadPromptText } from './env.ts';
import { OpenRouter } from '@openrouter/sdk';

const openrouter = new OpenRouter({
    apiKey: env.aiModelProviderApiKey,
    appTitle: 'Listing beautifier'
});

export async function beautifySellerDetails(sellerDetails: string): Promise<string> {
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
        throw new Error('Expected a non-streaming response');
    }

    return completion.choices[0].message.content?.toString() || 'No content received from the AI model provider.';
}

