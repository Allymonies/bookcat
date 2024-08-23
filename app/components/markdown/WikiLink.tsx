import { Link } from "@remix-run/react";
import { WikiLinkToken } from "./marked/wikiLinkExtension";

export type WikiLinkProps = {
    token: WikiLinkToken;
};
  
export function WikiLink({ token }: WikiLinkProps): JSX.Element {
    const href = "/" + token.href.replaceAll(" ", "_");
    return (
        <Link to={href} className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600">
            {token.text}
        </Link>
    );
}