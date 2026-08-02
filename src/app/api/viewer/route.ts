import { NextResponse } from "next/server";

type ViewerBody = {
  firstName?: string;
};

/**
 * Lightweight viewer name capture for the explore path.
 * Persists a cookie for personalization; ready to swap for a real store later.
 */
export async function POST(request: Request) {
  let body: ViewerBody;

  try {
    body = (await request.json()) as ViewerBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";

  if (!firstName || firstName.length > 40) {
    return NextResponse.json(
      { error: "First name is required (max 40 characters)." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true, firstName });
  response.cookies.set("speak_viewer_first_name", firstName, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set("speak_account_first_name", firstName, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
