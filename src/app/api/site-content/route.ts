import { NextResponse } from 'next/server';
import { readCollection, writeCollection } from '@/lib/jsonStore';

export async function GET() {
    try {
        const data = readCollection('site-content', {
            about: { title: {}, description: {}, stats: [], image: "" },
            whyUs: { title: {}, items: [] }
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read site content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        writeCollection('site-content', body);
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update site content' }, { status: 500 });
    }
}
