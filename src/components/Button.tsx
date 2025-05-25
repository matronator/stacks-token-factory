import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementType, isValidElement, ReactNode } from 'react';

const buttonVariants = cva(
    `btn`,
    {
        variants: {
            variant: {
                default: '',
                primary: 'btn-primary',
                secondary: 'btn-secondary',
                outline: 'btn-outline',
            }
        }
    }
);

interface ButtonProps<T extends ElementType> extends VariantProps<typeof buttonVariants> {
    as?: T;
    children?: ReactNode;
}

function hasChildren(element: ReactNode): boolean {
    return isValidElement(element) && Boolean(element.props.children);
}

function ButtonText(children: ReactNode) {
    if (hasChildren(children)) {
        if (isValidElement(children)) return ButtonText(children.props.children);
    }

    return children;
}

export function Button<T extends ElementType = 'button'>({ as, variant = 'default', children, className, ...props }: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
    const Component = as || 'button';
    return (
        <Component
            data-text={ButtonText(children)}
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        >
            {!['primary', 'secondary'].includes(variant ?? '') ? children : ''}
        </Component>
    );
}
