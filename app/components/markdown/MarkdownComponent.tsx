import { Token, Tokens } from "marked";
import { Paragraph } from "./Paragraph";
import { Strong } from "./Strong";
import { Emphasis } from "./Emphasis";
import { Strikethrough } from "./Strikethrough";
import { HorizontalRule } from "./HorizontalRule";
import { Heading } from "./Heading";
import { Highlight } from "./Highlight";
import { CodeSpan } from "./CodeSpan";
import { MarkdownLink } from "./MarkdownLink";
import { MarkdownList } from "./MarkdownList";
import { MarkdownImage } from "./MarkdownImage";
import { MarkdownCode } from "./MarkdownCode";
import { BlockQuote } from "./BlockQuote";
import { Table } from "./Table";
import { MarkdownLatex } from "./MarkdownLatex";
import { LatexToken } from "./marked/latexExtension";
import { HighlightToken } from "./marked/highlightExtension";
import { Tag } from "./Tag";
import { TagToken } from "./marked/tagExtension";
import { BlockIdentifier } from "./BlockIdentifier";
import { BlockIdentifierToken } from "./marked/blockIdentifierExtension";
import { WikiLink } from "./WikiLink";
import { WikiLinkToken } from "./marked/wikiLinkExtension";
import { RubyToken } from "./marked/rubyExtension";
import { Ruby } from "./Ruby";
import { RubyText } from "./RubyText";
import { RubyTextToken } from "./marked/rubyTextExtension";
import { FootnoteInfo } from "~/util/parseFootnotes";
import { FootnoteReference } from "./FootnoteReference";
import { FootnoteReferenceToken } from "./marked/footnoteReferenceExtension";
import { InlineFootnoteReference } from "./InlineFootnoteReference";
import { InlineFootnoteToken } from "./marked/inlineFootnoteExtension";
import { Alert } from "./Alert";
import { AlertToken } from "./marked/alertExtension";

export type MarkdownComponentProps = {
    token: Token;
    footnotes: FootnoteInfo;
};
  
export function MarkdownComponent({ token, footnotes }: MarkdownComponentProps): JSX.Element | string | null {
    if (token.type === "paragraph") {
        return <Paragraph token={token as Tokens.Paragraph} footnotes={footnotes} />
    } else if (token.type === "strong") {
        return <Strong token={token as Tokens.Strong} footnotes={footnotes} />
    } else if (token.type === "em") {
        return <Emphasis token={token as Tokens.Em} footnotes={footnotes} />
    } else if (token.type === "del") {
        return <Strikethrough token={token as Tokens.Del} footnotes={footnotes} />
    } else if (token.type === "hr") {
        return <HorizontalRule/>
    } else if (token.type === "heading") {
        return <Heading token={token as Tokens.Heading} footnotes={footnotes} />
    } else if (token.type === "codespan") {
        return <CodeSpan token={token as Tokens.Codespan}/>
    } else if (token.type === "link") {
        return <MarkdownLink token={token as Tokens.Link} footnotes={footnotes} />
    } else if (token.type === "list") {
        return <MarkdownList token={token as Tokens.List} footnotes={footnotes} />
    } else if (token.type === "image") {
        return <MarkdownImage token={token as Tokens.Image}/>
    } else if (token.type === "code") {
        return <MarkdownCode token={token as Tokens.Code}/>
    } else if (token.type === "blockquote") {
        return <BlockQuote token={token as Tokens.Blockquote} footnotes={footnotes} />
    } else if (token.type === "table") {
        return <Table token={token as Tokens.Table} footnotes={footnotes} />
    } else if (token.type === "latex") {
        return <MarkdownLatex token={token as LatexToken}/>
    } else if (token.type === "highlight") {
        return <Highlight token={token as HighlightToken} footnotes={footnotes} />
    } else if (token.type === "tag") {
        return <Tag token={token as TagToken}/>
    } else if (token.type === "blockIdentifier") {
        return <BlockIdentifier token={token as BlockIdentifierToken}/>
    } else if (token.type === "wikiLink") {
        return <WikiLink token={token as WikiLinkToken}/>
    } else if (token.type === "ruby") {
        return <Ruby token={token as RubyToken} footnotes={footnotes} />
    } else if (token.type === "rubyText") {
        return <RubyText token={token as RubyTextToken} footnotes={footnotes} />
    } else if (token.type === "footnoteReference") {
        return <FootnoteReference token={token as FootnoteReferenceToken} footnotes={footnotes} />
    } else if (token.type === "inlineFootnote") {
        return <InlineFootnoteReference token={token as InlineFootnoteToken} footnotes={footnotes} />
    } else if (token.type === "alert") {
        return <Alert token={token as AlertToken} footnotes={footnotes} />
    } else if (token.type === "text" || token.type === "html") {
        // TODO: Support newlines
        return token.raw;
    } else if (token.type === "space" || token.type === "comment" || token.type === "footnote") {
        return null;
    }
    return `Unsupported token type: ${token.type}`;
}