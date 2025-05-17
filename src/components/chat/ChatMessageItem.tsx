// src/components/chat/ChatMessageItem.tsx
import React from 'react';
import styled from 'styled-components';
import type {Message} from '../../types/app';
import {parseMarkdown} from '../../utils/markdownParser';
import {FaExclamationCircle} from 'react-icons/fa';
import {useAppContext} from "../../context/AppContext.tsx";

interface MessageWrapperProps {
    $isUser: boolean;
}

const MessageEntryWrapper = styled.div`
    /* No specific styles needed here if hr is full width */
`;

const MessageContentWrapper = styled.div<MessageWrapperProps>`
    padding: 0.75rem 1rem;
    width: 100%;
    background-color: ${({theme, $isUser}) => $isUser ? theme.chatUserMessageBg : theme.chatAiMessageBg};
    color: ${({theme, $isUser}) => $isUser ? theme.chatUserMessageText : theme.chatAiMessageText};

    a {
        color: ${({theme}) => theme.link};
    }
`;

const MessageMeta = styled.div`
    font-size: 0.75rem;
    color: ${({theme}) => theme.secondary};
    margin-bottom: 0.25rem;
    display: flex;
    justify-content: space-between;
`;

const SenderName = styled.span`
    font-weight: bold;
`;

const Timestamp = styled.span`
    /* Floated by flex justify-content: space-between on MessageMeta */
`;

const MessageText = styled.div`
    word-wrap: break-word;

    p:last-child {
        margin-bottom: 0;
    }

    /* Styles for code blocks if markdownParser generates them */

    pre {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 0.5rem;
        border-radius: 0.25rem;
        overflow-x: auto;
        color: inherit; /* Ensure text color is appropriate for the message background */
    }

    code {
        font-family: monospace;
        background-color: rgba(0, 0, 0, 0.04);
        padding: 0.1em 0.3em;
        border-radius: 0.2rem;
    }
`;

const StreamingIndicator = styled.span`
    color: ${({theme}) => theme.secondary};
    font-size: 0.8em;
`;

const ErrorMessage = styled.div`
    color: ${({theme}) => theme.alertDangerText};
    background-color: ${({theme}) => theme.alertDangerBg};
    border: 1px solid ${({theme}) => theme.alertDangerBorder};
    font-size: 0.8em;
    margin-top: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;

    svg {
        margin-right: 0.25rem;
    }
`;

const MessageSeparator = styled.hr`
    border: none;
    height: 1px;
    background-color: ${({theme}) => theme.chatHrColor};
    margin: 0;
`;

const ChatMessageItem: React.FC<{ message: Message }> = ({message}) => {
    const {logger} = useAppContext();
    const isUser = message.sender === 'user';
    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const contentHtml = parseMarkdown(message.text, logger);

    return (
        <MessageEntryWrapper>
            <MessageContentWrapper $isUser={isUser}>
                <MessageMeta>
                    <SenderName>{isUser ? 'You' : 'AI'}</SenderName>
                    <Timestamp>{formattedTime}</Timestamp>
                </MessageMeta>
                <MessageText dangerouslySetInnerHTML={{__html: contentHtml}}/>
                {message.isStreaming && !isUser && (
                    <StreamingIndicator> (streaming...)</StreamingIndicator>
                )}
                {message.error && (
                    <ErrorMessage>
                        <FaExclamationCircle/> {message.error}
                    </ErrorMessage>
                )}
            </MessageContentWrapper>
            <MessageSeparator/>
        </MessageEntryWrapper>
    );
};

export default ChatMessageItem;