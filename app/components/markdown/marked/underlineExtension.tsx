import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^__([^\n]+?)__/;

export interface UnderlineToken extends Tokens.Generic {
    type: "underline";
    raw: string;
    tokens: Token[];
}

export function underlineTokenizer(this: TokenizerThis, src: string): UnderlineToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "underline",
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1])
        } as UnderlineToken;
    }
    return undefined;
}

export function startUnderlineToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("__");
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