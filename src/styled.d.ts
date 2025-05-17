// src/styled.d.ts
import 'styled-components';
import { Theme as CustomTheme } from './styles/theme'; // Adjust path if your theme.ts is elsewhere

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends CustomTheme {}
}