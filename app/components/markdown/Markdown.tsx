import { MarkdownComponent } from "./MarkdownComponent";
import { parseFootnotes } from "~/util/parseFootnotes";
import { FootnoteList } from "./FootnoteList";
import { TokensList } from "marked";

export type MarkdownProps = {
  markdown: TokensList;
};

export function Markdown({ markdown }: MarkdownProps): JSX.Element {
  const footnotes = parseFootnotes(markdown)
  return (
    <div>
      <div>
        {
          markdown.map((token, i) =>
            <MarkdownComponent  key={i} token={token} footnotes={footnotes} />
          )
        }
      </div>
      <FootnoteList footnotes={footnotes}/>
    </div>
  );
}