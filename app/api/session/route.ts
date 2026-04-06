import { NextRequest, NextResponse } from "next/server";
import { getAuth as getFirebaseAdminAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert, ServiceAccount } from "firebase-admin/app";

// Initialize firebase admin for token verification
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const SESSION_COOKIE = "__session";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token obrigatório" }, { status: 400 });
    }

    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    const expiresInDays = 14;

    const sessionCookie = await auth.createSessionCookie(token.trim(), {
      expiresIn: expiresInDays * 24 * 60 * 60 * 1000, // 14 dias
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      maxAge: expiresInDays * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar sessão" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
