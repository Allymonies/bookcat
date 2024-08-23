import { Tokens } from "marked";
import { MarkdownListItem } from "./MarkdownListItem";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type MarkdownListProps = {
    token: Tokens.List;
    footnotes: FootnoteInfo;
};
  
export function MarkdownList({ token, footnotes }: MarkdownListProps): JSX.Element {
    if (token.ordered) {
        // If ordered, render as ordered list
        const start = token.start === "" ? undefined : token.start;
        return (
            <ol start={start} className="pl-5 list-decimal list-outside">
                {token.items.map((item, index) => (
                    <MarkdownListItem key={index} token={item} footnotes={footnotes} />
                ))}
            </ol>
        );
    }
    // Else, loose
    return (
        <ul className="pl-5 list-disc list-outside">
            {token.items.map((item, index) => (
                <MarkdownListItem key={index} token={item} footnotes={footnotes} />
            ))}
        </ul>
    );
}