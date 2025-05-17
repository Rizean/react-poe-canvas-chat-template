// src/styles/theme.ts
export interface Theme {
    body: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    sidebarBg: string;
    sidebarText: string;
    sidebarLinkHoverBg: string;
    sidebarLinkActiveBg: string;
    sidebarLinkActiveText: string;
    headerBg: string;
    headerText: string;
    footerBg: string;
    footerText: string;
    inputBg: string;
    inputBorder: string;
    inputPlaceholderText: string;
    link: string;
    cardBg: string;
    chatUserMessageBg: string;
    chatUserMessageText: string;
    chatAiMessageBg: string;
    chatAiMessageText: string;
    chatHrColor: string;
    buttonPrimaryBg: string;
    buttonPrimaryText: string;
    buttonPrimaryBorder: string;
    buttonIconHoverBg: string;
    alertDangerBg: string;
    alertDangerText: string;
    alertDangerBorder: string;
    modelSelectorBg: string;
    modelSelectorBorder: string;
    modelSelectorText: string;
    modelSelectorOptionBg: string;
    loadingSpinnerOverlayBg: string;
    loadingSpinnerColor: string;
    loadingSpinnerTextColor: string;

    // Dimensions
    sidebarWidth: string;
    sidebarWidthCollapsed: string;
    headerHeight: string;
}

export const lightTheme: Theme = {
    body: '#e9ecef', // Main page background - light grey
    text: '#343a40', // Darker grey text for good contrast
    primary: '#0d6efd',
    secondary: '#5c677d', // Slightly desaturated secondary
    border: '#ced4da', // Standard border

    sidebarBg: '#f8f9fa', // Light sidebar background
    sidebarText: '#343a40', // Dark text for light sidebar
    sidebarLinkHoverBg: '#e2e6ea', // Hover for light sidebar
    sidebarLinkActiveBg: '#0d6efd', // primary color
    sidebarLinkActiveText: '#ffffff', // White text on primary active link

    headerBg: '#ffffff', // Header slightly brighter than page
    headerText: '#343a40',
    footerBg: '#ffffff', // Footer same as header
    footerText: '#5c677d',

    inputBg: '#ffffff',
    inputBorder: '#ced4da',
    inputPlaceholderText: '#6c757d',
    link: '#0d6efd', // primary color
    cardBg: '#ffffff', // Cards/Containers like HomePage

    chatUserMessageBg: '#d1e7ff', // Softer blue for user messages
    chatUserMessageText: '#0a3622', // Darker text for contrast on soft blue
    chatAiMessageBg: '#f8f9fa', // Light grey for AI messages
    chatAiMessageText: '#212529',
    chatHrColor: '#dee2e6', // Lighter HR

    buttonPrimaryBg: '#0d6efd',
    buttonPrimaryText: '#ffffff',
    buttonPrimaryBorder: '#0d6efd',
    buttonIconHoverBg: 'rgba(0,0,0,0.07)',

    alertDangerBg: '#f8d7da',
    alertDangerText: '#721c24',
    alertDangerBorder: '#f5c6cb',

    modelSelectorBg: '#ffffff',
    modelSelectorBorder: '#ced4da',
    modelSelectorText: '#343a40',
    modelSelectorOptionBg: '#ffffff',

    loadingSpinnerOverlayBg: 'rgba(0, 0, 0, 0.5)',
    loadingSpinnerColor: '#0d6efd',
    loadingSpinnerTextColor: '#e9ecef', // Same as body for light theme spinner text

    sidebarWidth: '250px',
    sidebarWidthCollapsed: '60px',
    headerHeight: '56px',
};

export const darkTheme: Theme = {
    body: '#121212',
    text: '#e0e0e0',
    primary: '#4dabf7', // A lighter blue for dark mode
    secondary: '#adb5bd',
    border: '#343a40',

    sidebarBg: '#1c1c1c', // Dark sidebar background
    sidebarText: '#e0e0e0', // Light text for dark sidebar
    sidebarLinkHoverBg: '#2c2c2c',
    sidebarLinkActiveBg: '#4dabf7', // primary color for dark mode
    sidebarLinkActiveText: '#000000', // Dark text on active link

    headerBg: '#1c1c1c',
    headerText: '#e0e0e0',
    footerBg: '#1c1c1c',
    footerText: '#adb5bd',

    inputBg: '#2c2c2c',
    inputBorder: '#495057',
    inputPlaceholderText: '#6c757d', // Often kept similar or slightly lighter in dark themes
    link: '#4dabf7', // primary color for dark mode
    cardBg: '#1e1e1e',

    chatUserMessageBg: '#0b2e4d', // Darker, distinct blue
    chatUserMessageText: '#e0e0e0',
    chatAiMessageBg: '#232323', // Very dark grey for AI messages
    chatAiMessageText: '#e0e0e0',
    chatHrColor: '#495057',

    buttonPrimaryBg: '#4dabf7',
    buttonPrimaryText: '#000000',
    buttonPrimaryBorder: '#4dabf7',
    buttonIconHoverBg: 'rgba(255,255,255,0.07)',

    alertDangerBg: '#521822', // Darker red tones
    alertDangerText: '#f8d7da',
    alertDangerBorder: '#842029',

    modelSelectorBg: '#2c2c2c',
    modelSelectorBorder: '#495057',
    modelSelectorText: '#e0e0e0',
    modelSelectorOptionBg: '#2c2c2c',

    loadingSpinnerOverlayBg: 'rgba(255, 255, 255, 0.1)',
    loadingSpinnerColor: '#4dabf7',
    loadingSpinnerTextColor: '#e0e0e0', // Same as text for dark theme spinner text

    sidebarWidth: '250px',
    sidebarWidthCollapsed: '60px',
    headerHeight: '56px',
};