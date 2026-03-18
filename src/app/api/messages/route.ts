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
    // Sort by date descending
    const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("FETCH MESSAGES ERROR:", error);
    return NextResponse.json([]);
  }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        const { doc, deleteDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        
        await deleteDoc(doc(db, "messages", id));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE MESSAGE ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const data = await req.json();
        const { id, ...updates } = data;
        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        await writeDoc("messages", id, updates);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("UPDATE MESSAGE ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
