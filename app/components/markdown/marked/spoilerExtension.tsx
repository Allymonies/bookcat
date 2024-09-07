import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^\|\|([^\n]+?)\|\|/;

export interface SpoilerToken extends Tokens.Generic {
    type: "spoiler";
    raw: string;
    tokens: Token[];
}

export function spoilerTokenizer(this: TokenizerThis, src: string): SpoilerToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "spoiler",
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1])
        } as SpoilerToken;
    }
    return undefined;
}

export function startSpoilerToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("||");
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