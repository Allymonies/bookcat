import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { useId } from "react";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type MarkdownListItemProps = {
    token: Tokens.ListItem;
    footnotes: FootnoteInfo;
};
  
export function MarkdownListItem({ token, footnotes }: MarkdownListItemProps): JSX.Element {
    const id = useId();
    const children = token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />);
    if (token.task) {
        return (
            <li className="list-none -ml-5">
                <input type="checkbox" className="mr-2" name={id} defaultChecked={token.checked}/>
                <label htmlFor={id}>{children}</label>
            </li>
        );
    } else {
        return (
            <li>
                {children}
            </li>
        );
    }
}