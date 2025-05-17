// src/pages/HomePage.tsx
import React from 'react';
import styled from 'styled-components';
import type { PageName } from '../App';

const HomePageContainer = styled.div`
    margin: 2rem;
    padding: 2rem;
    background-color: ${({ theme }) => theme.cardBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 0.375rem;
    text-align: center;

    h1 {
        color: ${({ theme }) => theme.text};
        margin-bottom: 1rem;
    }

    p {
        color: ${({ theme }) => theme.text};
        margin-bottom: 1rem;
        line-height: 1.6;
    }
`;

const ThemedHr = styled.hr`
    border: 0;
    border-top: 1px solid ${({ theme }) => theme.border};
    margin: 1.5rem 0;
`;

const GoToChatButton = styled.button`
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    color: ${({theme}) => theme.buttonPrimaryText};
    background-color: ${({theme}) => theme.buttonPrimaryBg};
    border: 1px solid ${({theme}) => theme.buttonPrimaryBorder};
    border-radius: 8px;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;

    &:hover {
        background-color: ${({theme}) => theme.primary}E6;
        border-color: ${({theme}) => theme.primary}E6;
    }
`;

interface HomePageProps {
    navigateTo: (page: PageName) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
    const handleGoToChat = () => {
        navigateTo('chat');
    };

    return (
        <HomePageContainer>
            <h1>Welcome to the Poe.com Canvas Chat App Template!</h1>
            <p>
                This is a simple chat application template built with React, TypeScript,
                and fully styled with Styled Components.
            </p>
            <ThemedHr />
            <p>
                Navigate to the chat page to start interacting with the AI.
            </p>
            <p>
                <GoToChatButton onClick={handleGoToChat}>Go to Chat</GoToChatButton>
            </p>
        </HomePageContainer>
    );
};

export default HomePage;