import { TokensList } from "marked";

export interface Page {
    identifier: string;
    title: string;
    created: Date;
    updated: Date;
    markdown: TokensList;
    content: string;
    published: boolean;
}

export interface PageSummary {
    identifier: string;
    title: string;
    created: Date;
    updated: Date;
    published: boolean;
}