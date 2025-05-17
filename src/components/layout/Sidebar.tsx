// src/components/layout/Sidebar.tsx
import styled, { css } from 'styled-components';
import { FaHome, FaRocketchat } from 'react-icons/fa';
import type { PageName } from '../../App';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    navigateTo: (page: PageName) => void;
    currentPage: PageName;
}

interface SidebarWrapperProps {
    $isOpen: boolean;
}

const SidebarWrapper = styled.aside<SidebarWrapperProps>`
    background-color: ${({theme}) => theme.sidebarBg};
    color: ${({theme}) => theme.sidebarText};
    transition: transform 0.3s ease, width 0.3s ease; // Keep width transition if using collapsed width
    flex-shrink: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 1rem;

    position: fixed; // Always fixed for overlay-style behavior
    left: 0;
    top: ${({theme}) => theme.headerHeight};
    height: calc(100% - ${({theme}) => theme.headerHeight});
    z-index: 1040;
    width: ${({theme}) => theme.sidebarWidth};
    transform: ${({$isOpen}) => $isOpen ? 'translateX(0)' : 'translateX(-100%)'};
`;

const NavList = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 0 0.5rem;
`;

interface StyledNavButtonProps {
    $isActive: boolean;
    $isSidebarOpen?: boolean; // To control text display
}

// Changed from NavLink to a button or div
const StyledNavButton = styled.button<StyledNavButtonProps>`
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 100%; // Make it take full width for click area
    text-align: left; // Align text to left

    color: ${({ theme }) => theme.sidebarText};
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-decoration: none;
    margin-bottom: 0.25rem;

    &:hover {
        background-color: ${({ theme }) => theme.sidebarLinkHoverBg};
        color: ${({ theme }) => theme.sidebarText};
        text-decoration: none;
    }

    ${({ $isActive, theme }) =>
            $isActive &&
            css`
            background-color: ${theme.sidebarLinkActiveBg};
            color: ${theme.sidebarLinkActiveText};
            font-weight: bold;
        `}

    svg {
        flex-shrink: 0;
        font-size: 18px;
        margin-right: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '0.75rem' : '0')};
        transition: margin-right 0.3s ease;
    }

    span {
        opacity: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 1 : 0)};
        visibility: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 'visible' : 'hidden')};
        transition: opacity 0.2s ease, visibility 0.2s ease;
        display: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 'inline' : 'none')};
    }

    /* Center icon when collapsed (if sidebarWidthCollapsed is used and $isSidebarOpen is false) */
    ${({ $isSidebarOpen, theme }) =>
            !$isSidebarOpen &&
            css`
            justify-content: center;
            /* This padding logic might need adjustment if not using sidebarWidthCollapsed for this mode */
            /* padding: 0.75rem ${parseInt(theme.sidebarWidthCollapsed) / 2 - 18 / 2}px; */
        `}
`;


function Sidebar({ isOpen, toggleSidebar, navigateTo, currentPage }: SidebarProps) {
    const handleLinkClick = (page: PageName) => {
        navigateTo(page);
        if (isOpen) {
            toggleSidebar();
        }
    };

    const showText = isOpen;

    return (
        <SidebarWrapper $isOpen={isOpen}>
            <NavList>
                <StyledNavButton
                    onClick={() => handleLinkClick('home')}
                    $isActive={currentPage === 'home'}
                    $isSidebarOpen={showText}
                    aria-label="Go to Home page"
                >
                    <FaHome />
                    <span>Home</span>
                </StyledNavButton>
                <StyledNavButton
                    onClick={() => handleLinkClick('chat')}
                    $isActive={currentPage === 'chat'}
                    $isSidebarOpen={showText}
                    aria-label="Go to Chat page"
                >
                    <FaRocketchat />
                    <span>Chat</span>
                </StyledNavButton>
            </NavList>
        </SidebarWrapper>
    );
}

export default Sidebar;