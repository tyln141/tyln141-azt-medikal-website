import { NextResponse } from 'next/server';

export async function DELETE() {
    return NextResponse.json(
        { error: 'Local file deletion is disabled.' }, 
        { status: 403 }
    );
}
