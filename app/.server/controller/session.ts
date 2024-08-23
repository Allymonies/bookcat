import * as argon2 from "argon2";
import * as crypto from "crypto";
import { DbSession, sessions } from "../db/schema/sessions";
import { getDbUserByIdentifier } from "./user";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { DbUser, users } from "../db/schema/users";

export const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days

export interface SessionResult {
    session: DbSession;
    user: DbUser;
    newSessionToken?: string;
}

export async function login(identifier: string, password: string): Promise<DbSession | undefined> {
    const user = await getDbUserByIdentifier(identifier);
    if (!user) {
        return;
    }

    // Check password
    if (!await argon2.verify(user.password, password)) {
        return;
    }
    
    // Create session
    const result = await db.insert(sessions).values({
        sessionToken: crypto.randomBytes(32).toString("base64"),
        userId: user.id,
        expires: new Date(Date.now() + SESSION_DURATION),
    }).returning();
    if (result.length === 0) {
        return;
    }
    return result[0] as DbSession;
}

export async function createSession(userId: number): Promise<DbSession | undefined> {
    const result = await db.insert(sessions).values({
        sessionToken: crypto.randomBytes(32).toString("base64"),
        userId,
        expires: new Date(Date.now() + SESSION_DURATION),
    }).returning();
    if (result.length === 0) {
        return;
    }
    return result[0] as DbSession;
}

export async function getSessionAndUser(sessionToken: string): Promise<SessionResult | undefined> {
    const result = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .innerJoin(users, eq(sessions.userId, users.id))
        .limit(1);
    if (result.length === 0) {
        return;
    }
    if (result[0].sessions.expires.getTime() < Date.now()) {
        return;
    }
    return {
        session: result[0].sessions,
        user: result[0].users,
    }
}