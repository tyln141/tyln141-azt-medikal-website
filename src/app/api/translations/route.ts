import { NextResponse } from 'next/server';
import { readDoc, writeDoc } from '@/lib/firestoreStore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'tr';
    
    try {
        const data = await readDoc('translations', lang, {});
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({});
    }
}

export async function POST(request: Request) {
    try {
        const { lang, data } = await request.json();
        if (!lang) return NextResponse.json({ success: false, error: 'Language missing' }, { status: 400 });

        await writeDoc('translations', lang, data);
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
