import { TokenizerThis, Tokens } from "marked";

const matchRule = /^#(?=.*[a-zA-Z])([\w/-]+)/;

export interface TagToken extends Tokens.Generic {
    type: "tag";
    raw: string;
    text: string;
}

export function tagTokenizer(this: TokenizerThis, src: string): TagToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "tag",
            raw: match[0],
            text: match[1].trim()
        } as TagToken;
    }
    return undefined;
}

export function startTagToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("#");
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