import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { DbUser, users } from "../db/schema/users"
import { db } from "../db/db";

export function getUserModel(dbUser: DbUser) {
    return {
        uuid: dbUser.uuid,
        username: dbUser.username,
        email: dbUser.email,
        created: dbUser.created
    }
}

export async function getUserByUserName(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (result.length === 0) {
        return;
    }
    return getUserModel(result[0] as DbUser);
}

export async function getDbUserByIdentifier(identifier: string) {
    const result = await db.select().from(users).where(
        or(
            eq(users.username, identifier),
            eq(users.email, identifier)
        )
    ).limit(1);
    if (result.length === 0) {
        return;
    }
    return result[0] as DbUser;
}

export async function createUser(username: string, email: string, password: string) {
    const result = await db.insert(users).values({
        username,
        uuid: uuidv4(),
        email,
        password: await argon2.hash(password),
    }).returning();
    return getUserModel(result[0] as DbUser);
}