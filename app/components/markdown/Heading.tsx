import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type HeadingProps = {
    token: Tokens.Heading;
    footnotes: FootnoteInfo;
};
  
export function Heading({ token, footnotes }: HeadingProps): JSX.Element {
    const content = token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />);
    const level = token.depth;
    switch (level) {
        case 1:
            return <h1 className="text-5xl">{content}</h1>;
        case 2:
            return <h2 className="text-4xl">{content}</h2>;
        case 3:
            return <h3 className="text-3xl">{content}</h3>;
        case 4:
            return <h4 className="text-2xl">{content}</h4>;
        case 5:
            return <h5 className="text-xl">{content}</h5>;
        case 6:
            return <h6 className="text-lg">{content}</h6>;
        default:
            return <h1 className="text-5xl">{content}</h1>;
    }
}