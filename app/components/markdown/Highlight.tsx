import { FootnoteInfo } from "~/util/parseFootnotes";
import { MarkdownComponent } from "./MarkdownComponent";
import { HighlightToken } from "./marked/highlightExtension";

export type HighlightProps = {
    token: HighlightToken;
    footnotes: FootnoteInfo;
};
  
export function Highlight({ token, footnotes }: HighlightProps): JSX.Element {
    return (
        <mark className="bg-yellow-200 text-black dark:bg-yellow-200 dark:text-black">
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </mark>
    );
}