import { NextResponse } from 'next/server';
import { readDoc, writeDoc } from '@/lib/firestoreStore';

const DEFAULT_CONTENT = {
    about: { 
        title: { tr: "Hakkımızda", en: "About Us" }, 
        description: { tr: "", en: "" }, 
        stats: [], 
        image: "" 
    },
    whyUs: { 
        title: { tr: "Neden Biz?", en: "Why Choose Us?" }, 
        items: [] 
    }
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
