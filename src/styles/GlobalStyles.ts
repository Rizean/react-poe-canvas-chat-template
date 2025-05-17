// src/styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    height: 100%;
    overflow: hidden; /* Prevent scrollbars on html */
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: inherit;
    min-height: 100vh;
    height: 100vh; /* Ensure body takes full viewport height */
    overflow: hidden; /* Prevent scrollbars on body */
    display: flex; /* Added for #root to take full height */
    flex-direction: column; /* Added for #root to take full height */
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%; /* Ensure root takes full height of body */
    overflow: hidden;
    flex-grow: 1; /* Ensure #root grows to fill body */
  }

  a {
    color: ${({ theme }) => theme.link};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Basic heading styles (can be expanded) */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
    color: inherit; /* Inherit color from parent, ultimately from body */
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  pre {
    font-family: monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  /* For react-icons, to ensure they inherit color by default if not overridden */
  svg {
    display: inline-block;
    vertical-align: middle;
  }

  /* Helper for visually hidden elements */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Keyframes for spinner (can be used by any component) */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .fa-spin { /* This is likely not used */
    animation: spin 1s linear infinite;
  }
`;