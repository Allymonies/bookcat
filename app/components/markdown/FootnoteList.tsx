import { FootnoteInfo } from "~/util/parseFootnotes";
import { FootnoteComponent } from "./FootnoteComponent";

export type FootnoteListProps = {
    footnotes: FootnoteInfo;
};
  
export function FootnoteList({ footnotes }: FootnoteListProps): JSX.Element | null {
    if (footnotes.footnotes.length === 0) {
        return null;
    }
    return (
        <div>
            <hr/>
            <ol className="pl-5 list-decimal list-outside">
                {
                    footnotes.footnotes.map((footnote, i) =>
                        <FootnoteComponent key={i} token={footnote} index={i+1} footnotes={footnotes} />      
                    )
                }
            </ol>
        </div>
    );
}