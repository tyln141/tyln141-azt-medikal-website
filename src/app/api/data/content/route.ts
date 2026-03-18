import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/content.json');

        if (!fs.existsSync(filePath)) {
            const defaultContent = {
                home: [],
                about: [],
                why_us: [],
                footer: []
            };
            fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
            return NextResponse.json(defaultContent);
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(fileContent));
    } catch (error) {
        return NextResponse.json({});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const filePath = path.join(process.cwd(), 'src/data/content.json');
        fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
