import { Tokens } from "marked";
import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type TableCellProps = {
    token: Tokens.TableCell;
    footnotes: FootnoteInfo;
};
  
export function TableCell({ token, footnotes }: TableCellProps): JSX.Element {
    const children = token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />);
    const alignClass = token.align === "center"
        ? "text-center"
        : token.align === "right"
            ? "text-right"
            : "text-left";
    if (token.header) {
        return <th className={alignClass + " border-2 border-slate-800 dark:border-slate-200"}>{children}</th>;
    }
    return <td className={alignClass + " border-2 border-slate-800 dark:border-slate-200"}>{children}</td>;
}