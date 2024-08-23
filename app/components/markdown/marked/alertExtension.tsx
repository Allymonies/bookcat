import { Token, TokenizerThis, Tokens } from "marked";

const matchRule = /^> ?\[!([^\]]+)\]([-+]?)([^\n]+)((?:\n>[^\n]+)+)/;

export interface AlertToken extends Tokens.Generic {
    type: "alert";
    raw: string;
    alertType: string;
    alertState: string;
    title: Token[];
    tokens: Token[];
}

export function alertTokenizer(this: TokenizerThis, src: string): AlertToken | undefined {
    const match = matchRule.exec(src);
    if (match) {
        let content = match[4].trim().replaceAll("\n>", "\n");
        if (content.startsWith(">")) {
            content = content.substring(1);
        }
        return {
            type: "alert",
            raw: match[0],
            alertType: match[1].trim(),
            alertState: match[2].trim(),
            title: this.lexer.inlineTokens(match[3].trim()),
            tokens: this.lexer.inlineTokens(content)
        } as AlertToken;
    }
    return undefined;
}

export function startAlertToken(src: string): number | undefined {
    let index;
    let indexSrc = src;
    while (indexSrc) {
        index = indexSrc.indexOf(">");
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