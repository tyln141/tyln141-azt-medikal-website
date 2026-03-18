import { NextResponse } from 'next/server';
import { readDoc, writeDoc, DEFAULT_SITE_CONTENT } from '@/lib/firestoreStore';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await readDoc('siteContent', 'main');
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(DEFAULT_SITE_CONTENT);
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(DEFAULT_SITE_CONTENT);
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
