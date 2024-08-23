import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { Link } from "@remix-run/react";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type MarkdownLinkProps = {
    token: Tokens.Link;
    footnotes: FootnoteInfo;
};
  
export function MarkdownLink({ token, footnotes }: MarkdownLinkProps): JSX.Element {
    return (
        <Link to={token.href} className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600">
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </Link>
    );
}