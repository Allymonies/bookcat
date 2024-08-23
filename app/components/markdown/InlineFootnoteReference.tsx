import { Link } from "@remix-run/react";
import { FootnoteInfo } from "~/util/parseFootnotes";
import { InlineFootnoteToken } from "./marked/inlineFootnoteExtension";

export type InlineFootnoteReferenceProps = {
    token: InlineFootnoteToken;
    footnotes: FootnoteInfo;
};
  
export function InlineFootnoteReference({ token, footnotes }: InlineFootnoteReferenceProps): JSX.Element {
    const footnoteNumber = footnotes.tokenToFootnoteNumber.get(token);
    const href = `#fn-${footnoteNumber}`;
    return (
        <Link to={href} className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600">
            <sup className="text-xxs align-super top-0">[{footnoteNumber}]</sup>
        </Link>
    );
}