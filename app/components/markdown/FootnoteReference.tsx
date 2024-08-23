import { Link } from "@remix-run/react";
import { FootnoteReferenceToken } from "./marked/footnoteReferenceExtension";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type FootnoteReferenceProps = {
    token: FootnoteReferenceToken;
    footnotes: FootnoteInfo;
};
  
export function FootnoteReference({ token, footnotes }: FootnoteReferenceProps): JSX.Element {
    const footnoteNumber = footnotes.identifierToFootnoteNumber.get(token.identifier);
    const href = `#fn-${footnoteNumber}`;
    return (
        <Link to={href} className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600">
            <sup className="text-xxs align-super top-0">[{footnoteNumber}]</sup>
        </Link>
    );
}