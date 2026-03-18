import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const bytes = await file.arrayBuffer();
        let buffer = Buffer.from(bytes);

        const ext = path.extname(file.name).toLowerCase();
        
        // Use sharp for optimization if available
        try {
            const sharp = (await import('sharp')).default;
            if (ext === '.jpg' || ext === '.jpeg') {
                buffer = await sharp(buffer).jpeg({ quality: 80 }).toBuffer() as any;
            } else if (ext === '.png') {
                buffer = await sharp(buffer).png({ quality: 80 }).toBuffer() as any;
            } else if (ext === '.webp') {
                buffer = await sharp(buffer).webp({ quality: 80 }).toBuffer() as any;
            }
        } catch (optimizeError) {
            console.warn('Image optimization failed:', optimizeError);
        }

        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }
}
