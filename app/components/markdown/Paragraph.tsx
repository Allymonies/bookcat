import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type ParagraphProps = {
    token: Tokens.Paragraph;
    footnotes: FootnoteInfo;
};
  
export function Paragraph({ token, footnotes }: ParagraphProps): JSX.Element {
    return (
        <p>
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </p>
    );
}