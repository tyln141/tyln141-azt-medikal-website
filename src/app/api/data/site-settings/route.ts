import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/siteSettings.json');
        
        if (!fs.existsSync(filePath)) {
            const defaultSettings = {
                primaryColor: "#0A6CFF",
                backgroundColor: "#ffffff",
                font: "Inter",
                logo: "/logo.png"
            };
            fs.writeFileSync(filePath, JSON.stringify(defaultSettings, null, 2));
            return NextResponse.json(defaultSettings);
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
        const filePath = path.join(process.cwd(), 'src/data/siteSettings.json');
        fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
    }
}
