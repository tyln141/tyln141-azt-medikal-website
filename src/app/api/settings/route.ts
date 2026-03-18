import { NextResponse } from 'next/server';
import { readCollection, writeCollection } from '@/lib/jsonStore';

export async function GET() {
    try {
        const data = readCollection('settings', {});
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        writeCollection('settings', body);
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
