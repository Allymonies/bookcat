import { TokenizerThis, Tokens } from "marked";

const matchRule = /^\[\[([^\]|]+)(|[^\]]+)?\]\]/;

export interface WikiLinkToken extends Tokens.Generic {
    type: "wikiLink";
    raw: string;
    text: string;
    href: string;
}

export function wikiLinkTokenizer(this: TokenizerThis, src: string): WikiLinkToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "wikiLink",
            raw: match[0],
            href: match[1].trim(),
            text: match[2] ? match[2].substring(1) : match[1].trim()
        } as WikiLinkToken;
    }
    return undefined;
}

export function startWikiLinkToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("[[");
        if (index === -1) {
            return undefined;
        }
        const matchArea = indexSrc.substring(index);
        if (matchRule.test(matchArea)) {
            return index;
        }

        indexSrc = indexSrc.substring(index + 2);
    }
    return;
}