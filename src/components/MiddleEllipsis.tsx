interface MiddleEllipsisProps {
    text?: string;
    maxLength?: number;
}

export function MiddleEllipsis({ text = "", maxLength = 32 }: MiddleEllipsisProps) {
    function truncateText(txt: string, length: number): string {
        if (txt.length <= length) return txt;
        const start = txt.slice(0, length / 2);
        const end = txt.slice(-length / 2);
        return `${start}...${end}`;
    }

    return (
        <abbr title={text}>{truncateText(text, maxLength)}</abbr>
    );
}
