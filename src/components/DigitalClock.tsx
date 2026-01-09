import React from 'react';
import { Text } from 'react-native';
import { useCurrentTime } from '../hooks/useCurrentTime';

const DigitalClockComponent: React.FC = () => {
    const { formattedTime } = useCurrentTime();
    
    return (
        <Text
            style={{
                fontSize: 48,
                fontWeight: '200',
                letterSpacing: 2,
                color: 'rgba(255,255,255,0.95)',
            }}
        >
            {formattedTime}
        </Text>
    );
};

export const DigitalClock = React.memo(DigitalClockComponent);
