import { ComponentPropsWithoutRef, ElementType, isValidElement, ReactNode } from 'react';

interface ButtonProps<T extends ElementType> {
    as?: T;
    variant?: 'default' | 'primary' | 'secondary' | 'outline';
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

export function Button<T extends ElementType = 'button'>({ as, variant = 'default', children, ...props }: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
    const Component = as || 'button';
    return (
        <Component data-text={ButtonText(children)} {...props} className={`btn ${variant !=='default' ? `btn-${variant}` : ''} ${props.className ?? ''}`}>
            {!['primary', 'secondary'].includes(variant) ? children : ''}
        </Component>
    );
}
