import { NextResponse } from 'next/server';
import { readDoc, writeDoc } from '@/lib/firestoreStore';

export const dynamic = 'force-dynamic';

const DEFAULT_CONTENT = {
    home: [],
    about: [],
    why_us: [],
    footer: []
};

export async function GET() {
    try {
        const data = await readDoc('siteContent', 'main', DEFAULT_CONTENT);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(DEFAULT_CONTENT);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await writeDoc('siteContent', 'main', data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
