import { NextResponse } from 'next/server';
import { readCollection, writeCollection, DEFAULT_PRODUCTS } from "@/lib/firestoreStore";

export async function GET() {
    try {
        const data = await readCollection("products");
        if (!data || data.length === 0) {
            return Response.json(DEFAULT_PRODUCTS);
        }
        return Response.json(data);
    } catch (error) {
        return Response.json(DEFAULT_PRODUCTS);
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
