import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabaseClient';

export default function VisitorTracker() {
    const [location] = useLocation();
    const hasLogged = useRef(false);

    useEffect(() => {
        if (hasLogged.current === location) return;

        const track = async () => {
            try {
                // Get basic info
                const userAgent = navigator.userAgent;
                const referrer = document.referrer;

                // Supabase Insert
                await supabase.from('visitors').insert([
                    {
                        page_visited: location,
                        user_agent: userAgent,
                        referrer: referrer
                    }
                ]);

                hasLogged.current = location;
            } catch (e) {
                console.error("Tracking error:", e);
            }
        };

        track();
    }, [location]);

    return null;
}
