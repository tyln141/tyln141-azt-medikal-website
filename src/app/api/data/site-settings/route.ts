import { NextResponse } from 'next/server';
import { readDoc, writeDoc } from '@/lib/firestoreStore';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
    primaryColor: "#0A6CFF",
    backgroundColor: "#ffffff",
    font: "Inter",
    logo: "/logo.png"
};

export async function GET() {
    try {
        const data = await readDoc('settings', 'site', DEFAULT_SETTINGS);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await writeDoc('settings', 'site', data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
