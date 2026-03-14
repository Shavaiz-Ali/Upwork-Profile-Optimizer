import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileScoreProps {
    score: number;
}

export const ProfileScore: React.FC<ProfileScoreProps> = ({ score }) => {
    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-500';
        if (s >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (s: number) => {
        if (s >= 80) return 'bg-green-500/10';
        if (s >= 60) return 'bg-yellow-500/10';
        return 'bg-red-500/10';
    };

    return (
        <div className={cn("flex flex-col items-center justify-center p-8 rounded-full border-8 w-48 h-48 mx-auto", getScoreBg(score))}>
            <span className={cn("text-5xl font-bold", getScoreColor(score))}>
                {score}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
                Score
            </span>
        </div>
    );
};
