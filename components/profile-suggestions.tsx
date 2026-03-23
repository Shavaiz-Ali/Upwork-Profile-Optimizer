import React from 'react';
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface ProfileSuggestionsProps {
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
}

export const ProfileSuggestions: React.FC<ProfileSuggestionsProps> = ({ suggestions, strengths, weaknesses }) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Strengths */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <Card className="h-full border-none bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors shadow-none ring-1 ring-emerald-500/20 group">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Strengths</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {strengths.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 group/item">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1 group-hover/item:scale-125 transition-transform" />
                                    <span className="text-sm leading-snug text-muted-foreground">{point}</span>
                                </li>
                            ))}
                            {strengths.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No strengths identified yet.</p>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Areas to Improve */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
                <Card className="h-full border-none bg-orange-500/5 hover:bg-orange-500/10 transition-colors shadow-none ring-1 ring-orange-500/20 group">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg font-bold text-orange-700 dark:text-orange-400">Areas to Improve</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {weaknesses.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 group/item">
                                    <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-1 group-hover/item:scale-125 transition-transform" />
                                    <span className="text-sm leading-snug text-muted-foreground">{point}</span>
                                </li>
                            ))}
                            {weaknesses.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No specific weaknesses found.</p>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* AI Optimization Suggestions */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both md:col-span-2 lg:col-span-1">
                <Card className="h-full border-none bg-blue-500/5 hover:bg-blue-500/10 transition-colors shadow-none ring-1 ring-blue-500/20 group">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform">
                                <Lightbulb className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-400">AI Suggestions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {suggestions.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 group/item">
                                    <div className="h-4 w-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1 group-hover/item:bg-blue-500/30 transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    </div>
                                    <span className="text-sm font-medium leading-snug">{point}</span>
                                </li>
                            ))}
                            {suggestions.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No suggestions generated.</p>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
