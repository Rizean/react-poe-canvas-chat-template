// src/App.tsx
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import TextGeneratorPage from './pages/TextGeneratorPage';
import MediaGeneratorPage from './pages/MediaGeneratorPage';
import { useAppContext } from './context/AppContext';

// Define Page types for navigation state
export type PageName = 'home' | 'chat' | 'textGenerator' | 'mediaGenerator'; // Added new page names

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
    height: 100%; /* Ensure it takes full height from #root */
    background-color: ${({ theme }) => theme.body};
`;

const AppWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    height: calc(100% - ${({ theme }) => theme.headerHeight});
`;

const ContentWrapper = styled.main`
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.body};
    min-width: 0;
`;

const MainContentArea = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
`;

const SidebarOverlay = styled.div`
    position: fixed;
    top: ${({ theme }) => theme.headerHeight};
    left: 0;
    width: 100%;
    height: calc(100% - ${({ theme }) => theme.headerHeight});
    background-color: rgba(0,0,0,0.5);
    z-index: 1039;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    &.active {
        opacity: 1;
        visibility: visible;
    }
`;

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState<PageName>('home');
    const { logger } = useAppContext();


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        logger.debug(`App: Sidebar toggled to ${!isSidebarOpen ? 'open' : 'closed'}.`);
    };

    const navigateTo = useCallback((page: PageName) => {
        setCurrentPage(page);
        logger.info(`App: Navigated to ${page} page.`);
    }, [logger]);

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigateTo={navigateTo} />;
            case 'chat':
                return <ChatPage />;
            case 'textGenerator': // Added
                return <TextGeneratorPage />;
            case 'mediaGenerator': // Added
                return <MediaGeneratorPage />;
            default:
                logger.warn(`App: Unknown page "${currentPage}", defaulting to home.`);
                return <HomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <AppContainer>
            <Header toggleSidebar={toggleSidebar} navigateTo={navigateTo} />
            <AppWrapper>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} navigateTo={navigateTo} currentPage={currentPage} />
                {isSidebarOpen && (
                    <SidebarOverlay className="active" onClick={toggleSidebar} />
                )}
                <ContentWrapper>
                    <MainContentArea>
                        {renderPage()}
                    </MainContentArea>
                </ContentWrapper>
            </AppWrapper>
            <Footer />
        </AppContainer>
    );
}

export default App;