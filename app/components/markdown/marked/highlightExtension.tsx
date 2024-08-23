import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^==([^=\n]+)==/;

export interface HighlightToken extends Tokens.Generic {
    type: "highlight";
    raw: string;
    tokens: Token[];
}

export function highlightTokenizer(this: TokenizerThis, src: string): HighlightToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "highlight",
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1])
        } as HighlightToken;
    }
    return undefined;
}

export function startHighlightToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("==");
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