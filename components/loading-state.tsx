import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Analyzing your profile..." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium text-muted-foreground animate-pulse">
                {message}
            </p>
        </div>
    );
};
