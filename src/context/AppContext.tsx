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
    saveDataToFile,
    loadDataFromFile,
    type VersionedData,
    type StorageLoadOptions,
    tryCatchSync,
    type Result
} from '@rizean/poe-canvas-utils';
import { useCustomTheme } from './ThemeContext';

// --- App Settings Configuration ---
const DEFAULT_CHAT_MODEL_NAME = 'Gemini-2.5-Pro-Exp'; // Renamed for clarity
const DEFAULT_TEXT_GEN_MODEL_NAME = 'Gemini-2.5-Flash-Preview';
const DEFAULT_MEDIA_GEN_MODEL_NAME = 'FLUX-schnell';

// Define the structure for persisted application settings
interface AppSettingsDataV1 extends VersionedData { // Previous version
    version: 1;
    themeMode: 'light' | 'dark';
    filterGemini: boolean;
    aiModel: string; // This was for the general chat
}

interface AppSettingsDataV2 extends VersionedData { // Current version
    version: 2;
    themeMode: 'light' | 'dark';
    filterGemini: boolean;
    chatModel: string; // Renamed for clarity
    textGeneratorModel: string; // New
    mediaGeneratorModel: string; // New
}

const APP_SETTINGS_CURRENT_VERSION = 2; // Incremented version
const APP_SETTINGS_FILENAME = 'chat-app-settings.json';


interface AppContextType {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    isLoading: boolean;
    error: AppError | null;
    clearError: () => void;
    selectedChatModel: string; // Renamed
    setSelectedChatModel: (modelName: string) => void; // Renamed
    selectedTextGeneratorModel: string; // New
    setSelectedTextGeneratorModel: (modelName: string) => void; // New
    selectedMediaGeneratorModel: string; // New
    setSelectedMediaGeneratorModel: (modelName: string) => void; // New
    sendChatMessage: (text: string) => Promise<void>;
    logger: ReturnType<typeof useLogger>['logger'];
    filterGeminiThinking: boolean;
    setFilterGeminiThinking: (value: boolean) => void;
    saveAppSettings: () => void;
    loadAppSettings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AppError | null>(null);

    // Model states
    const [selectedChatModel, setSelectedChatModelInternal] = useState<string>(DEFAULT_CHAT_MODEL_NAME);
    const [selectedTextGeneratorModel, setSelectedTextGeneratorModelInternal] = useState<string>(DEFAULT_TEXT_GEN_MODEL_NAME);
    const [selectedMediaGeneratorModel, setSelectedMediaGeneratorModelInternal] = useState<string>(DEFAULT_MEDIA_GEN_MODEL_NAME);

    const [filterGeminiThinking, setFilterGeminiThinking] = useState<boolean>(false);

    const { themeMode, setThemeMode } = useCustomTheme();
    const {logger: appLogger} = useLogger(import.meta.env.VITE_LOG_LEVEL || 'info');

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

    // --- Model Setters ---
    const handleSetSelectedChatModel = useCallback((modelName: string) => {
        setSelectedChatModelInternal(modelName);
        appLogger.info('AppContext: Chat AI Model changed to', modelName);
    }, [appLogger]);

    const handleSetSelectedTextGeneratorModel = useCallback((modelName: string) => {
        setSelectedTextGeneratorModelInternal(modelName);
        appLogger.info('AppContext: Text Generator AI Model changed to', modelName);
    }, [appLogger]);

    const handleSetSelectedMediaGeneratorModel = useCallback((modelName: string) => {
        setSelectedMediaGeneratorModelInternal(modelName);
        appLogger.info('AppContext: Media Generator AI Model changed to', modelName);
    }, [appLogger]);


    const handleSetFilterGeminiThinking = useCallback((value: boolean) => {
        setFilterGeminiThinking(value);
        appLogger.info('AppContext: Filter Gemini Thinking set to', value);
    }, [appLogger]);

    // --- App Settings Persistence ---
    const saveAppSettings = useCallback(() => {
        appLogger.info('AppContext: Attempting to save app settings.');
        const settingsToSave: AppSettingsDataV2 = { // Save as current version V2
            version: APP_SETTINGS_CURRENT_VERSION,
            themeMode,
            filterGemini: filterGeminiThinking,
            chatModel: selectedChatModel,
            textGeneratorModel: selectedTextGeneratorModel,
            mediaGeneratorModel: selectedMediaGeneratorModel,
        };
        const [success, saveError] = saveDataToFile(APP_SETTINGS_FILENAME, settingsToSave);
        if (success) {
            appLogger.info('AppContext: App settings saved successfully.');
        } else {
            appLogger.error('AppContext: Failed to save app settings.', saveError);
            setError({ message: 'Failed to save settings.', details: saveError?.message });
        }
    }, [themeMode, filterGeminiThinking, selectedChatModel, selectedTextGeneratorModel, selectedMediaGeneratorModel, appLogger]);

    const loadAppSettings = useCallback(async () => {
        appLogger.info('AppContext: Attempting to load app settings.');
        const loadOptions: StorageLoadOptions<AppSettingsDataV2> = { // Expecting V2
            currentVersion: APP_SETTINGS_CURRENT_VERSION,
            migrate: async (loadedUntypedData: unknown, loadedVersion: number): Promise<AppSettingsDataV2> => {
                appLogger.info(`AppContext: Migrating settings from v${loadedVersion} to v${APP_SETTINGS_CURRENT_VERSION}.`);
                if (loadedVersion === 1) {
                    const oldData = loadedUntypedData as AppSettingsDataV1;
                    return {
                        version: APP_SETTINGS_CURRENT_VERSION,
                        themeMode: oldData.themeMode,
                        filterGemini: oldData.filterGemini,
                        chatModel: oldData.aiModel, // Map old aiModel to chatModel
                        textGeneratorModel: DEFAULT_TEXT_GEN_MODEL_NAME, // Initialize new field
                        mediaGeneratorModel: DEFAULT_MEDIA_GEN_MODEL_NAME, // Initialize new field
                    };
                }
                // Add more migration paths here if future versions are introduced
                throw new Error(`Migration from version ${loadedVersion} to ${APP_SETTINGS_CURRENT_VERSION} not supported.`);
            },
            validate: (dataToValidate: AppSettingsDataV2) => {
                const isValid =
                    typeof dataToValidate.themeMode === 'string' &&
                    (dataToValidate.themeMode === 'light' || dataToValidate.themeMode === 'dark') &&
                    typeof dataToValidate.filterGemini === 'boolean' &&
                    typeof dataToValidate.chatModel === 'string' && dataToValidate.chatModel.length > 0 &&
                    typeof dataToValidate.textGeneratorModel === 'string' && dataToValidate.textGeneratorModel.length > 0 &&
                    typeof dataToValidate.mediaGeneratorModel === 'string' && dataToValidate.mediaGeneratorModel.length > 0;
                if (!isValid) appLogger.warn('AppContext: Loaded settings failed validation.', dataToValidate);
                return isValid;
            },
        };

        const [loadedSettings, loadError]: Result<AppSettingsDataV2 | null, Error | null> = await loadDataFromFile<AppSettingsDataV2>(loadOptions);

        if (loadError) {
            appLogger.error('AppContext: Failed to load app settings.', loadError);
            setError({ message: 'Failed to load settings.', details: loadError.message });
        } else if (loadedSettings) {
            appLogger.info('AppContext: App settings loaded successfully.', loadedSettings);
            setThemeMode(loadedSettings.themeMode);
            setFilterGeminiThinking(loadedSettings.filterGemini);
            setSelectedChatModelInternal(loadedSettings.chatModel);
            setSelectedTextGeneratorModelInternal(loadedSettings.textGeneratorModel);
            setSelectedMediaGeneratorModelInternal(loadedSettings.mediaGeneratorModel);
        } else {
            appLogger.info('AppContext: No app settings file selected or file was empty.');
        }
    }, [appLogger, setThemeMode]);


    const sendChatMessage = useCallback(async (text: string) => {
        if (!selectedChatModel) { // Use selectedChatModel here
            const errMsg = 'No AI model specified for chat.';
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

        const prompt = constructExampleChatPrompt(text, selectedChatModel); // Use selectedChatModel

        sendToPoe(prompt, (poeState: PoeRequestState) => {
            appLogger.debug(`PoeAI callback for ${aiMessagePlaceholder.id}:`, poeState);

            const rawContent = poeState.responses?.[0]?.content || '';
            let processedContent = rawContent;

            if (filterGeminiThinking) {
                const [filtered, filterError] = tryCatchSync(() => applyGeminiThinkingFilter(rawContent));
                if (filterError) {
                    appLogger.error('Error applying Gemini filter:', filterError);
                    processedContent = rawContent;
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

    }, [selectedChatModel, addMessage, updateMessage, sendToPoe, clearError, appLogger, filterGeminiThinking]);


    const contextValue = useMemo(() => ({
        messages,
        addMessage,
        updateMessage,
        isLoading,
        error,
        clearError,
        selectedChatModel, // Renamed
        setSelectedChatModel: handleSetSelectedChatModel, // Renamed
        selectedTextGeneratorModel, // New
        setSelectedTextGeneratorModel: handleSetSelectedTextGeneratorModel, // New
        selectedMediaGeneratorModel, // New
        setSelectedMediaGeneratorModel: handleSetSelectedMediaGeneratorModel, // New
        sendChatMessage,
        logger: appLogger,
        filterGeminiThinking,
        setFilterGeminiThinking: handleSetFilterGeminiThinking,
        saveAppSettings,
        loadAppSettings,
    }), [
        messages, addMessage, updateMessage, isLoading, error, clearError,
        selectedChatModel, handleSetSelectedChatModel,
        selectedTextGeneratorModel, handleSetSelectedTextGeneratorModel,
        selectedMediaGeneratorModel, handleSetSelectedMediaGeneratorModel,
        sendChatMessage, appLogger, filterGeminiThinking, handleSetFilterGeminiThinking,
        saveAppSettings, loadAppSettings,
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