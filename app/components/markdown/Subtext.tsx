import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";
import { SubtextToken } from "./marked/subtextExtension";

export type SubtextProps = {
    token: SubtextToken;
    footnotes: FootnoteInfo;
};
  
export function Subtext({ token, footnotes }: SubtextProps): JSX.Element {
    return (
        <div>
            <small className="text-sm text-gray-500 dark:text-gray-400 font-light">
                {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
            </small>
        </div>
    );
}