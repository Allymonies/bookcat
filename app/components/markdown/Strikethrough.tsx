import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type StrikethroughProps = {
    token: Tokens.Del;
    footnotes: FootnoteInfo;
};
  
export function Strikethrough({ token, footnotes }: StrikethroughProps): JSX.Element {
    return (
        <span className="line-through" aria-label="strikethrough text">
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </span>
    );
}