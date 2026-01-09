import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
    h1: { fontSize: 48, fontWeight: '700', lineHeight: 56, fontFamily: 'System' },
    h2: { fontSize: 32, fontWeight: '600', lineHeight: 40, fontFamily: 'System' },
    timeLarge: { fontSize: 72, fontWeight: '300', lineHeight: 80, fontFamily: 'System' },
    body: { fontSize: 24, fontWeight: '400', lineHeight: 32, fontFamily: 'System' },
    label: { fontSize: 20, fontWeight: '500', lineHeight: 28, fontFamily: 'System' },
    caption: { fontSize: 16, fontWeight: '400', lineHeight: 24, fontFamily: 'System' },
};
