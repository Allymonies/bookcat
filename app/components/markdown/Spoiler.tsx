import { FootnoteInfo } from "~/util/parseFootnotes";
import { MarkdownComponent } from "./MarkdownComponent";
import { SpoilerToken } from "./marked/spoilerExtension";
import { useId } from "react";

export type SpoilerProps = {
    token: SpoilerToken;
    footnotes: FootnoteInfo;
};
  
export function Spoiler({ token, footnotes }: SpoilerProps): JSX.Element {
    const id = useId();
    return (
        <span>
            <input type="checkbox" className="opacity-0 w-0 appearance-none peer" name={id} id={id} />
            <label htmlFor={id} className="cursor-pointer select-none rounded text-transparent bg-gray-600 dark:bg-slate-600 peer-checked:text-black peer-checked:bg-gray-300 dark:peer-checked:bg-slate-700 dark:peer-checked:text-white">
                {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
            </label>
        </span>
    );
}