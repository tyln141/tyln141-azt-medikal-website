import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'tr';
    
    try {
        const filePath = path.join(process.cwd(), 'locales', `${lang}.json`);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({}, { status: 404 });
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read translations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { lang, data } = await request.json();
        if (!lang) return NextResponse.json({ error: 'Language missing' }, { status: 400 });

        const filePath = path.join(process.cwd(), 'locales', `${lang}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update translations' }, { status: 500 });
    }
}
