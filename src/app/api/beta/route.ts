import { NextResponse } from "next/server";

type BetaBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates a demo “account” from beta signup.
 * First name is the identity we use across the app for now.
 * SMS OTP deferred.
 */
export async function POST(request: Request) {
  let body: BetaBody;

  try {
    body = (await request.json()) as BetaBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (!firstName || firstName.length > 40) {
    return NextResponse.json(
      { error: "First name is required (max 40 characters)." },
      { status: 400 },
    );
  }

  if (!lastName || lastName.length > 40) {
    return NextResponse.json(
      { error: "Last name is required (max 40 characters)." },
      { status: 400 },
    );
  }

  if (!email || email.length > 120 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  if (!phone || phone.length < 7 || phone.length > 20) {
    return NextResponse.json(
      { error: "A valid phone number is required." },
      { status: 400 },
    );
  }

  const account = {
    firstName,
    lastName,
    email,
    phone,
    createdAt: new Date().toISOString(),
  };

  const response = NextResponse.json({ ok: true, account });

  response.cookies.set("speak_account", JSON.stringify(account), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  response.cookies.set("speak_account_first_name", firstName, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  return response;
}
