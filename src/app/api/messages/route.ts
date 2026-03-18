import { NextResponse } from 'next/server';
import { readCollection, writeDoc } from '@/lib/firestoreStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = Date.now().toString();

    await writeDoc("messages", id, {
      ...data,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MESSAGE ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await readCollection("messages");
    return NextResponse.json(data);
  } catch (error) {
    console.error("FETCH MESSAGES ERROR:", error);
    return NextResponse.json([]);
  }
}
