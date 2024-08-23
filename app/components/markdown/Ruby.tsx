import { FootnoteInfo } from "~/util/parseFootnotes";
import { MarkdownComponent } from "./MarkdownComponent";
import { RubyToken } from "./marked/rubyExtension";

export type RubyProps = {
    token: RubyToken;
    footnotes: FootnoteInfo;
};
  
export function Ruby({ token, footnotes }: RubyProps): JSX.Element {
    return (
        <ruby>
            {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
        </ruby>
    );
}