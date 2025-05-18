// src/prompts/structuredTextPrompt.ts

/**
 * Constructs a prompt for an AI model expected to return a structured response
 * suitable for parsing with complexResponseParser.
 *
 * Instructs the AI to provide a main response within <response> tags
 * and optionally include a JSON block for structured data.
 *
 * @param userQuery - The user's query or topic.
 * @param botHandle - The handle of the Poe bot to address (e.g., "@Gemini-2.5-Flash-Preview").
 * @returns A string formatted as a prompt.
 */
export const constructStructuredTextPrompt = (userQuery: string, botHandle: string): string => {
    const addressedBotHandle = botHandle.startsWith('@') ? botHandle : `@${botHandle}`;

    return `${addressedBotHandle}
Please process the following query: "${userQuery}"

Your response should be structured as follows:

1.  A primary textual answer or explanation enclosed within <response> and </response> tags.
    Example:
    <response>
    This is the main textual answer to the query.
    It can be multi-line.
    </response>

2.  Optionally, after the response block, provide any relevant structured data as a JSON object
    within a markdown code block (\`\`\`json ... \`\`\`).
    Example:
    \`\`\`json
    {
      "query": "${userQuery}",
      "keyPoints": ["Point 1", "Point 2"],
      "confidence": 0.85
    }
    \`\`\`

If no structured data is relevant, omit the JSON block entirely.
Ensure the main textual answer is always present within the <response> tags.
`;
};