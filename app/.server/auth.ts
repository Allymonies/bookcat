import cookie from "cookie";
import { createSession, getSessionAndUser, SESSION_DURATION, SessionResult } from "./controller/session";

const ONE_DAY = 1000 * 60 * 60 * 24; // 24 hours
export const MIN_SESSION_DURATION = ONE_DAY * 29; // Refresh when less than 29 days left;

export async function authenticateUser(request: Request): Promise<SessionResult | undefined> {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = cookie.parse(cookieHeader || "");
    if (!cookies.token) {
        return undefined;
    }
    const sessionResult = await getSessionAndUser(cookies.token);
    if (!sessionResult) {
        return undefined;
    }
    const timeUntilExpiration = sessionResult.session.expires.getTime() - Date.now();
    if (timeUntilExpiration < MIN_SESSION_DURATION) {
        // Refresh session
        const newSession = await createSession(sessionResult.user.id);
        sessionResult.newSessionToken = newSession?.sessionToken;
    }

    return sessionResult;
}

export async function getAuthResponseHeaders(sessionResult: SessionResult): Promise<HeadersInit> {
    const responseHeaders: HeadersInit = {};
    if (sessionResult.newSessionToken) {
        responseHeaders["Set-Cookie"] = cookie.serialize("token", sessionResult.newSessionToken, {
            httpOnly: true,
            maxAge: SESSION_DURATION / 1000,
            sameSite: "strict",
        });
    }
    return responseHeaders;
}