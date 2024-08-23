import { Tokens } from "marked";

const matchRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n$]))\1/;

export interface LatexToken extends Tokens.Generic {
    type: "latex";
    raw: string;
    text: string;
}

export function latexTokenizer(src: string): LatexToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        return {
            type: "latex",
            raw: match[0],
            text: match[2].trim()
        } as LatexToken;
    }
    return undefined;
}

export function startLatexToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf("$");
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