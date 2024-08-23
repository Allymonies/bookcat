import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^<ruby>(.+?)<\/ruby>/;

export interface RubyToken extends Tokens.Generic {
    type: "ruby";
    raw: string;
    tokens: Token[];
}

export function rubyTokenizer(this: TokenizerThis, src: string): RubyToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "ruby",
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1])
        } as RubyToken;
    }
    return undefined;
}

export function startRubyToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("<ruby>");
        if (index === -1) {
            return undefined;
        }
        const matchArea = indexSrc.substring(index);
        if (matchRule.test(matchArea)) {
            return index;
        }

        indexSrc = indexSrc.substring(index + 6);
    }
    return;
}