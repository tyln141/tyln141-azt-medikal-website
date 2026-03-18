import { NextResponse } from 'next/server';
import { readCollection, writeCollection } from '@/lib/firestoreStore';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await readCollection('categories');
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await writeCollection('categories', data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
