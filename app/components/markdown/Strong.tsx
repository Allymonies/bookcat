import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type StrongProps = {
    token: Tokens.Strong;
    footnotes: FootnoteInfo;
};
  
export function Strong({ token, footnotes }: StrongProps): JSX.Element {
    return (
        <strong>
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </strong>
    );
}