import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { DbFeaturedTag, featuredTags } from "../db/schema/featureTags";
import { FeaturedTag } from "~/model/tag";

export function getFeaturedTagModel(dbFeaturedTag: DbFeaturedTag): FeaturedTag {
    return {
        tag: dbFeaturedTag.tag,
        created: dbFeaturedTag.created,
        order: dbFeaturedTag.order,
    }
}

export async function listFeaturedTags(limit: number = 50, offset: number = 0) {
    const result = await db
        .select()
        .from(featuredTags)
        .orderBy(asc(featuredTags.order))
        .limit(limit)
        .offset(offset);
    return result.map((row) => getFeaturedTagModel(row));
}

export async function getLastTag() {
    const result = await db
        .select()
        .from(featuredTags)
        .orderBy(desc(featuredTags.order))
        .limit(1);
    return result[0] ? getFeaturedTagModel(result[0]) : null;
}

export async function createFeaturedTag(tag: string) {
    const existingTag = await db
        .select()
        .from(featuredTags)
        .where(eq(featuredTags.tag, tag))
        .limit(1);
    if (existingTag.length > 0) {
        throw new Error("Tag already exists");
    }
    const lastTag = await getLastTag();
    const order = lastTag ? lastTag.order + 1 : 0;
    const result = await db.insert(featuredTags).values({
        tag,
        order,
    }).returning();
    return getFeaturedTagModel(result[0]);
}

export async function deleteFeaturedTag(tag: string) {
    await db.delete(featuredTags).where(eq(featuredTags.tag, tag));
}