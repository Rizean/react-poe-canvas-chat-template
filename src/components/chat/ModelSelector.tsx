// src/components/chat/ModelSelector.tsx
import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContext';

const SelectorBar = styled.div`
    padding: 0.75rem 1rem;
    background-color: ${({ theme }) => theme.modelSelectorBg};
    border-bottom: 1px solid ${({ theme }) => theme.modelSelectorBorder};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;

const SelectorLabel = styled.label`
    margin-right: 0.5rem;
    margin-bottom: 0;
    font-weight: bold;
    color: ${({ theme }) => theme.modelSelectorText};
    white-space: nowrap;
`;

const StyledInput = styled.input`
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.modelSelectorText};
    background-color: ${({ theme }) => theme.modelSelectorBg};
    border: 1px solid ${({ theme }) => theme.modelSelectorBorder};
    border-radius: 0.25rem;
    flex-grow: 1;
    min-width: 150px;
    max-width: 300px;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
        outline: 0;
        box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.primary}33;
    }

    @media (max-width: 768px) {
        max-width: 200px;
        margin-bottom: 0.5rem;
    }
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;
    white-space: nowrap;

    @media (max-width: 768px) {
        margin-left: 0;
        margin-top: 0.5rem;
        width: 100%;
    }
`;

const StyledCheckbox = styled.input`
    margin-right: 0.5rem;
    cursor: pointer;
    width: 1rem;
    height: 1rem;
`;

const CheckboxLabel = styled.label`
    color: ${({ theme }) => theme.modelSelectorText};
    font-size: 0.9rem;
    margin-bottom: 0;
    cursor: pointer;
    user-select: none;
`;

const ModelSelector: React.FC = () => {
    const {
        selectedChatModel, // Renamed
        setSelectedChatModel, // Renamed
        filterGeminiThinking,
        setFilterGeminiThinking,
    } = useAppContext();

    const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const modelName = event.target.value;
        setSelectedChatModel(modelName); // Use renamed setter
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setFilterGeminiThinking(isChecked);
    };

    return (
        <SelectorBar>
            <SelectorLabel htmlFor="aiModelInput">AI Model (Basic Chat):</SelectorLabel>
            <StyledInput
                type="text"
                id="aiModelInput"
                value={selectedChatModel} // Use renamed state variable
                onChange={handleModelChange}
                placeholder="Enter AI model name (e.g., Gemini-2.5-Pro-Exp)"
                aria-label="AI Model Name Input for Basic Chat"
            />
            <CheckboxWrapper>
                <StyledCheckbox
                    type="checkbox"
                    id="filterGeminiCheckbox"
                    checked={filterGeminiThinking}
                    onChange={handleFilterChange}
                />
                <CheckboxLabel htmlFor="filterGeminiCheckbox">
                    Filter Gemini Thinking
                </CheckboxLabel>
            </CheckboxWrapper>
        </SelectorBar>
    );
};

export default ModelSelector;