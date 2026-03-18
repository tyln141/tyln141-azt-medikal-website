import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        { error: 'Local file uploads are disabled. Please provide an external image URL.' }, 
        { status: 403 }
    );
}
