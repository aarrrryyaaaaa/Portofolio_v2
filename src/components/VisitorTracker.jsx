import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function VisitorTracker() {
    const [location] = useLocation();

    useEffect(() => {
        // Call PHP backend
        const track = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const apiKey = import.meta.env.VITE_API_KEY || '';

                await fetch(`${apiUrl}/track_visitor.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': apiKey
                    },
                    body: JSON.stringify({ page: location }),
                });
            } catch (e) {
                console.error("Tracking failed", e);
            }
        };

        track();
    }, [location]);

    return null;
}
