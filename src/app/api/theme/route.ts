import { NextResponse } from 'next/server';
import { readDoc, writeDoc } from '@/lib/firestoreStore';

const DEFAULT_THEME = {
    primaryColor: '#0EA5E9',
    backgroundColor: '#F8FAFC',
    fontFamily: 'Inter',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    buttonStyles: {
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem'
    }
};

export async function GET() {
    try {
        const data = await readDoc('settings', 'theme', DEFAULT_THEME);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(DEFAULT_THEME);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await writeDoc('settings', 'theme', data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
