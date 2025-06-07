import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";

interface ContractFormItemProps {
    className?: string;
    label: string;
    description: string;
    control: JSX.Element;
    labelClassName?: string;
}

export function ContractFormItem({ labelClassName, className = 'mb-8', label, description, control }: ContractFormItemProps) {
    return (
        <FormItem className={className}>
            <div className='grid grid-cols-2 place-items-center'>
                <FormLabel className={labelClassName}>{label}:</FormLabel>
                <FormControl>
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
