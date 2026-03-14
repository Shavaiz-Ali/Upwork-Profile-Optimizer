import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, title, description, footer }) => {
    return (
        <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}>
            {(title || description) && (
                <div className="flex flex-col space-y-1.5 p-6">
                    {title && <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            )}
            <div className={cn("p-6 pt-0", !title && !description && "pt-6")}>
                {children}
            </div>
            {footer && (
                <div className="flex items-center p-6 pt-0">
                    {footer}
                </div>
            )}
        </div>
    );
};
