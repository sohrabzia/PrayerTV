import { useState, useEffect } from 'react';

export const useCurrentTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000); // Update every second to keep sync

        return () => clearInterval(timer);
    }, []);

    // Format: 10:09 PM
    const formattedTime = time.toLocaleTimeString([], {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return { time, formattedTime };
};
