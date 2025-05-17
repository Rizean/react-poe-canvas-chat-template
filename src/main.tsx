// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AppProvider} from './context/AppContext';
import {CustomThemeProvider, useCustomTheme} from './context/ThemeContext';
import {ThemeProvider as StyledThemeProvider} from 'styled-components';
import {GlobalStyle} from './styles/GlobalStyles';
import {darkTheme, lightTheme} from './styles/theme';

const AppWithThemeProviders = () => {
    const {themeMode} = useCustomTheme();
    const currentStyledTheme = themeMode === 'dark' ? darkTheme : lightTheme;

    return (
        <StyledThemeProvider theme={currentStyledTheme}>
            <GlobalStyle/>
            <AppProvider>
                <App/>
            </AppProvider>
        </StyledThemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CustomThemeProvider> {/* Manages 'light'/'dark' string state */}
            <AppWithThemeProviders/> {/* Applies the actual theme object to styled-components */}
        </CustomThemeProvider>
    </React.StrictMode>
);