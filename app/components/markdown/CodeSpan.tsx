import { Tokens } from "marked";

export type CodeSpanProps = {
    token: Tokens.Codespan;
};
  
export function CodeSpan({ token }: CodeSpanProps): JSX.Element {
    return (
        <code>
            {token.text}
        </code>
    );
}