import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";

interface ContractFormItemProps {
    className?: string;
    label: string;
    description: string;
    control: JSX.Element;
    labelClassName?: string;
    autoCols?: boolean;
    additionalCost?: number;
    costApplies?: boolean;
}

export function ContractFormItem({ labelClassName, className = 'mb-8', label, description, control, autoCols = false, additionalCost, costApplies }: ContractFormItemProps) {
    return (
        <FormItem className={className}>
            <div className={`grid place-items-center ${autoCols ? 'grid-cols-auto' : 'grid-cols-2'}`}>
                <FormLabel className={labelClassName}>
                    {label}: {additionalCost && <sup className={`text-orange-400 ${costApplies ? 'opacity-100' : 'opacity-50'}`} title={`Deploy cost +${additionalCost} STX`}>{costApplies ? '+' : ''}{additionalCost} STX</sup>}
                </FormLabel>
                <FormControl className={`${autoCols && 'mt-2'}`}>
                    {control}
                </FormControl>
            </div>
            <FormDescription>
                {description}
            </FormDescription>
            <FormMessage />
        </FormItem>
    );
}
