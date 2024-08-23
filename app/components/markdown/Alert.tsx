import { MarkdownComponent } from "./MarkdownComponent";
import { FootnoteInfo } from "~/util/parseFootnotes";
import { AlertToken } from "./marked/alertExtension";
import { BugIcon, CheckIcon, ChevronRightIcon, CircleCheckIcon, CircleHelpIcon, ClipboardListIcon, FlameIcon, InfoIcon, ListIcon, PencilIcon, QuoteIcon, TriangleAlertIcon, XIcon, ZapIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type AlertProps = {
    token: AlertToken;
    footnotes: FootnoteInfo;
};
  
export function Alert({ token, footnotes }: AlertProps): JSX.Element {
    const isAccordion = !!token.alertState;
    const [accordionOpen, setAccordionOpen] = useState<boolean>(typeof document === "undefined" || !isAccordion || token.alertState === "+");

    let backgroundColor = "bg-blue-100 dark:bg-blue-900";
    let foregroundColor = "text-blue-700 dark:text-blue-200";
    let icon: JSX.Element | null = null;
    const iconClassName = "inline pr-1";
    switch (token.alertType.toLowerCase()) {
        case "abstract":
        case "summary":
        case "tldr":
            backgroundColor = "bg-teal-100 dark:bg-teal-900";
            foregroundColor = "text-teal-700 dark:text-teal-200";
            icon = <ClipboardListIcon className={iconClassName} />;
            break;
        case "tip":
        case "hint":
        case "important":
            backgroundColor = "bg-teal-100 dark:bg-teal-900";
            foregroundColor = "text-teal-700 dark:text-teal-200";
            icon = <FlameIcon className={iconClassName} />;
            break;
        case "success":
        case "check":
        case "done":
            backgroundColor = "bg-green-100 dark:bg-green-900";
            foregroundColor = "text-green-700 dark:text-green-200";
            icon = <CheckIcon className={iconClassName} />;
            break;
        case "question":
        case "help":
        case "faq":
            backgroundColor = "bg-orange-100 dark:bg-orange-900";
            foregroundColor = "text-orange-700 dark:text-orange-200";
            icon = <CircleHelpIcon className={iconClassName} />;
            break;
        case "warning":
        case "caution":
        case "attention":
            backgroundColor = "bg-orange-100 dark:bg-orange-900";
            foregroundColor = "text-orange-700 dark:text-orange-200";
            icon = <TriangleAlertIcon className={iconClassName} />;
            break;
        case "failure":
        case "fail":
        case "missing":
            backgroundColor = "bg-red-100 dark:bg-red-900";
            foregroundColor = "text-red-700 dark:text-red-200";
            icon = <XIcon className={iconClassName} />;
            break;
        case "danger":
        case "error":
            backgroundColor = "bg-red-100 dark:bg-red-900";
            foregroundColor = "text-red-700 dark:text-red-200";
            icon = <ZapIcon className={iconClassName} />;
            break;
        case "bug":
            backgroundColor = "bg-red-100 dark:bg-red-900";
            foregroundColor = "text-red-700 dark:text-red-200";
            icon = <BugIcon className={iconClassName} />;
            break;
        case "example":
            backgroundColor = "bg-purple-100 dark:bg-purple-900";
            foregroundColor = "text-purple-700 dark:text-purple-200";
            icon = <ListIcon className={iconClassName} />;
            break;
        case "quote":
        case "cite":
            backgroundColor = "bg-gray-200 dark:bg-gray-800";
            foregroundColor = "text-gray-700 dark:text-gray-200";
            icon = <QuoteIcon className={iconClassName} />;
            break;
        case "info":
            backgroundColor = "bg-blue-100 dark:bg-blue-900";
            foregroundColor = "text-blue-700 dark:text-blue-200";
            icon = <InfoIcon className={iconClassName} />;
            break;
        case "todo":
            backgroundColor = "bg-blue-100 dark:bg-blue-900";
            foregroundColor = "text-blue-700 dark:text-blue-200";
            icon = <CircleCheckIcon className={iconClassName} />;
            break;
        default:
            backgroundColor = "bg-blue-100 dark:bg-blue-900";
            foregroundColor = "text-blue-700 dark:text-blue-200";
            icon = <PencilIcon className={iconClassName} />;
            break;
    }

    const title = (
        <div className={`${foregroundColor} font-bold`}>
            {icon}
            <span className="align-middle">
                {token.title.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
            </span>
            { isAccordion
                ? <ChevronRightIcon className={`inline ml-2 duration-200 ${accordionOpen ? "rotate-90" : ""}`} />
                : undefined
            }
        </div>
    );

    const accordionButton = (
        <button className="w-full text-left" onClick={() => setAccordionOpen(!accordionOpen)}>
            {title}
        </button>
    );

    useEffect(() => {
        setAccordionOpen(!isAccordion || token.alertState === "+");
    }, [isAccordion, token.alertState]);

    // TODO: Accordion component
    // TODO: Accordion transition
    return (
        <div className={`rounded-md py-1 px-2 my-2 ${backgroundColor}`}>
            {isAccordion ? accordionButton : title}
            <div className={accordionOpen ? "h-fit my-2" : "h-0 hidden"}>
                {token.tokens.map((token, i) => <MarkdownComponent key={i} token={token} footnotes={footnotes} />)}
            </div>
        </div>
    );
}