import { NextResponse } from 'next/server';
import { readCollection, writeCollection } from '@/lib/jsonStore';

export async function GET() {
    try {
        const data = readCollection('theme', {
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
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read theme' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        writeCollection('theme', body);
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
    }
}
