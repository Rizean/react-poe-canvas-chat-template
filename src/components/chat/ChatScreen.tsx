// src/components/chat/ChatScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {FaPaperPlane, FaSpinner} from 'react-icons/fa';
import {useAppContext} from '../../context/AppContext';
import ChatMessageItem from './ChatMessageItem';
import ModelSelector from './ModelSelector';
import LoadingSpinner from '../common/LoadingSpinner'; // Global spinner

const ChatScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: ${({theme}) => theme.body};
    min-width: 0; /* Prevent flexbox overflow issues */
`;

const ChatHistoryArea = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 0; /* Messages will have their own padding */
    background-color: ${({theme}) => theme.body};
`;

const AiThinkingIndicator = styled.div`
    display: flex;
    justify-content: flex-start; /* Align to left like AI messages */
    padding: 0.75rem 1rem; /* Consistent with message padding */
    color: ${({theme}) => theme.text};
    align-items: center;

    svg {
        margin-right: 0.5rem;
        animation: spin 1s linear infinite;
    }
`;

const ChatInputArea = styled.div`
    padding: 1rem;
    background-color: ${({theme}) => theme.inputBg};
    border-top: 1px solid ${({theme}) => theme.border};
    flex-shrink: 0;
`;

const InputGroup = styled.div`
    display: flex;
    width: 100%;
`;

const TextInput = styled.input`
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: ${({theme}) => theme.text};
    background-color: ${({theme}) => theme.inputBg};
    border: 1px solid ${({theme}) => theme.inputBorder};
    border-radius: 0.25rem;
    margin-right: 0.5rem; /* Space before button */
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &::placeholder {
        color: ${({theme}) => theme.inputPlaceholderText};
        opacity: 1;
    }

    &:focus {
        border-color: ${({theme}) => theme.primary};
        outline: 0;
        box-shadow: 0 0 0 0.2rem ${({theme}) => theme.primary}33; /* Primary color with alpha */
    }

    &:disabled {
        background-color: ${({theme}) => theme.secondary}33; /* Lighter background when disabled */
        opacity: 0.7;
    }
`;

const SendButton = styled.button`
    padding: 0.5rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    color: ${({theme}) => theme.buttonPrimaryText};
    background-color: ${({theme}) => theme.buttonPrimaryBg};
    border: 1px solid ${({theme}) => theme.buttonPrimaryBorder};
    border-radius: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;

    &:hover:not(:disabled) {
        background-color: ${({theme}) => theme.primary}E6; /* Darken primary slightly */
        border-color: ${({theme}) => theme.primary}E6;
    }

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
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
    position: relative; /* For dismiss button */

    h5 { /* Alert Heading */
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
        color: inherit;
    }

    p {
        margin-bottom: 0.25rem;
        color: inherit;
    }

    pre {
        font-size: 0.8em;
        background-color: rgba(0, 0, 0, 0.1);
        padding: 0.5em;
        border-radius: 0.2em;
        color: inherit;
    }
`;

const DismissButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    line-height: 1;
    color: inherit;
    opacity: 0.7;
    padding: 0.25rem 0.5rem;

    &:hover {
        opacity: 1;
    }
`;


const ChatScreen: React.FC = () => {
    const {messages, sendChatMessage, isLoading, error, clearError, logger} = useAppContext();
    const [inputValue, setInputValue] = useState('');
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
        logger.debug('ChatScreen: Messages updated, scrolled to bottom.');
    }, [messages, logger]);

    const handleSend = () => {
        if (inputValue.trim()) {
            logger.info('ChatScreen: Sending message:', inputValue);
            sendChatMessage(inputValue.trim());
            setInputValue('');
        } else {
            logger.warn('ChatScreen: Attempted to send empty message.');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <ChatScreenContainer>
            <ModelSelector/>
            {error && (
                <AlertContainer>
                    <DismissButton onClick={clearError} aria-label="Close alert">&times;</DismissButton>
                    <h5>Oh snap! You got an error!</h5>
                    <p>{error.message}</p>
                    {error.details && <small>
                        <pre>{error.details}</pre>
                    </small>}
                </AlertContainer>
            )}
            <ChatHistoryArea ref={chatHistoryRef}>
                {messages.map(msg => (
                    <ChatMessageItem key={msg.id} message={msg}/>
                ))}
                {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                    <AiThinkingIndicator>
                        <FaSpinner/> <span>AI is thinking...</span>
                    </AiThinkingIndicator>
                )}
            </ChatHistoryArea>
            <ChatInputArea>
                <InputGroup>
                    <TextInput
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        aria-label="Chat message input"
                    />
                    <SendButton onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
                        {isLoading && messages[messages.length - 1]?.sender === 'user' ? <FaSpinner className="fa-spin"/> : <FaPaperPlane/>}
                    </SendButton>
                </InputGroup>
            </ChatInputArea>
            {isLoading && <LoadingSpinner/>} {/* Global loading spinner overlay */}
        </ChatScreenContainer>
    );
};

export default ChatScreen;