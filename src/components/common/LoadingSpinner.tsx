// src/components/common/LoadingSpinner.tsx
import React from 'react';
import styled from 'styled-components';

const SpinnerOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({theme}) => theme.loadingSpinnerOverlayBg};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
`;

const SpinnerContainer = styled.div`
    text-align: center;
`;

const StyledSpinner = styled.div`
    width: 3rem;
    height: 3rem;
    border: 0.3em solid transparent;
    border-top-color: ${({theme}) => theme.loadingSpinnerColor};
    border-right-color: ${({theme}) => theme.loadingSpinnerColor};
    border-radius: 50%;
    animation: spin 0.8s ease infinite; /* Using global keyframes */
`;

const SpinnerText = styled.p`
    margin-top: 0.75rem;
    color: ${({theme}) => theme.loadingSpinnerTextColor};
    font-size: 1rem;
`;

const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

const LoadingSpinner: React.FC<{ message?: string }> = ({message = "Loading..."}) => {
    return (
        <SpinnerOverlay>
            <SpinnerContainer>
                <StyledSpinner role="status">
                    <VisuallyHidden>Loading...</VisuallyHidden>
                </StyledSpinner>
                <SpinnerText>{message}</SpinnerText>
            </SpinnerContainer>
        </SpinnerOverlay>
    );
};

export default LoadingSpinner;