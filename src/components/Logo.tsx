"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppProvider';

export default function Logo() {
    const { siteSettings } = useAppContext();
    const [hasError, setHasError] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <Link href="/" className="flex items-center gap-3 group">
            {siteSettings?.logo && !hasError ? (
                <img 
                    src={siteSettings.logo} 
                    alt="AZT Logo" 
                    className="h-10 w-auto object-contain" 
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="AZT" className="h-8 w-auto" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <span className="font-bold text-xl tracking-tight text-dark group-hover:text-primary transition-colors">
                        AZT <span className="text-primary font-medium group-hover:text-dark">Medikal</span>
                    </span>
                </div>
            )}
        </Link>
    );
}
