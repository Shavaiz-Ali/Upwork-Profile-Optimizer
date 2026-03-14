import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export const Heading1: React.FC<TypographyProps> = ({ children, className }) => (
    <h1 className={cn("text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
        {children}
    </h1>
);

export const Heading2: React.FC<TypographyProps> = ({ children, className }) => (
    <h2 className={cn("mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0", className)}>
        {children}
    </h2>
);

export const Heading3: React.FC<TypographyProps> = ({ children, className }) => (
    <h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
        {children}
    </h3>
);

export const Heading4: React.FC<TypographyProps> = ({ children, className }) => (
    <h4 className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)}>
        {children}
    </h4>
);

export const Paragraph: React.FC<TypographyProps> = ({ children, className }) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
        {children}
    </p>
);

export const Small: React.FC<TypographyProps> = ({ children, className }) => (
    <small className={cn("text-sm font-medium leading-none", className)}>
        {children}
    </small>
);

export const Muted: React.FC<TypographyProps> = ({ children, className }) => (
    <p className={cn("text-sm text-muted-foreground", className)}>
        {children}
    </p>
);
