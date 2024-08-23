import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type BlockQuoteProps = {
    token: Tokens.Blockquote;
    footnotes: FootnoteInfo;
};
  
export function BlockQuote({ token, footnotes }: BlockQuoteProps): JSX.Element {

    return (
        <div className="border-l-2 border-pink-300 pl-4 block py-1 my-1">
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </div>
    );
}