import { Tokens } from "marked";
import { TableCell } from "./TableCell";
import { FootnoteInfo } from "~/util/parseFootnotes";

export type TableProps = {
    token: Tokens.Table;
    footnotes: FootnoteInfo;
};
  
export function Table({ token, footnotes }: TableProps): JSX.Element {
    return (
        <table className="border-collapse border-2 border-slate-800">
            <thead>
            <tr>
                { token.header.map((cell, index) => 
                    <TableCell key={index} token={cell} footnotes={footnotes} />
                )}
            </tr>
            </thead>
            <tbody>
                { token.rows.map((row, rowIndex) => 
                    <tr key={rowIndex}>
                        { row.map((cell, cellIndex) => 
                            <TableCell key={cellIndex} token={cell} footnotes={footnotes} />
                        )}
                    </tr>
                )}
            </tbody>
        </table>
    );
}