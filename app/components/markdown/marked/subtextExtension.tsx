import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^-#([^\n]+)/;

export interface SubtextToken extends Tokens.Generic {
    type: "subtext";
    raw: string;
    tokens: Token[];
}

export function subtextTokenizer(this: TokenizerThis, src: string): SubtextToken | undefined {
    const match = matchRule.exec(src);
    if (match) {    
        return {
            type: "subtext",
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1].trim())
        } as SubtextToken;
    }
    return undefined;
}

export function startSubtextToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("-#");
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