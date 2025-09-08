import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, passwordResets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { genToken, hashToken } from "@/lib/hash";
import { sendResetEmail } from "@/lib/mail";

const TOKEN_EXPIRE_MINUTES = parseInt(process.env.RESET_TOKEN_EXPIRE_MINUTES || "60", 10);
const RESEND_COOLDOWN_SECONDS = parseInt(process.env.RESET_RESEND_COOLDOWN_SECONDS || "30", 10);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // find user (do not reveal existence)
    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (found.length === 0) {
      return NextResponse.json({ ok: true });
    }
    const user = found[0];

    // cooldown check (most recent)
    const recent = await db
      .select()
      .from(passwordResets)
      .where(eq(passwordResets.userId, user.id))
      .orderBy(desc(passwordResets.createdAt))
      .limit(1);

    const now = new Date();
    if (recent.length > 0) {
      const lastSent = recent[0].lastSentAt as Date | null;
      if (lastSent && (now.getTime() - lastSent.getTime()) / 1000 < RESEND_COOLDOWN_SECONDS) {
        return NextResponse.json({ ok: true, cooldown: true });
      }
    }

    // create token
    const rawToken = genToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(now.getTime() + TOKEN_EXPIRE_MINUTES * 60 * 1000);

    await db.insert(passwordResets).values({
      userId: user.id,
      tokenHash,
      expiresAt,
      used: false,
      lastSentAt: now,
    });

    // send email (await to surface errors)
    await sendResetEmail(email, rawToken);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
