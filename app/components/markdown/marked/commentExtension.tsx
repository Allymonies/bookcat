import { TokenizerThis, Tokens } from "marked";

const matchRule = /^%%([^=\n]+)%%/;

export interface CommentToken extends Tokens.Generic {
    type: "comment";
    raw: string;
    text: string;
}

export function commentTokenizer(this: TokenizerThis, src: string): CommentToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "comment",
            raw: match[0],
            text: match[1].trim()
        } as CommentToken;
    }
    return undefined;
}

export function startCommentToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("%%");
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