"use client";

import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';

interface UrlFormProps {
    onSubmit: (url: string) => void;
    isLoading?: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!url) {
            setError('Please enter an Upwork profile URL');
            return;
        }

        if (!url.includes('upwork.com/freelancers/')) {
            setError('Please enter a valid Upwork freelancer URL');
            return;
        }

        onSubmit(url);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
                <Input
                    label="Upwork Profile URL"
                    placeholder="https://www.upwork.com/freelancers/~0123456789abcdef"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    error={error}
                />
            </div>
            <Button type="submit" isLoading={isLoading} className="sm:mb-0">
                Analyze Profile
            </Button>
        </form>
    );
};
