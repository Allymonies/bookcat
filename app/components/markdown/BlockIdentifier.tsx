import { BlockIdentifierToken } from "./marked/blockIdentifierExtension";

export type BlockIdentifierProps = {
    token: BlockIdentifierToken;
};
  
export function BlockIdentifier({ token }: BlockIdentifierProps): JSX.Element {
    return (
        <span id={`^${token.text}`}>
            {`^${token.text}`}
        </span>
    );
}