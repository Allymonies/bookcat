import { Token, Tokens } from "marked";
import { AlertToken } from "~/components/markdown/marked/alertExtension";

export function getTags(token: Token | Token[]): string[] {
    if (Array.isArray(token)) {
        return token.map(child => getTags(child)).flat();
    }

    if (token.type === "tag") {
        return [token.text.toLowerCase()];
    } else {
        const tags: string[] = [];
        if (token.type === "alert") {
            const alert = token as AlertToken;
            alert.title.forEach(child => tags.push(...getTags(child)));
        }
        if ("tokens" in token && token.tokens) {
            token.tokens.forEach(child => tags.push(...getTags(child)));
        } else if ("items" in token && token.items) {
            token.items.forEach((child: Tokens.ListItem) => tags.push(...getTags(child)));
        }
        return tags;
    }
}