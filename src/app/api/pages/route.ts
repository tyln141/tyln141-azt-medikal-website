import { NextResponse } from 'next/server';
import { readDoc, writeDoc } from '@/lib/firestoreStore';

export async function GET() {
    try {
        const data = await readDoc('settings', 'pages', {});
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({});
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await writeDoc('settings', 'pages', data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
