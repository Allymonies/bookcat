import { FootnoteDefinitionToken, FootnoteInfo } from "~/util/parseFootnotes";
import { MarkdownComponent } from "./MarkdownComponent";

export type FootnoteComponentProps = {
    token: FootnoteDefinitionToken;
    index: number;
    footnotes: FootnoteInfo;
};
  
export function FootnoteComponent({ token, index, footnotes }: FootnoteComponentProps): JSX.Element {
    return (
        <li id={`fn-${index}`} className="text-gray-500 dark:text-gray-400">
            <span className="text-black dark:text-white">
                {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
            </span>
        </li>
    );
}