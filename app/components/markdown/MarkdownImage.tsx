import { Tokens } from "marked";

export type MarkdownImageProps = {
    token: Tokens.Image;
};
  
export function MarkdownImage({ token }: MarkdownImageProps): JSX.Element {
    return (
        <img src={token.href} alt={token.text} title={token.title ?? undefined} />
    );
}