// src/components/layout/Header.tsx
import styled from 'styled-components';
import { FaComments, FaBars, FaSun, FaMoon, FaSave, FaFolderOpen } from 'react-icons/fa';
import { useCustomTheme } from '../../context/ThemeContext';
import type { PageName } from '../../App';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
    toggleSidebar: () => void;
    navigateTo: (page: PageName) => void;
}

const HeaderWrapper = styled.header`
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: ${({ theme }) => theme.headerHeight};
    background-color: ${({ theme }) => theme.headerBg};
    color: ${({ theme }) => theme.headerText};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    position: sticky;
    top: 0;
    z-index: 1030;
    flex-shrink: 0;
`;

const BrandContainer = styled.div`
    font-weight: bold;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.headerText};
    display: flex;
    align-items: center;
    margin-right: 1rem;
    cursor: pointer;
    &:hover {
        text-decoration: none;
        color: ${({ theme }) => theme.primary};
    }
    svg {
        margin-right: 0.5rem;
    }
`;

const ToggleButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.headerText};
    padding: 0.5rem;
    margin-right: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;

    &:hover {
        background-color: ${({ theme }) => theme.buttonIconHoverBg};
    }

    svg {
        font-size: 20px;
    }
`;

const NavControls = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
`;


function Header({ toggleSidebar, navigateTo }: HeaderProps) {
    const { themeMode, toggleTheme } = useCustomTheme();
    const { saveAppSettings, loadAppSettings, logger } = useAppContext();

    const handleSave = () => {
        logger.info("Header: Save App Settings button clicked.");
        saveAppSettings();
    };

    const handleLoad = () => {
        logger.info("Header: Load App Settings button clicked.");
        loadAppSettings();
    };

    return (
        <HeaderWrapper>
            <ToggleButton onClick={toggleSidebar} aria-label="Toggle sidebar">
                <FaBars />
            </ToggleButton>
            <BrandContainer onClick={() => navigateTo('home')} role="button" tabIndex={0}>
                <FaComments />
                Chat App
            </BrandContainer>
            <NavControls>
                <ToggleButton
                    onClick={handleSave}
                    aria-label="Save application settings"
                >
                    <FaSave />
                </ToggleButton>
                <ToggleButton
                    onClick={handleLoad}
                    aria-label="Load application settings"
                >
                    <FaFolderOpen />
                </ToggleButton>
                {/* THIS IS THE IMPORTANT PART - Ensure onClick is toggleTheme */}
                <ToggleButton
                    onClick={toggleTheme}
                    aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {themeMode === 'dark' ? <FaSun /> : <FaMoon />}
                </ToggleButton>
            </NavControls>
        </HeaderWrapper>
    );
}

export default Header;