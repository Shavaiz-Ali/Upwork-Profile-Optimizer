import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileScoreProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

export const ProfileScore: React.FC<ProfileScoreProps> = ({ 
    score, 
    size = 200, 
    strokeWidth = 12 
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getScoreColor = (s: number) => {
        if (s >= 80) return '#22c55e'; // green-500
        if (s >= 60) return '#eab308'; // yellow-500
        return '#ef4444'; // red-500
    };

    const getScoreLabel = (s: number) => {
        if (s >= 90) return "Excellent";
        if (s >= 80) return "Great";
        if (s >= 70) return "Good";
        if (s >= 60) return "Average";
        return "Needs Work";
    };

    const color = getScoreColor(score);

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div 
                className="relative flex items-center justify-center p-4 bg-card/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10"
                style={{ width: size + 40, height: size + 40 }}
            >
                {/* Background Shadow Glow */}
                <div 
                    className="absolute inset-0 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: color }}
                />

                <svg width={size} height={size} className="transform -rotate-90 relative z-10 transition-all duration-1000 ease-out">
                    {/* Background Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-muted/20"
                    />
                    
                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                    </defs>

                    {/* Progress Circle with standard SVG transitions */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="url(#scoreGradient)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        filter="drop-shadow(0 0 8px currentColor)"
                        style={{ 
                            color,
                            transition: 'stroke-dashoffset 1.5s ease-out'
                        }}
                    />
                </svg>

                {/* Score Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in duration-500 delay-500">
                    <span 
                        className={cn("text-6xl font-black tracking-tighter transition-all duration-500")}
                        style={{ color }}
                    >
                        {score}
                    </span>
                    <span className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground opacity-60">
                        Profile Score
                    </span>
                </div>
            </div>

            <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700">
                <span className="text-sm font-bold tracking-tight text-foreground/80">
                    {getScoreLabel(score)}
                </span>
            </div>
        </div>
    );
};
