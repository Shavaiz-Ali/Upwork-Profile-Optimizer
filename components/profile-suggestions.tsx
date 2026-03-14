import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from './card';

interface ProfileSuggestionsProps {
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
}

export const ProfileSuggestions: React.FC<ProfileSuggestionsProps> = ({ suggestions, strengths, weaknesses }) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card title="Strengths" className="border-green-500/20">
                <ul className="space-y-4">
                    {strengths.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card title="Areas to Improve" className="border-red-500/20">
                <ul className="space-y-4">
                    {weaknesses.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card title="Key Suggestions" className="border-blue-500/20">
                <ul className="space-y-4">
                    {suggestions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                            <span className="text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};
