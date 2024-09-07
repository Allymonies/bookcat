import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";
import { UnderlineToken } from "./marked/underlineExtension";

export type UnderlineProps = {
    token: UnderlineToken;
    footnotes: FootnoteInfo;
};
  
export function Underline({ token, footnotes }: UnderlineProps): JSX.Element {
    return (
        <u>
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </u>
    );
}