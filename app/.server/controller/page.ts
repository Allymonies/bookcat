import { and, eq, desc, asc } from "drizzle-orm";
import { db } from "../db/db";
import { DbPage, pages } from "../db/schema/pages";
import { Page, PageSummary } from "~/model/page";
import { DbPageVersion, pageVersions } from "../db/schema/pageVersions";
import { TokensList } from "marked";
import { getTags } from "~/util/getTags";
import { pageTags } from "../db/schema/tags";

export function getPageSummaryModel(dbPage: DbPage, dbPageVersion: DbPageVersion): PageSummary {
    return {
        identifier: dbPage.identifier,
        title: dbPageVersion.title,
        created: dbPage.created,
        updated: dbPageVersion.created,
        published: dbPage.published,
    };
}

export function getPageModel(dbPage: DbPage, dbPageVersion: DbPageVersion): Page {
    return {
        identifier: dbPage.identifier,
        title: dbPageVersion.title,
        created: dbPage.created,
        updated: dbPageVersion.created,
        markdown: dbPageVersion.markdown,
        content: dbPageVersion.content,
        published: dbPage.published,
    };
}

export async function getPageLatestVersion(identifier: string): Promise<Page | undefined> {
    const result = await db
        .select()
        .from(pages)
        .where(eq(pages.identifier, identifier))
        .innerJoin(pageVersions, eq(pages.latestVersion, pageVersions.id))
        .limit(1);
    if (result.length === 0) {
        return;
    }

    const resultPage = result[0];

    return getPageModel(resultPage.pages, resultPage["page_versions"]);
}

export async function createPage(identifier: string, title: string, markdown: TokensList, content: string): Promise<Page> {
    const pageResult = await db.insert(pages).values({
        identifier,
        published: false,
    }).returning();
    if (pageResult.length === 0) {
        throw new Error("Failed to create page");
    }
    const page = pageResult[0] as DbPage;
    const pageVersionResult = await db.insert(pageVersions).values({
        pageId: page.identifier,
        title,
        markdown,
        content,
    }).returning();
    if (pageVersionResult.length === 0) {
        throw new Error("Failed to create page version");
    }
    const pageVersion = pageVersionResult[0] as DbPageVersion;

    const updatePageResult = await db.update(pages).set({
        latestVersion: pageVersion.id,
    }).where(eq(pages.identifier, identifier));
    if (updatePageResult.rowCount !== 1) {
        throw new Error("Failed to update page");
    }

    const tags = getTags(markdown);
    // Create tags
    if (tags.length > 0) {
        await db.insert(pageTags).values(tags.map(tag => ({
            page: page.identifier,
            tag,
        })));
    }

    return getPageModel(page, pageVersion);
}

export async function listAllPages(limit: number = 50, offset: number = 0, showUnpublished: boolean = false): Promise<PageSummary[]> {
    if (!showUnpublished) {
        const result = await db
            .select()
            .from(pages)
            .where(eq(pages.published, true))
            .innerJoin(pageVersions, eq(pages.latestVersion, pageVersions.id))
            .orderBy(desc(pages.created))
            .limit(limit)
            .offset(offset);
        return result.map((row) => getPageSummaryModel(row.pages, row["page_versions"]));
    } else {
        const result = await db
            .select()
            .from(pages)
            .innerJoin(pageVersions, eq(pages.latestVersion, pageVersions.id))
            .orderBy(desc(pages.created))
            .limit(limit)
            .offset(offset);
        return result.map((row) => getPageSummaryModel(row.pages, row["page_versions"]));
    }
}

export async function publishPage(identifier: string): Promise<void> {
    const page = await db
        .select()
        .from(pages)
        .where(eq(pages.identifier, identifier))
        .limit(1);
    if (page.length === 0) {
        throw new Error("Page not found");
    }
    await db.update(pages).set({
        published: true,
    }).where(eq(pages.identifier, identifier));
}

export async function unpublishPage(identifier: string): Promise<void> {
    const page = await db
        .select()
        .from(pages)
        .where(eq(pages.identifier, identifier))
        .limit(1);
    if (page.length === 0) {
        throw new Error("Page not found");
    }
    await db.update(pages).set({
        published: false,
    }).where(eq(pages.identifier, identifier));
}

export async function updatePage(identifier: string, title: string, markdown: TokensList, content: string, publish: boolean): Promise<Page> {
    const page = await db
        .select()
        .from(pages)
        .where(eq(pages.identifier, identifier))
        .limit(1);
    if (page.length === 0) {
        throw new Error("Page not found");
    }
    const pageVersionResult = await db.insert(pageVersions).values({
        pageId: page[0].identifier,
        title,
        markdown,
        content,
    }).returning();
    if (pageVersionResult.length === 0) {
        throw new Error("Failed to create page version");
    }
    const pageVersion = pageVersionResult[0] as DbPageVersion;

    const updatePageResult = await db.update(pages).set({
        latestVersion: pageVersion.id,
        published: publish,
    }).where(eq(pages.identifier, identifier));
    if (updatePageResult.rowCount !== 1) {
        throw new Error("Failed to update page");
    }

    // Delete old tags
    await db.delete(pageTags).where(eq(pageTags.page, identifier));
    // Create new tags
    const tags = getTags(markdown);
    if (tags.length > 0) {
        await db.insert(pageTags).values(tags.map(tag => ({
            page: identifier,
            tag,
        })));
    }

    return getPageModel(page[0], pageVersion);
}

export async function listPagesByTag(tag: string, limit: number = 50, offset: number = 0, ascending: boolean = false, showUnpublished: boolean = false): Promise<PageSummary[]> {
    const sortBy = ascending ? asc(pages.created) : desc(pages.created);
    if (!showUnpublished) {
        const result = await db
            .select()
            .from(pageTags)
            .innerJoin(pages, eq(pageTags.page, pages.identifier))
            .innerJoin(pageVersions, eq(pages.latestVersion, pageVersions.id))
            .where(and(eq(pageTags.tag, tag), eq(pages.published, true)))
            .orderBy(sortBy)
            .limit(limit)
            .offset(offset);
        return result.map((row) => getPageSummaryModel(row.pages, row["page_versions"]));
    } else {
        const result = await db
            .select()
            .from(pageTags)
            .innerJoin(pages, eq(pageTags.page, pages.identifier))
            .innerJoin(pageVersions, eq(pages.latestVersion, pageVersions.id))
            .where(eq(pageTags.tag, tag))
            .orderBy(sortBy)
            .limit(limit)
            .offset(offset);
        return result.map((row) => getPageSummaryModel(row.pages, row["page_versions"]));
    }
}