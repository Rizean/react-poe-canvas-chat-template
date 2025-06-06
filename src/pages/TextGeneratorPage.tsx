// src/pages/TextGeneratorPage.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {FaPaperPlane, FaSpinner} from 'react-icons/fa';
import {complexResponseParser, type ParsedComplexAiResponse, type Result, type TextRequestCallback, usePoeAiTextGenerator,} from '@rizean/poe-canvas-utils';
import {constructStructuredTextPrompt} from '../prompts/structuredTextPrompt';
import {useAppContext} from '../context/AppContext';


const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: ${({theme}) => theme.body};
    min-width: 0;
`;

const ResultsArea = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: ${({theme}) => theme.body};
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ResultSection = styled.div`
    background-color: ${({theme}) => theme.cardBg};
    border: 1px solid ${({theme}) => theme.border};
    border-radius: 0.25rem;
    padding: 1rem;

    h5 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        color: ${({theme}) => theme.text};
    }

    pre {
        background-color: ${({theme}) => theme.inputBg};
        color: ${({theme}) => theme.text};
        padding: 0.5rem;
        border-radius: 0.25rem;
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 300px;
        overflow-y: auto;
    }
`;

const InputArea = styled.div`
    padding: 1rem;
    background-color: ${({theme}) => theme.inputBg};
    border-top: 1px solid ${({theme}) => theme.border};
    flex-shrink: 0;
`;

const InputGroup = styled.div`
    display: flex;
    width: 100%;
    gap: 0.5rem;
    align-items: center;
`;

const TextInput = styled.input`
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    color: ${({theme}) => theme.text};
    background-color: ${({theme}) => theme.inputBg};
    border: 1px solid ${({theme}) => theme.inputBorder};
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
        border-color: ${({theme}) => theme.primary};
        outline: 0;
        box-shadow: 0 0 0 0.2rem ${({theme}) => theme.primary}33;
    }

    &:disabled {
        opacity: 0.7;
    }
`;

const ModelInput = styled(TextInput)`
    flex-grow: 0;
    width: 250px;
`;

const SendButton = styled.button`
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: ${({theme}) => theme.buttonPrimaryText};
    background-color: ${({theme}) => theme.buttonPrimaryBg};
    border: 1px solid ${({theme}) => theme.buttonPrimaryBorder};
    border-radius: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
        background-color: ${({theme}) => theme.primary}E6;
    }

    &:disabled {
        opacity: 0.65;
    }

    svg.fa-spin {
        animation: spin 1s linear infinite;
    }
`;

const AlertContainer = styled.div`
    margin: 0.5rem 1rem;
    padding: 1rem;
    border: 1px solid ${({theme}) => theme.alertDangerBorder};
    background-color: ${({theme}) => theme.alertDangerBg};
    color: ${({theme}) => theme.alertDangerText};
    border-radius: 0.25rem;
`;

const TextGeneratorPage: React.FC = () => {
    const {
        logger,
        error: globalError,
        clearError: clearGlobalError,
        selectedTextGeneratorModel,
        setSelectedTextGeneratorModel,
    } = useAppContext();

    const [sendTextPrompt] = usePoeAiTextGenerator<ParsedComplexAiResponse>({
        logger,
        simulation: !window.Poe,
    });

    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [rawText, setRawText] = useState('');
    const [parsedResponse, setParsedResponse] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<unknown | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const resultsAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (resultsAreaRef.current) {
            resultsAreaRef.current.scrollTop = resultsAreaRef.current.scrollHeight;
        }
    }, [rawText, parsedResponse, parsedData]);


    const handleSend = useCallback(() => {
        if (!inputValue.trim() || !selectedTextGeneratorModel.trim()) { // Use context model
            setErrorMessage("Prompt and AI Model name cannot be empty.");
            return;
        }
        logger.info(`Sending text prompt to ${selectedTextGeneratorModel}:`, inputValue); // Use context model
        setIsGenerating(true);
        setRawText('');
        setParsedResponse(null);
        setParsedData(null);
        setErrorMessage(null);
        if (globalError) clearGlobalError();


        const prompt = constructStructuredTextPrompt(inputValue, selectedTextGeneratorModel); // Use context model

        const callback: TextRequestCallback<ParsedComplexAiResponse> = (state) => {
            setRawText(state.text);

            if (state.error) {
                logger.error("Text generation error:", state.error);
                setErrorMessage(state.error);
                setIsGenerating(false);
            } else {
                setErrorMessage(null);
            }

            if (state.parsed) {
                setParsedResponse(state.parsed.response);
                if (state.parsed.data !== undefined) {
                    setParsedData(state.parsed.data);
                } else {
                    setParsedData(null);
                }
            }

            if (!state.generating) {
                setIsGenerating(false);
                logger.info("Text generation complete.");
            }
        };

        sendTextPrompt(prompt, callback, {
            parser: (textToParse: string): Result<ParsedComplexAiResponse, Error> => {
                return complexResponseParser(textToParse);
            }
        });

    }, [inputValue, selectedTextGeneratorModel, sendTextPrompt, logger, globalError, clearGlobalError]); // Use context model

    return (
        <PageContainer>
            {errorMessage && <AlertContainer>Error: {errorMessage}</AlertContainer>}
            {globalError && <AlertContainer>Global Error: {globalError.message} {globalError.details && `- ${globalError.details}`}</AlertContainer>}
            <ResultsArea ref={resultsAreaRef}>
                <ResultSection>
                    <h5>Raw AI Output (Streaming)</h5>
                    <pre>{rawText || (isGenerating ? "Generating..." : "No output yet.")}</pre>
                </ResultSection>
                <ResultSection>
                    <h5>Parsed Response (from &lt;response&gt; tags)</h5>
                    <pre>{parsedResponse ?? (isGenerating && !parsedResponse ? "Waiting for parsed response..." : "No parsed response yet.")}</pre>
                </ResultSection>
                <ResultSection>
                    <h5>Parsed JSON Data (from ```json block)</h5>
                    <pre>{parsedData !== null ? JSON.stringify(parsedData, null, 2) : (isGenerating && !parsedData ? "Waiting for JSON data..." : "No JSON data found or parsed.")}</pre>
                </ResultSection>
            </ResultsArea>
            <InputArea>
                <InputGroup>
                    <ModelInput
                        type="text"
                        placeholder="AI Model (e.g., Gemini-2.5-Flash-Preview)"
                        value={selectedTextGeneratorModel} // Use context model
                        onChange={(e) => setSelectedTextGeneratorModel(e.target.value)} // Use context setter
                        disabled={isGenerating}
                        aria-label="AI Model for Text Generation"
                    />
                    <TextInput
                        type="text"
                        placeholder="Enter your query for structured text..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleSend()}
                        disabled={isGenerating}
                        aria-label="Text generation prompt input"
                    />
                    <SendButton onClick={handleSend}
                                disabled={isGenerating || !inputValue.trim() || !selectedTextGeneratorModel.trim()}> {/* Use context model */}
                        {isGenerating ? <FaSpinner className="fa-spin"/> : <FaPaperPlane/>}
                    </SendButton>
                </InputGroup>
            </InputArea>
        </PageContainer>
    );
};

export default TextGeneratorPage;