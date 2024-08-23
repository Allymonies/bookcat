import { default as katex } from "katex";
import 'katex/dist/katex.min.css'
import { useEffect, useRef } from "react";
import { LatexToken } from "./marked/latexExtension";

export type MarkdownLatexProps = {
    token: LatexToken;
};
  
export function MarkdownLatex({ token }: MarkdownLatexProps): JSX.Element {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // TODO: Block display mode
            katex.render(token.text, containerRef.current, {displayMode: false});
        }
    }, [containerRef, token]);
    
    return (
        <span ref={containerRef}>
            <code>${token.text}$</code>
        </span>
    );
}