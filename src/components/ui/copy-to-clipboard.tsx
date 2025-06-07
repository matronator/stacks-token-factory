import { MouseEvent, ReactNode, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

interface CopyToClipboardProps {
    text: string;
    children: ReactNode;
}

export function CopyToClipboard({ text, children }: CopyToClipboardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: MouseEvent) => {
        getSelection()?.selectAllChildren(e.currentTarget);
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip open={copied}>
                    <TooltipTrigger asChild onClick={handleCopy}>
                        {children}
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white" arrowPadding={6}>
                        <TooltipArrow width={4} height={6} />
                        Copied to clipboard
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
}
