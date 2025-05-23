// src/pages/MediaGeneratorPage.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {FaFileUpload, FaPaperPlane, FaSpinner} from 'react-icons/fa';
import {type MediaRequestCallback, type PoeMessageAttachment, usePoeAiMediaGenerator} from '@rizean/poe-canvas-utils';
import {useAppContext} from '../context/AppContext';


const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: ${({theme}) => theme.body};
    min-width: 0;
`;

const MediaDisplayArea = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: ${({theme}) => theme.body};
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
`;

const MediaItem = styled.div`
    background-color: ${({theme}) => theme.cardBg};
    border: 1px solid ${({theme}) => theme.border};
    border-radius: 0.25rem;
    padding: 0.5rem;
    width: clamp(150px, 30%, 300px);
    display: flex;
    flex-direction: column;
    align-items: center;

    img, video, audio {
        max-width: 100%;
        max-height: 250px;
        border-radius: 0.125rem;
        object-fit: contain;
    }

    p {
        font-size: 0.8rem;
        color: ${({theme}) => theme.secondary};
        margin-top: 0.5rem;
        text-align: center;
        word-break: break-all;
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
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
`;

const PromptRow = styled.div`
    display: flex;
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
    width: 200px;
`;

const FileInputLabel = styled.label`
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: ${({theme}) => theme.buttonPrimaryText};
    background-color: ${({theme}) => theme.secondary};
    border: 1px solid ${({theme}) => theme.secondary};
    border-radius: 0.25rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.15s ease-in-out;

    &:hover {
        background-color: ${({theme}) => theme.secondary}E6;
    }

    input[type="file"] {
        display: none;
    }
`;

const FileInfo = styled.span`
    font-size: 0.85rem;
    color: ${({theme}) => theme.secondary};
    margin-left: 0.5rem;
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

const MediaGeneratorPage: React.FC = () => {
    const {
        logger,
        error: globalError,
        clearError: clearGlobalError,
        selectedMediaGeneratorModel, // Use from context
        setSelectedMediaGeneratorModel, // Use from context
    } = useAppContext();

    const [sendMediaPrompt] = usePoeAiMediaGenerator({logger, simulation: !window.Poe});

    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [attachments, setAttachments] = useState<PoeMessageAttachment[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [inputFiles, setInputFiles] = useState<File[]>([]);

    const mediaDisplayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mediaDisplayRef.current && attachments.length > 0) {
            mediaDisplayRef.current.scrollTop = mediaDisplayRef.current.scrollHeight;
        }
    }, [attachments]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setInputFiles(Array.from(event.target.files));
            logger.info(`${event.target.files.length} file(s) selected.`);
        }
    };

    const handleSend = useCallback(() => {
        if (!inputValue.trim() || !selectedMediaGeneratorModel.trim()) { // Use context model
            setErrorMessage("Prompt and AI Model name cannot be empty.");
            return;
        }
        logger.info(`Sending media prompt to ${selectedMediaGeneratorModel} with ${inputFiles.length} files:`, inputValue); // Use context model
        setIsGenerating(true);
        setAttachments([]);
        setErrorMessage(null);
        if (globalError) clearGlobalError();

        const prompt = `${selectedMediaGeneratorModel.startsWith('@') ? '' : '@'}${selectedMediaGeneratorModel} ${inputValue}`; // Use context model

        const callback: MediaRequestCallback = (state) => {
            setIsGenerating(state.generating);

            if (state.error) {
                logger.error("Media generation error:", state.error);
                setErrorMessage(state.error);
            } else {
                setErrorMessage(null);
            }

            if (state.mediaAttachments.length > 0) {
                setAttachments(state.mediaAttachments);
            }

            if (!state.generating) {
                logger.info("Media generation complete.");
            }
        };

        sendMediaPrompt(prompt, callback, {attachments: inputFiles});

    }, [inputValue, selectedMediaGeneratorModel, sendMediaPrompt, inputFiles, logger, globalError, clearGlobalError]); // Use context model

    return (
        <PageContainer>
            {errorMessage && <AlertContainer>Error: {errorMessage}</AlertContainer>}
            {globalError && <AlertContainer>Global Error: {globalError.message} {globalError.details && `- ${globalError.details}`}</AlertContainer>}
            <MediaDisplayArea ref={mediaDisplayRef}>
                {isGenerating && attachments.length === 0 && <p>Generating media...</p>}
                {attachments.map(att => (
                    <MediaItem key={att.attachmentId}>
                        {att.mimeType.startsWith('image/') && <img src={att.url} alt={att.name}/>}
                        {att.mimeType.startsWith('video/') && <video src={att.url} controls/>}
                        {att.mimeType.startsWith('audio/') && <audio src={att.url} controls/>}
                        <p>{att.name} ({att.mimeType})</p>
                    </MediaItem>
                ))}
                {!isGenerating && attachments.length === 0 && !errorMessage && <p>No media generated yet. Enter a prompt below.</p>}
            </MediaDisplayArea>
            <InputArea>
                <InputGroup>
                    <PromptRow>
                        <ModelInput
                            type="text"
                            placeholder="AI Model (e.g., FLUX-schnell)"
                            value={selectedMediaGeneratorModel} // Use context model
                            onChange={(e) => setSelectedMediaGeneratorModel(e.target.value)} // Use context setter
                            disabled={isGenerating}
                            aria-label="AI Model for Media Generation"
                        />
                        <TextInput
                            type="text"
                            placeholder="Enter your media generation prompt..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleSend()}
                            disabled={isGenerating}
                            aria-label="Media generation prompt input"
                        />
                        <SendButton onClick={handleSend}
                                    disabled={isGenerating || !inputValue.trim() || !selectedMediaGeneratorModel.trim()}> {/* Use context model */}
                            {isGenerating ? <FaSpinner className="fa-spin"/> : <FaPaperPlane/>}
                        </SendButton>
                    </PromptRow>
                    <PromptRow>
                        <FileInputLabel htmlFor="file-upload">
                            <FaFileUpload/> Attach Files ({inputFiles.length})
                            <input id="file-upload" type="file" multiple onChange={handleFileChange} disabled={isGenerating}/>
                        </FileInputLabel>
                        {inputFiles.length > 0 && (
                            <FileInfo>
                                {inputFiles.map(f => f.name).join(', ')}
                            </FileInfo>
                        )}
                    </PromptRow>
                </InputGroup>
            </InputArea>
        </PageContainer>
    );
};

export default MediaGeneratorPage;