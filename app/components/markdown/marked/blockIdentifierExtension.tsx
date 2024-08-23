import { TokenizerThis, Tokens } from "marked";

const matchRule = /^\^(?=.*[a-zA-Z])([\w-]+)/;

export interface BlockIdentifierToken extends Tokens.Generic {
    type: "blockIdentifier";
    raw: string;
    text: string;
}

export function blockIdentifierTokenizer(this: TokenizerThis, src: string): BlockIdentifierToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "blockIdentifier",
            raw: match[0],
            text: match[1].trim()
        } as BlockIdentifierToken;
    }
    return undefined;
}

export function startBlockIdentifierToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("^");
        if (index === -1) {
            return undefined;
        }
        const matchArea = indexSrc.substring(index);
        if (matchRule.test(matchArea)) {
            return index;
        }

        indexSrc = indexSrc.substring(index + 1);
    }
    return;
}