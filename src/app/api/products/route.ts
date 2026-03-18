import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/products.json');

export async function GET() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Write entire array at once for simplicity
        const newProductsArray = await request.json();
        fs.writeFileSync(DB_PATH, JSON.stringify(newProductsArray, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
    }
}
