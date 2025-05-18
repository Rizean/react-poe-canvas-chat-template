// src/pages/ChatPage.tsx
import React from 'react';
import styled from 'styled-components';
import ChatScreen from '../components/chat/ChatScreen';

// This container ensures ChatScreen can take full height
const ChatPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Take available vertical space */
    height: 100%; /* Ensure it fills its parent in MainContentArea */
    min-width: 0;
`;

const ChatPage: React.FC = () => {
    return (
        <ChatPageWrapper>
            <ChatScreen/>
        </ChatPageWrapper>
    );
};

export default ChatPage;