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
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
`;

const SelectorLabel = styled.label`
    margin-right: 0.5rem;
    margin-bottom: 0; /* Reset margin for flex alignment */
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
    flex-grow: 1; /* Allow input to take available space */
    min-width: 150px; /* Minimum width before shrinking too much */
    max-width: 300px; /* Max width */
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
        outline: 0;
        box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.primary}33; /* Primary color with alpha */
    }

    @media (max-width: 768px) {
        max-width: 200px;
        margin-bottom: 0.5rem; /* Add some space if it wraps */
    }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    margin-left: 0; /* Align left if wrapped */
    margin-top: 0.5rem; /* Space from input if wrapped */
    width: 100%; /* Take full width if wrapped */
  }
`;

const StyledCheckbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
  /* Custom styling for checkbox can be added here if needed */
  width: 1rem;
  height: 1rem;
`;

const CheckboxLabel = styled.label`
  color: ${({ theme }) => theme.modelSelectorText};
  font-size: 0.9rem;
  margin-bottom: 0;
  cursor: pointer;
  user-select: none; /* Prevent text selection on click */
`;

const ModelSelector: React.FC = () => {
    const {
        selectedModel,
        setSelectedModel,
        filterGeminiThinking,
        setFilterGeminiThinking,
    } = useAppContext();

    const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const modelName = event.target.value;
        setSelectedModel(modelName);
        // Logger message is now in AppContext's setSelectedModel
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setFilterGeminiThinking(isChecked);
        // Logger message is now in AppContext's setFilterGeminiThinking
    };

    return (
        <SelectorBar>
            <SelectorLabel htmlFor="aiModelInput">AI Model:</SelectorLabel>
            <StyledInput
                type="text"
                id="aiModelInput"
                value={selectedModel}
                onChange={handleModelChange}
                placeholder="Enter AI model name (e.g., Gemini-2.5-Pro-Exp)"
                aria-label="AI Model Name Input"
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