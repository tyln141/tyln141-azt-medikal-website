import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/pages.json');

export async function POST(request: Request) {
    try {
        const settings = await request.json();
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        
        data.siteSettings = settings;
        
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
