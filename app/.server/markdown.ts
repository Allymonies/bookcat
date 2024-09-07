import { marked, TokensList } from "marked";
import { alertTokenizer, startAlertToken } from "~/components/markdown/marked/alertExtension";
import { blockIdentifierTokenizer, startBlockIdentifierToken } from "~/components/markdown/marked/blockIdentifierExtension";
import { commentTokenizer, startCommentToken } from "~/components/markdown/marked/commentExtension";
import { footnoteTokenizer, startFootnoteToken } from "~/components/markdown/marked/footnoteExtension";
import { footnoteReferenceTokenizer, startFootnoteReferenceToken } from "~/components/markdown/marked/footnoteReferenceExtension";
import { highlightTokenizer, startHighlightToken } from "~/components/markdown/marked/highlightExtension";
import { inlineFootnoteTokenizer, startInlineFootnoteToken } from "~/components/markdown/marked/inlineFootnoteExtension";
import { latexTokenizer, startLatexToken } from "~/components/markdown/marked/latexExtension";
import { rubyTokenizer, startRubyToken } from "~/components/markdown/marked/rubyExtension";
import { rubyTextTokenizer, startRubyTextToken } from "~/components/markdown/marked/rubyTextExtension";
import { spoilerTokenizer, startSpoilerToken } from "~/components/markdown/marked/spoilerExtension";
import { startSubtextToken, subtextTokenizer } from "~/components/markdown/marked/subtextExtension";
import { tagTokenizer, startTagToken } from "~/components/markdown/marked/tagExtension";
import { startUnderlineToken, underlineTokenizer } from "~/components/markdown/marked/underlineExtension";
import { wikiLinkTokenizer, startWikiLinkToken } from "~/components/markdown/marked/wikiLinkExtension";

export function parseMarkdown(content: string): TokensList {
    return marked
        .lexer(
        content,
        {
            extensions: {
            renderers: {},
            childTokens: {},
            inline: [
                latexTokenizer,
                highlightTokenizer,
                commentTokenizer,
                tagTokenizer,
                blockIdentifierTokenizer,
                wikiLinkTokenizer,
                rubyTokenizer,
                rubyTextTokenizer,
                footnoteTokenizer,
                footnoteReferenceTokenizer,
                inlineFootnoteTokenizer,
                spoilerTokenizer,
                underlineTokenizer,
            ],
            startInline: [
                startLatexToken,
                startHighlightToken,
                startCommentToken,
                startTagToken,
                startBlockIdentifierToken,
                startWikiLinkToken,
                startRubyToken,
                startRubyTextToken,
                startFootnoteToken,
                startFootnoteReferenceToken,
                startInlineFootnoteToken,
                startSpoilerToken,
                startUnderlineToken,
            ],
            block: [
                alertTokenizer,
                subtextTokenizer,
            ],
            startBlock: [
                startAlertToken,
                startSubtextToken,
            ],
            },
            gfm: true
        }
        );
}