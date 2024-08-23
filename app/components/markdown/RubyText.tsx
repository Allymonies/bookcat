import { FootnoteInfo } from "~/util/parseFootnotes";
import { MarkdownComponent } from "./MarkdownComponent";
import { RubyTextToken } from "./marked/rubyTextExtension";

export type RubyTextProps = {
    token: RubyTextToken;
    footnotes: FootnoteInfo;
};
  
export function RubyText({ token, footnotes }: RubyTextProps): JSX.Element {
    return (
        <>
            <rp>(</rp>
            <rt>
                {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
            </rt>
            <rp>)</rp>
        </>
    );
}