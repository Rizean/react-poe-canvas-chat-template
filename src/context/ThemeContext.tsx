// src/context/ThemeContext.tsx
import React, {createContext, type ReactNode, useContext, useMemo, useState} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void; // Added to allow AppContext to set it
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>('light'); // Default to light

    // Removed useEffect related to localStorage

    const toggleTheme = () => {
        setThemeModeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Function to allow external setting of theme (e.g., from loaded settings)
    const setThemeMode = (mode: ThemeMode) => {
        if (mode === 'light' || mode === 'dark') {
            setThemeModeState(mode);
        }
    };

    const contextValue = useMemo(() => ({themeMode, toggleTheme, setThemeMode}), [themeMode]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useCustomTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useCustomTheme must be used within a CustomThemeProvider');
    }
    return context;
};