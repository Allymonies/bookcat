import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type EmphasisProps = {
    token: Tokens.Em;
    footnotes: FootnoteInfo;
};
  
export function Emphasis({ token, footnotes }: EmphasisProps): JSX.Element {
    return (
        <em>
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </em>
    );
}