import { NextResponse } from 'next/server';
import { readCollection, writeCollection, DEFAULT_PRODUCTS } from '@/lib/firestoreStore';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await readCollection('products');
        if (!data || data.length === 0) {
            return NextResponse.json(DEFAULT_PRODUCTS);
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(DEFAULT_PRODUCTS);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await writeCollection('products', data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
