// src/prompts/exampleChatPrompt.ts

/**
 * Constructs a basic chat prompt for the Poe API.
 *
 * @param userMessage - The message from the user.
 * @param botHandle - The handle of the Poe bot to address (e.g., "@GPT-3.5-Turbo").
 * @returns A string formatted as a prompt for the Poe API.
 */
export const constructExampleChatPrompt = (userMessage: string, botHandle: string): string => {
    // For Poe, you typically need to address the bot by its handle.
    // This is a very basic prompt structure. You might want to add more context,
    // conversation history, or specific instructions depending on the bot and your needs.

    // Ensure the botHandle starts with "@" if it's a common Poe convention.
    // Some bots might not require it if they are default or context implies them.
    const addressedBotHandle = botHandle.startsWith('@') ? botHandle : `@${botHandle}`;

    return `${addressedBotHandle} ${userMessage}`;
};