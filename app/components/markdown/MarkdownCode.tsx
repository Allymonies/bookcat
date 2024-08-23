import { Tokens } from "marked";
import hljs from "highlight.js";
import 'highlight.js/styles/github.min.css';
import '~/github-dark.css';
import mermaid from "mermaid";
import { useContext, useEffect, useRef } from "react";
import { DarkModeContext } from "~/darkModeContext";

export type MarkdownCodeProps = {
    token: Tokens.Code;
};

if (typeof document !== "undefined") {
    mermaid.initialize({
        startOnLoad: true,
    });
}

export function MarkdownCode({ token }: MarkdownCodeProps): JSX.Element {
    const darkMode = useContext(DarkModeContext);
    const isMermaid = token.lang && token.lang === "mermaid";
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (isMermaid) {
            const theme = darkMode ? "dark" : "default";
            
            mermaid.initialize({
                startOnLoad: false,
                theme: theme
            });
            
            if (codeRef.current) {
                codeRef.current.removeAttribute("data-processed");
                codeRef.current.innerHTML = token.text;
                mermaid.run({
                    nodes: [ codeRef.current ]
                }).catch((error) => {
                    // TODO: Why does mermaid get a null element?
                    if (error.message !== "element is null") {
                        console.error(error); 
                    }
                });
            }
        }
    }, [darkMode, isMermaid, token.text]);
    // TODO: Theme based on dark mode
    if (!isMermaid) {
        const languages = hljs.listLanguages();
        const highlightResult = token.lang && languages.includes(token.lang)
            ? hljs.highlight(token.text, {language: token.lang}).value
            : hljs.highlightAuto(token.text).value;
        return (
            <pre className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white px-2 my-2">
                <code dangerouslySetInnerHTML={{__html: highlightResult}}/>
            </pre>
        )
    } else {
        return (
            <pre className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white px-2 my-2">
                <code className="mermaid" dangerouslySetInnerHTML={{__html: token.text}} ref={codeRef}/>
            </pre>
        )
    }
}