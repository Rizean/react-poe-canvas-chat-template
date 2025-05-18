// src/utils/markdownParser.ts
import {marked, type MarkedOptions} from 'marked';
import {type Logger, tryCatchSync} from '@rizean/poe-canvas-utils';

// Configure marked options
const options: MarkedOptions = {
    gfm: true,      // Enable GitHub Flavored Markdown
    breaks: true,   // Convert single newlines (\n) into <br> tags
    pedantic: false,
};

marked.setOptions(options);

/**
 * Parses markdown text using configured marked options, with error handling via tryCatch.
 * @param text - The markdown text to parse.
 * @param logger - Logger instance for logging errors.
 * @returns HTML string.
 */
export const parseMarkdown = (text: string, logger: Logger): string => {
    if (text == null) { // Or text === null || text === undefined
        return '';
    }
    const inputText = String(text); // Ensure it's a string

    // Use the synchronous version of tryCatch
    const [parsedHtml, error] = tryCatchSync(() => marked.parse(inputText) as string);

    if (error) {
        // An error occurred during parsing
        logger.error("Markdown parsing error:", error); // Log the actual error object

        // Sanitize original text for safe HTML display in <pre> tag
        const escapedText = inputText
            .replace(/&/g, "&amp;") // Must be first
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        return `<p style="color: red; font-weight: bold;">Error parsing markdown.</p><pre style="white-space: pre-wrap; word-wrap: break-word;">${escapedText}</pre>`;
    }

    return parsedHtml as string;
};