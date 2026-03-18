import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: Request) {
    try {
        const { url } = await request.json(); // e.g. /uploads/file.png

        if (!url || !url.startsWith('/uploads/')) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const filename = url.replace('/uploads/', '');
        const filepath = path.join(process.cwd(), 'public/uploads', filename);

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}
