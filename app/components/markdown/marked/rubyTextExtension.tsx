import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^<rt>(.+?)<\/rt>/;

export interface RubyTextToken extends Tokens.Generic {
    type: "rubyText";
    raw: string;
    tokens: Token[];
}

export function rubyTextTokenizer(this: TokenizerThis, src: string): RubyTextToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "rubyText",
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1])
        } as RubyTextToken;
    }
    return undefined;
}

export function startRubyTextToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("<rt>");
        if (index === -1) {
            return undefined;
        }
        const matchArea = indexSrc.substring(index);
        if (matchRule.test(matchArea)) {
            return index;
        }

        indexSrc = indexSrc.substring(index + 4);
    }
    return;
}