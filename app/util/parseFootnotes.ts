import { Token, Tokens } from "marked";
import { AlertToken } from "~/components/markdown/marked/alertExtension";
import { FootnoteToken } from "~/components/markdown/marked/footnoteExtension";
import { InlineFootnoteToken } from "~/components/markdown/marked/inlineFootnoteExtension";

export type FootnoteDefinitionToken = FootnoteToken | InlineFootnoteToken;

export interface FootnoteInfo {
    tokenToFootnoteNumber: Map<FootnoteDefinitionToken, number>;
    identifierToFootnoteNumber: Map<string, number>;
    footnotes: FootnoteDefinitionToken[];
}

export function parseFootnotes(token: Token | Token[], current?: FootnoteInfo): FootnoteInfo {
    if (!current) {
        current = {
            tokenToFootnoteNumber: new Map(),
            identifierToFootnoteNumber: new Map(),
            footnotes: []
        };
    }

    if (Array.isArray(token)) {
        token.forEach(child => parseFootnotes(child, current));
        return current;
    }

    if (token.type === "footnote") {
        // Assume no duplicate footnote identifiers
        const footnote = token as FootnoteToken;
        current.footnotes.push(footnote);
        current.tokenToFootnoteNumber.set(footnote, current.footnotes.length);
        current.identifierToFootnoteNumber.set(footnote.identifier, current.footnotes.length);
    } else if (token.type === "inlineFootnote") {
        // Assume no duplicate footnote identifiers
        const footnote = token as InlineFootnoteToken;
        current.footnotes.push(footnote);
        current.tokenToFootnoteNumber.set(footnote, current.footnotes.length);
    } else {
        if (token.type === "alert") {
            const alert = token as AlertToken;
            alert.title.forEach(child => parseFootnotes(child, current));
        }
        if ("tokens" in token && token.tokens) {
            token.tokens.forEach(child => parseFootnotes(child, current));
        } else if ("items" in token && token.items) {
            token.items.forEach((child: Tokens.ListItem) => parseFootnotes(child, current));
        }
    }
    return current;
}