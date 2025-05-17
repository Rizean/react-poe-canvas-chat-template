// src/components/layout/Footer.tsx
import styled from 'styled-components';

const FooterWrapper = styled.footer`
    padding: 0.75rem 1rem; /* Reduced padding */
    margin-top: auto; /* Pushes footer to bottom if content is short */
    text-align: center;
    background-color: ${({ theme }) => theme.footerBg};
    color: ${({ theme }) => theme.footerText};
    border-top: 1px solid ${({ theme }) => theme.border};
    flex-shrink: 0; /* Prevent footer from shrinking */
`;

const FooterText = styled.small`
    color: ${({ theme }) => theme.footerText};
`;

function Footer() {
    return (
        <FooterWrapper>
            <FooterText>
                Chat App Template
            </FooterText>
        </FooterWrapper>
    );
}

export default Footer;