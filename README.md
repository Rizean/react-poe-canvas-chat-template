# React Poe Canvas Chat Template

This project is a template for building interactive chat applications for the [Poe.com](https://poe.com/) Canvas platform. It's built with React, TypeScript, Vite, and Styled Components, and leverages the `@rizean/poe-canvas-utils` library for Poe API interaction, logging, error handling, and data persistence.

The template provides a foundational structure including a chat interface, theme management (light/dark mode), and a simple navigation system, all designed to work within the constraints of the Poe Canvas environment.

## Features

-   **Poe API Integration**: Uses `usePoeAi` from `@rizean/poe-canvas-utils` for seamless communication with Poe bots, including support for streaming and simulation.
-   **Client-Side Logging**: Implements `useLogger` for in-browser debugging.
-   **State Management**: Utilizes React Context API (`AppContext`, `ThemeContext`) for global state.
-   **Styling**: Styled Components for dynamic and themeable UI.
-   **File-Based Storage**: Custom solution using `saveDataToFile` and `loadDataFromFile` to persist application settings (theme, AI model, etc.) due to Poe Canvas sandbox limitations.
-   **Markdown Support**: Parses and renders AI responses in Markdown.
-   **Vite-Powered**: Fast development server and optimized builds.
-   **Single-File Build**: Configured to build into a single HTML file suitable for Poe Canvas deployment.
-   **ESLint**: Integrated for code quality.
-   **TypeScript**: For type safety and improved developer experience.

## Project Structure

```
react-poe-canvas-chat-template/
├── public/                     # Static assets
├── src/
│   ├── App.tsx                 # Main application component, routing logic
│   ├── assets/                 # Image assets, etc.
│   ├── components/             # Reusable UI components (chat, layout, common)
│   ├── context/                # React Context for global state (App, Theme)
│   ├── hooks/                  # Custom React hooks (if any)
│   ├── main.tsx                # Entry point of the application
│   ├── pages/                  # Page-level components (HomePage, ChatPage)
│   ├── prompts/                # Logic for constructing AI prompts
│   ├── styled.d.ts             # Styled Components theme declaration
│   ├── styles/                 # Global styles and theme definitions
│   ├── types/                  # TypeScript type definitions for the app
│   ├── utils/                  # Utility functions (e.g., markdownParser)
│   └── vite-env.d.ts           # Vite environment variable typings
├── eslint.config.js            # ESLint configuration
├── index.html                  # Main HTML file with import maps
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite build configuration
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 20.x or later recommended)
-   [pnpm](https://pnpm.io/) (or npm/yarn, but pnpm is used in this template)

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd react-poe-canvas-chat-template
    ```

2.
    **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

## Building for Poe.com Canvas

Poe Canvas apps require a single HTML file. This template is configured to produce such a file.

1.  **Build the application:**
    ```bash
    pnpm build
    ```
    This command will:
    *   Run TypeScript checks (`tsc -b`).
    *   Use Vite to build the application into a single HTML file located in the `dist/` directory (e.g., `dist/index.html`).

2.  **Deploy to Poe Canvas:**
    *   Go to [Poe.com](https://poe.com/) and navigate to the section for creating or editing your bot.
    *   Choose "Canvas App" as the interface.
    *   Upload the `dist/index.html` file generated in the previous step.

## Key Concepts & Customization

### Navigating Between Pages

-   Navigation is handled by the `App.tsx` component using a simple state variable (`currentPage`).
-   The `navigateTo` function (passed down from `App.tsx`) is used to change the `currentPage` state, causing a re-render with the new page component.
-   Example: `Header.tsx` and `Sidebar.tsx` use `navigateTo('home')` or `navigateTo('chat')`.

### Adding New Pages

1.  **Create the Page Component:**
    *   Add a new `.tsx` file in the `src/pages/` directory (e.g., `src/pages/SettingsPage.tsx`).
    *   Implement your page component.
        ```tsx
        // src/pages/SettingsPage.tsx
        import React from 'react';
        import styled from 'styled-components';

        const SettingsPageWrapper = styled.div`
          padding: 1rem;
          h2 { margin-bottom: 1rem; }
        `;

        const SettingsPage: React.FC = () => {
          return (
            <SettingsPageWrapper>
              <h2>Application Settings</h2>
              {/* Your settings UI here */}
            </SettingsPageWrapper>
          );
        };

        export default SettingsPage;
        ```

2.  **Update `PageName` Type:**
    *   In `src/App.tsx`, add your new page name to the `PageName` type:
        ```typescript
        export type PageName = 'home' | 'chat' | 'settings';
        ```

3.  **Add to `renderPage` Logic:**
    *   In `src/App.tsx`, update the `renderPage` function to include a case for your new page:
        ```typescript
        // src/App.tsx
        import SettingsPage from './pages/SettingsPage'; // Import the new page

        // ...
        const renderPage = () => {
            switch (currentPage) {
                case 'home':
                    return <HomePage navigateTo={navigateTo} />;
                case 'chat':
                    return <ChatPage />;
                case 'settings': // Add new case
                    return <SettingsPage />;
                default:
                    logger.warn(`App: Unknown page "${currentPage}", defaulting to home.`);
                    return <HomePage navigateTo={navigateTo} />;
            }
        };
        // ...
        ```

4.  **Add Navigation Links:**
    *   Update components like `Sidebar.tsx` or `Header.tsx` to include links/buttons that call `navigateTo('settings')`.

### Adding New Components

1.  Create your component file (e.g., `src/components/common/MyNewButton.tsx`).
2.  Implement the component using React and Styled Components if needed.
3.  Import and use it in your pages or other components.

### Adding New Prompts

-   Prompt construction logic is centralized in the `src/prompts/` directory.
-   Currently, `exampleChatPrompt.ts` shows a basic way to format a prompt for Poe.
-   To add a new prompt strategy:
    1.  Create a new file (e.g., `src/prompts/summaryPrompt.ts`).
    2.  Export a function that takes necessary inputs (like user message, conversation history) and returns a formatted prompt string.
    3.  Import and use this function in `AppContext.tsx` or wherever you initiate `sendToPoe` calls.

### Styling the App

-   **Styled Components**: The primary method for styling. Components are styled directly in their `.tsx` files or by creating styled utility components.
-   **Theme**: Defined in `src/styles/theme.ts` (`lightTheme`, `darkTheme`). It includes colors, dimensions, etc.
    -   Access theme properties in styled components: `background-color: ${({ theme }) => theme.body};`
-   **Global Styles**: `src/styles/GlobalStyles.ts` defines base styles for HTML elements, body, etc.
-   **Theme Switching**: Managed by `ThemeContext.tsx` and `CustomThemeProvider`. The `useCustomTheme` hook provides `themeMode` and `toggleTheme`. App settings persistence also handles saving/loading the theme.

### Managing Imports (HTML, Vite, package.json) - **CRITICAL for Poe Canvas**

Poe Canvas apps have a **strict 1MB size limit** for the uploaded HTML file. This makes import management crucial.

1.  **`index.html` and Import Maps (CDN Imports):**
    *   The `index.html` file uses an **import map** to define how bare module specifiers (e.g., `import React from 'react'`) are resolved.
    *   **Current Setup**: This template uses `esm.sh` as a CDN to load external dependencies like React, Styled Components, etc.
        ```html
        <script type="importmap">
            {
              "imports": {
                "@rizean/poe-canvas-utils": "https://esm.sh/@rizean/poe-canvas-utils@0.2.1",
                "marked": "https://esm.sh/marked@15.0.11",
                "react": "https://esm.sh/react@19.1.0",
                // ... other CDN imports
              }
            }
        </script>
        ```
    *   **Benefits of CDN Imports**:
        *   Significantly reduces the size of your bundled HTML file because these large libraries are fetched by the browser from the CDN at runtime.
        *   Helps stay under the 1MB Poe Canvas limit.
    *   **Managing CDN Imports**:
        *   When adding a new external dependency:
            1.  Install it as a `devDependency` in `package.json` for type support (e.g., `pnpm add -D some-library @types/some-library`).
            2.  Add an entry to the import map in `index.html`, pointing to its CDN URL (e.g., `esm.sh/some-library@version`).
            3.  Add the library to `build.rollupOptions.external` in `vite.config.ts`.
        *   Ensure versions in `package.json` (for types) and `index.html` (for CDN) are compatible.

2.  **`vite.config.ts` - Externalizing Dependencies:**
    *   The `build.rollupOptions.external` array in `vite.config.ts` tells Vite/Rollup *not* to bundle these specified libraries into your output file. This is essential when using CDN imports via an import map.
        ```typescript
        // vite.config.ts
        build: {
            // ...
            rollupOptions: {
                external: [
                    '@rizean/poe-canvas-utils',
                    'marked',
                    'react',
                    'react-dom',
                    'react-icons',
                    'react-icons/fa',
                    // 'styled-components', // Example: if you were using it
                    'uuid',
                    'react-dom/client'
                ],
                // ...
            }
        }
        ```
    *   If a library is listed as `external` here, it *must* have a corresponding entry in the `index.html` import map so the browser knows where to load it from at runtime.
    *   **Note**: Some libraries might not work well when externalized this way, especially if they have complex internal dependencies or side effects not suited for CDN loading via `esm.sh`. The comments in the provided `vite.config.ts` (e.g., for `styled-components`) indicate potential issues that were resolved by *not* externalizing them in this specific template's final configuration, meaning they are bundled. You'll need to test carefully.

3.  **`package.json` - Dependencies vs. DevDependencies:**
    *   **`dependencies`**: Libraries that are part of your application's runtime code.
        *   If you are **bundling** a dependency (i.e., it's *not* in `vite.config.ts`'s `external` array and *not* in the `index.html` import map), it should be in `dependencies`.
        *   Additionally, it is good practice to include the library in `dependencies` even if you are using it via CDN, as this allows for type definitions and ensures the library is available in your local development environment.
    *   **`devDependencies`**: Libraries needed only for development (e.g., Vite itself, TypeScript, ESLint, type definitions like `@types/react`). These are not included in the final build.

4.  **Not Using CDN Imports (Bundling Everything):**
    *   If you choose *not* to use CDN imports (e.g., for an environment without internet access, or if CDN loading is problematic), you would:
        1.  Remove the import map from `index.html`.
        2.  Remove the corresponding entries from `build.rollupOptions.external` in `vite.config.ts`.
        3.  Ensure all runtime libraries are listed in `dependencies` in `package.json`.
    *   **Caution**: This will significantly increase your `dist/index.html` file size. You must be extremely mindful of the **1MB Poe Canvas limit**. Aggressive code splitting, tree shaking, and choosing lightweight alternatives for libraries become critical. For Poe Canvas, **CDN imports are generally recommended for common, larger libraries.**

### Poe Canvas Sandbox and Storage

-   Poe Canvas apps run in a sandboxed iframe environment.
-   They **do not have access** to standard browser storage mechanisms like `localStorage`, `sessionStorage`, or cookies.
-   This means any application state (like user preferences, chat history if you were to persist it, selected AI model) will be lost when the user closes the canvas app or refreshes the page, unless a custom storage solution is implemented.

### Custom Storage Solution (`@rizean/poe-canvas-utils`)

-   This template uses `saveDataToFile` and `loadDataFromFile` from the `@rizean/poe-canvas-utils` library to address the storage limitation.
-   **How it works:**
    *   `saveDataToFile(filename, data)`: Serializes the provided `data` object (which should include a `version` property) into JSON and triggers a browser download of this JSON file. The user saves this file to their local machine.
    *   `loadDataFromFile(options)`: Programmatically creates a file input, allowing the user to select a previously saved JSON file. It then reads, parses, and (if configured) migrates and validates the data.
-   **Usage in this Template (`AppContext.tsx`):**
    *   `saveAppSettings()`: Gathers current settings (theme, AI model, Gemini filter) into an `AppSettingsData` object and calls `saveDataToFile`.
    *   `loadAppSettings()`: Calls `loadDataFromFile` with options for the current settings version, migration (if any), and validation. If successful, it updates the application state with the loaded settings.
    *   These functions are exposed via `Header.tsx` buttons.
-   **Data Versioning**: The `VersionedData` interface and `StorageLoadOptions` (including `currentVersion` and `migrate` function) from `@rizean/poe-canvas-utils` allow you to evolve your application's data structure over time while providing a way to upgrade data from older saved files.

### Reviewing `@rizean/poe-canvas-utils`

-   It's highly recommended to review the source code or documentation for `@rizean/poe-canvas-utils` to fully understand its capabilities:
    -   `usePoeAi`: Hook for Poe API interaction.
    -   `useLogger`: Client-side logging.
    -   `tryCatchSync`, `tryCatchAsync`: Functional error handling.
    -   `saveDataToFile`, `loadDataFromFile`: File-based data persistence.
    -   `applyGeminiThinkingFilter`: Text utility.
    -   Exported Poe API types.

### Using the Theme (`ThemeContext` and Styled Components)

1.  **Theme Definition (`src/styles/theme.ts`):**
    *   Defines `lightTheme` and `darkTheme` objects containing various style properties (colors, dimensions).
    *   The `Theme` interface ensures both themes have the same structure.

2.  **Theme Provider (`src/context/ThemeContext.tsx`):**
    *   `CustomThemeProvider` manages the current `themeMode` state (`'light'` or `'dark'`).
    *   `useCustomTheme` hook provides `themeMode` and `toggleTheme()` (and `setThemeMode()` for programmatic changes).

3.  **Applying Theme (`src/main.tsx`):**
    *   `CustomThemeProvider` wraps the app.
    *   `AppWithThemeProviders` component uses `useCustomTheme` to get the current `themeMode` and selects the corresponding theme object (`lightTheme` or `darkTheme`).
    *   This selected theme object is passed to `StyledThemeProvider` from `styled-components`.

4.  **Using Theme in Components:**
    *   Styled Components automatically receive the theme object via props.
        ```tsx
        import styled from 'styled-components';

        const MyStyledDiv = styled.div`
          background-color: ${({ theme }) => theme.body};
          color: ${({ theme }) => theme.text};
          padding: ${({ theme }) => theme.headerHeight} 0; // Example using a dimension
        `;
        ```

### Using the `usePoeAi` Hook

-   Located in `src/context/AppContext.tsx`.
-   `const [sendToPoe] = usePoeAi({ logger: appLogger, simulation: !window.Poe });`
    -   Initializes the hook.
    -   `logger`: Passes the app's logger instance.
    -   `simulation: !window.Poe`: Enables simulation mode if `window.Poe` (the Poe Embed API) is not detected (useful for local development outside the Poe environment). 
-   `sendToPoe(prompt, callback, options)`:
    -   `prompt`: The string to send to the AI (e.g., `@Gemini-2.5-Pro-Exp Hello!`).
    -   `callback`: A function that receives `PoeRequestState` updates (`{ requestId, generating, error, responses, status }`).
    -   `options?`: Optional object for `stream`, `openChat`, `attachments`, `simulatedResponseOverride`.
-   The callback in `AppContext` handles updates from `sendToPoe`, updates message state, and manages loading/error states.

## Available Scripts

In your `package.json`, you'll find these scripts:

-   `pnpm dev`: Starts the Vite development server.
-   `pnpm build`: Builds the application for production (generates `dist/index.html`).
-   `pnpm lint`: Runs ESLint to check for code quality issues.
-   `pnpm preview`: Serves the production build locally for preview.
-   `pnpm type-check`: Runs TypeScript compiler to check for type errors without emitting files.

### `prompt-helper` Scripts

This project includes `prompt-helper` scripts. `prompt-helper` is a command-line tool designed to gather project context (like directory structure, file contents, dependencies) and format it into a prompt that can be fed to an AI model (like the one you are interacting with now!). This is extremely useful for:

-   Generating documentation (like this README).
-   Asking an AI to help refactor code.
-   Getting explanations for parts of the codebase.
-   Scaffolding new features based on the existing structure.

You can use these scripts to generate context for your own AI interactions:

-   `pnpm ph-src`: Gathers code from the `src` directory, ignoring test files.
-   `pnpm ph-src-extra`: Gathers code from `src`, `index.html`, and `vite.config.ts`, ignoring test files. This is useful for prompts that need build/config context.
-   `pnpm ph-src-with-test`: Gathers all code from `src`, including test files.
-   `pnpm ph-dep`: Generates a dependency graph of your project.
-   `pnpm ph-complexity`: Provides code complexity metrics.

To use `prompt-helper` for your own app based on this template:
1.  Make your code changes.
2.  Run one of the `ph-*` scripts (e.g., `pnpm ph-src-extra`).
3.  Copy the output from the console.
4.  Paste it into your AI model's input, followed by your specific request (e.g., "Update the README based on these changes," or "Help me add a new settings page").

## Further Development

-   **Error Handling**: Enhance global error display (e.g., using toasts instead of just in `AppContext`).
-   **Chat History Persistence**: The current `saveAppSettings` only saves settings, not chat messages. You could extend `AppSettingsData` and the save/load logic to include chat history if desired, but be mindful of file size.
-   **Advanced Prompt Engineering**: Explore more complex prompt structures in `src/prompts/` for better AI interactions.
-   **UI/UX Enhancements**: Add more sophisticated UI elements, animations, and user feedback.
-   **Testing**: Implement unit and integration tests (e.g., using Jest and React Testing Library).

This template provides a solid starting point. Happy building!
