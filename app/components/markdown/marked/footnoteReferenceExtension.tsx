import { TokenizerThis, Tokens } from "marked";

const matchRule = /^\[\^([^\n[\]]+)\]/;

export interface FootnoteReferenceToken extends Tokens.Generic {
    type: "footnoteReference";
    raw: string;
    identifier: string;
}

export function footnoteReferenceTokenizer(this: TokenizerThis, src: string): FootnoteReferenceToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "footnoteReference",
            raw: match[0],
            identifier: match[1].trim()
        } as FootnoteReferenceToken;
    }
    return undefined;
}

export function startFootnoteReferenceToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("[^");
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