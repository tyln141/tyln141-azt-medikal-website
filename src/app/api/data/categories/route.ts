import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/categories.json');
        
        // Ensure file exists
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(fileContent));
    } catch (error) {
        return NextResponse.json([]); 
    }
}
