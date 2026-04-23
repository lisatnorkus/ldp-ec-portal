import { NextResponse, type NextRequest } from "next/server";

// Admin gate (preview-mode). Keeps /admin/* invisible to anyone who
// doesn't hold the token. We return 404 rather than 401/403 so the
// route surface isn't announced to random visitors.
//
// Flow:
//   1. Lisa visits /admin/engagement?t=<token>
//   2. Middleware matches token against ADMIN_ACCESS_TOKEN env var
//      and sets an httpOnly cookie, then redirects to the clean URL
//   3. Subsequent visits use the cookie (30-day lifetime)
//
// Rotate by changing the env var — cookies with the old value stop
// matching instantly. No deploy needed.
//
// When magic-link auth lands, replace this with a role check against
// ec_members (officers + admins). This middleware can stay in place
// as a belt-and-suspenders guard until auth is proven.

const ADMIN_COOKIE = "ldp_admin_key";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function notFound(): NextResponse {
  return new NextResponse("Not Found", { status: 404 });
}

export function middleware(req: NextRequest) {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token) return notFound();

  const cookieToken = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookieToken === token) return NextResponse.next();

  const urlToken = req.nextUrl.searchParams.get("t");
  if (urlToken === token) {
    const cleanUrl = new URL(req.nextUrl.pathname, req.url);
    // Preserve any non-token query params
    for (const [k, v] of req.nextUrl.searchParams) {
      if (k !== "t") cleanUrl.searchParams.set(k, v);
    }
    const res = NextResponse.redirect(cleanUrl);
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
    return res;
  }

  return notFound();
}

export const config = {
  // /amplify/new is under the admin gate so only the Comms Committee
  // (people with the token cookie) can publish new broadcasts. The
  // read-only /amplify board view is open to every logged-in EC member.
  matcher: ["/admin/:path*", "/amplify/new"],
};
