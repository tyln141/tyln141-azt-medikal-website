import { NextResponse } from 'next/server';
import { readCollection, writeCollection, DEFAULT_CATEGORIES } from "@/lib/firestoreStore";

export async function GET() {
    try {
        const data = await readCollection("categories");
        if (!data || data.length === 0) {
            return Response.json(DEFAULT_CATEGORIES);
        }
        return Response.json(data);
    } catch (error) {
        return Response.json(DEFAULT_CATEGORIES);
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
