import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = body.email
    const password = body.password

    if (
      email === "aztmedikal2025@hotmail.com" &&
      password === "AyhanZuhalTarık2025AZT"
    ) {
      const response = NextResponse.json({ success: true })

      response.cookies.set("admin_session", "true", {
        path: "/",
        httpOnly: false,
      })

      return response
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("admin_session")
  return response
}
