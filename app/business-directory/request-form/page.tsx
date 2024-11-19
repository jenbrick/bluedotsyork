"use client";

import { useRef, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb'; // Adjust the path as necessary

export default function GoogleForm() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const scrollToTopOnLoad = () => {
            if (iframeRef.current) {
                window.scrollTo({
                    top: iframeRef.current.offsetTop,
                    behavior: 'smooth',
                });
            }
        };

        if (iframeRef.current) {
            iframeRef.current.addEventListener('load', scrollToTopOnLoad);
        }

        return () => {
            if (iframeRef.current) {
                iframeRef.current.removeEventListener('load', scrollToTopOnLoad);
            }
        };
    }, []);

    return (
        <div
            className="form-container"
            style={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
                padding: '20px',
                backgroundColor: 'rgb(236, 244, 254)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Add Breadcrumb */}
            <Breadcrumb />
            <br></br>
            <h1 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Submit Your Details</h1>
            <iframe
                ref={iframeRef}
                src="https://docs.google.com/forms/d/e/1FAIpQLSdSfi7J_ooV-K67ZjWZlIRc4abvbbQ__t_9gtD-vwgK6sk5BQ/viewform?embedded=true"
                style={{
                    border: 'none',
                    width: '100%',
                    maxWidth: '800px',
                    height: '1800px', // Set a static height to avoid cross-origin height issues
                }}
                title="Blue Dots York County - Business/Organization Request Form"
            >
                Loading…
            </iframe>
        </div>
    );
}
