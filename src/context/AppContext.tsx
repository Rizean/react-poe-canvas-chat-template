// src/context/AppContext.tsx
import React, {createContext, type ReactNode, useCallback, useContext, useMemo, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import type {AppError, Message} from '../types/app';
import {constructExampleChatPrompt} from '../prompts/exampleChatPrompt';
import {
    applyGeminiThinkingFilter,
    type RequestState as PoeRequestState,
    useLogger,
    usePoeAi,
    saveDataToFile, // Import storage utils
    loadDataFromFile,
    type VersionedData,
    type StorageLoadOptions,
    tryCatchSync, // Import tryCatch
    type Result
} from '@rizean/poe-canvas-utils';
import { useCustomTheme } from './ThemeContext'; // Import theme context hook

// Define the structure for persisted application settings
interface AppSettingsData extends VersionedData {
    version: 1; // Current version of the settings structure
    themeMode: 'light' | 'dark';
    filterGemini: boolean;
    aiModel: string;
}
const APP_SETTINGS_VERSION = 1;
const APP_SETTINGS_FILENAME = 'chat-app-settings.json';

interface AppContextType {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    isLoading: boolean;
    error: AppError | null;
    clearError: () => void;
    selectedModel: string;
    setSelectedModel: (modelName: string) => void;
    sendChatMessage: (text: string) => Promise<void>;
    logger: ReturnType<typeof useLogger>['logger'];
    filterGeminiThinking: boolean;
    setFilterGeminiThinking: (value: boolean) => void;
    saveAppSettings: () => void; // New function
    loadAppSettings: () => Promise<void>; // New function
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const DEFAULT_MODEL_NAME = 'Gemini-2.5-Pro-Exp';

export const AppProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AppError | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_NAME);
    const [filterGeminiThinking, setFilterGeminiThinking] = useState<boolean>(false);

    const { themeMode, setThemeMode } = useCustomTheme(); // Get themeMode and setThemeMode
    const {logger: appLogger} = useLogger(import.meta.env.VITE_LOG_LEVEL || 'info'); // Renamed to avoid conflict

    const [sendToPoe] = usePoeAi({logger: appLogger, simulation: !window.Poe});

    const clearError = useCallback(() => {
        setError(null);
        appLogger.info('AppContext: Error cleared.');
    }, [appLogger]);

    const addMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp'>): Message => {
        const newMessage: Message = {
            ...messageData,
            id: uuidv4(),
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, newMessage]);
        appLogger.debug('AppContext: Message added', newMessage);
        return newMessage;
    }, [appLogger]);

    const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
        setMessages(prev => prev.map(msg => msg.id === id ? {...msg, ...updates} : msg));
        appLogger.debug(`AppContext: Message updated - ID: ${id}`, updates);
    }, [appLogger]);

    const handleSetSelectedModel = useCallback((modelName: string) => {
        setSelectedModel(modelName);
        appLogger.info('AppContext: AI Model changed to', modelName);
    }, [appLogger]);

    const handleSetFilterGeminiThinking = useCallback((value: boolean) => {
        setFilterGeminiThinking(value);
        appLogger.info('AppContext: Filter Gemini Thinking set to', value);
    }, [appLogger]);

    // --- App Settings Persistence ---
    const saveAppSettings = useCallback(() => {
        appLogger.info('AppContext: Attempting to save app settings.');
        const settingsToSave: AppSettingsData = {
            version: APP_SETTINGS_VERSION,
            themeMode,
            filterGemini: filterGeminiThinking,
            aiModel: selectedModel,
        };
        const [success, saveError] = saveDataToFile(APP_SETTINGS_FILENAME, settingsToSave);
        if (success) {
            appLogger.info('AppContext: App settings saved successfully.');
            // Optionally show a success message to the user via a toast or status update
        } else {
            appLogger.error('AppContext: Failed to save app settings.', saveError);
            setError({ message: 'Failed to save settings.', details: saveError?.message });
        }
    }, [themeMode, filterGeminiThinking, selectedModel, appLogger]);

    const loadAppSettings = useCallback(async () => {
        appLogger.info('AppContext: Attempting to load app settings.');
        const loadOptions: StorageLoadOptions<AppSettingsData> = {
            currentVersion: APP_SETTINGS_VERSION,
            // No migration needed for V1, but you could add it here for future versions
            migrate: async (loadedData: unknown, loadedVersion: number) => {
                appLogger.warn(`AppContext: Migration needed from v${loadedVersion} to v${APP_SETTINGS_VERSION}. No migration path defined for this version.`);
                // For this example, we'll just reject old versions if no explicit migration
                if (loadedVersion < APP_SETTINGS_VERSION) {
                    throw new Error(`Cannot migrate from unsupported version ${loadedVersion}`);
                }
                // If loadedVersion === APP_SETTINGS_VERSION, it shouldn't hit migrate, but as a safeguard:
                return loadedData as AppSettingsData;
            },
            validate: (dataToValidate: AppSettingsData) => {
                const isValid =
                    typeof dataToValidate.themeMode === 'string' &&
                    (dataToValidate.themeMode === 'light' || dataToValidate.themeMode === 'dark') &&
                    typeof dataToValidate.filterGemini === 'boolean' &&
                    typeof dataToValidate.aiModel === 'string' && dataToValidate.aiModel.length > 0;
                if (!isValid) appLogger.warn('AppContext: Loaded settings failed validation.', dataToValidate);
                return isValid;
            },
        };

        const [loadedSettings, loadError]: Result<AppSettingsData | null, Error | null> = await loadDataFromFile<AppSettingsData>(loadOptions);

        if (loadError) {
            appLogger.error('AppContext: Failed to load app settings.', loadError);
            setError({ message: 'Failed to load settings.', details: loadError.message });
        } else if (loadedSettings) {
            appLogger.info('AppContext: App settings loaded successfully.', loadedSettings);
            setThemeMode(loadedSettings.themeMode); // Update theme via ThemeContext
            setFilterGeminiThinking(loadedSettings.filterGemini);
            setSelectedModel(loadedSettings.aiModel);
            // Optionally show a success message
        } else {
            appLogger.info('AppContext: No app settings file selected or file was empty.');
            // No error, but no settings loaded (e.g., user cancelled dialog)
        }
    }, [appLogger, setThemeMode]);


    const sendChatMessage = useCallback(async (text: string) => {
        if (!selectedModel) {
            const errMsg = 'No AI model specified.';
            setError({message: errMsg});
            appLogger.warn(`sendChatMessage: ${errMsg}`);
            return;
        }
        if (!text.trim()) {
            appLogger.warn('sendChatMessage: Message text is empty.');
            return;
        }

        setIsLoading(true);
        clearError();

        const userMessage = addMessage({text, sender: 'user'});
        appLogger.info(`User message sent: ${userMessage.id} - "${text}"`);

        const aiMessagePlaceholder = addMessage({
            text: '',
            sender: 'ai',
            isStreaming: true,
        });
        appLogger.info(`AI placeholder created: ${aiMessagePlaceholder.id}`);

        const prompt = constructExampleChatPrompt(text, selectedModel);

        sendToPoe(prompt, (poeState: PoeRequestState) => {
            appLogger.debug(`PoeAI callback for ${aiMessagePlaceholder.id}:`, poeState);

            const rawContent = poeState.responses?.[0]?.content || '';
            let processedContent = rawContent;

            if (filterGeminiThinking) {
                // Use tryCatchSync for the filter operation
                const [filtered, filterError] = tryCatchSync(() => applyGeminiThinkingFilter(rawContent));
                if (filterError) {
                    appLogger.error('Error applying Gemini filter:', filterError);
                    // Fallback to raw content or handle error appropriately
                    processedContent = rawContent; // Or show an error in the message
                } else {
                    processedContent = filtered;
                }
            }

            if (poeState.status === 'incomplete') {
                updateMessage(aiMessagePlaceholder.id, {text: processedContent, isStreaming: true});
            } else if (poeState.status === 'complete') {
                updateMessage(aiMessagePlaceholder.id, {text: processedContent, isStreaming: false});
                setIsLoading(false);
                appLogger.info(`AI response complete for ${aiMessagePlaceholder.id}`);
            } else if (poeState.status === 'error') {
                const errorMessage = poeState.error || 'AI response error.';
                updateMessage(aiMessagePlaceholder.id, {text: `Error: ${errorMessage}`, isStreaming: false, error: errorMessage});
                setError({message: 'AI Error', details: errorMessage});
                setIsLoading(false);
                appLogger.error(`AI response error for ${aiMessagePlaceholder.id}:`, errorMessage);
            }
        }, {stream: true});

    }, [selectedModel, addMessage, updateMessage, sendToPoe, clearError, appLogger, filterGeminiThinking]);


    const contextValue = useMemo(() => ({
        messages,
        addMessage,
        updateMessage,
        isLoading,
        error,
        clearError,
        selectedModel,
        setSelectedModel: handleSetSelectedModel,
        sendChatMessage,
        logger: appLogger,
        filterGeminiThinking,
        setFilterGeminiThinking: handleSetFilterGeminiThinking,
        saveAppSettings,
        loadAppSettings,
    }), [
        messages,
        addMessage,
        updateMessage,
        isLoading,
        error,
        clearError,
        selectedModel,
        handleSetSelectedModel,
        sendChatMessage,
        appLogger,
        filterGeminiThinking,
        handleSetFilterGeminiThinking,
        saveAppSettings,
        loadAppSettings,
    ]);

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};