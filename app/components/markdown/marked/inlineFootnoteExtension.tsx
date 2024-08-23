import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^\^\[([^[\]]+)\]/;

export interface InlineFootnoteToken extends Tokens.Generic {
    type: "inlineFootnote";
    raw: string;
    tokens: Token[];
}

export function inlineFootnoteTokenizer(this: TokenizerThis, src: string): InlineFootnoteToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "inlineFootnote",
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1])
        } as InlineFootnoteToken;
    }
    return undefined;
}

export function startInlineFootnoteToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("^[");
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