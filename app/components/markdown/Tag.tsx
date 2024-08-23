import { Link } from "@remix-run/react";
import { TagToken } from "./marked/tagExtension";

export type TagProps = {
    token: TagToken;
};
  
export function Tag({ token }: TagProps): JSX.Element {
    return (
        <Link to={`/tags/${token.text}`} className="rounded-2xl bg-violet-200 hover:bg-violet-300 text-violet-950 dark:bg-violet-800 dark:hover:bg-violet-700 dark:text-violet-50 font-medium duration-100 py-1 px-2">
            #{token.text}
        </Link>
    );
}