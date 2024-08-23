import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^\[\^([^\n[\]]+)\]:([^\n]+)/;

export interface FootnoteToken extends Tokens.Generic {
    type: "footnote";
    raw: string;
    identifier: string;
    tokens: Token[];
}

export function footnoteTokenizer(this: TokenizerThis, src: string): FootnoteToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "footnote",
            raw: match[0],
            identifier: match[1].trim(),
            tokens: this.lexer.inlineTokens(match[2])
        } as FootnoteToken;
    }
    return undefined;
}

export function startFootnoteToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    let isStart = true;
    while (indexSrc) {
        index = indexSrc.indexOf("[^");
        if (index === -1) {
            return undefined;
        }
        if ( (index < 1 || indexSrc[index - 1] !== "\n") && (!isStart || index > 0)) {
            // Can only match at start of line
            indexSrc = indexSrc.substring(index + 2);
            isStart = false;
            continue;
        }
        const matchArea = indexSrc.substring(index);
        if (matchRule.test(matchArea)) {
            return index;
        }

        indexSrc = indexSrc.substring(index + 2);
        isStart = false;
    }
    return;
}