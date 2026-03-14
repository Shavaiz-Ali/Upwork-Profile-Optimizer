import React from 'react';
import { UpworkProfile } from '@/types/profile';
import { Card } from './card';
import { Heading4, Paragraph } from './typography';

interface ProfileSummaryProps {
    profile: UpworkProfile;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile }) => {
    return (
        <Card title="Current Profile Summary">
            <div className="space-y-4">
                <div>
                    <Heading4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Title</Heading4>
                    <Paragraph className="mt-1">{profile.title}</Paragraph>
                </div>
                <div>
                    <Heading4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Hourly Rate</Heading4>
                    <Paragraph className="mt-1">{profile.hourlyRate}</Paragraph>
                </div>
                <div>
                    <Heading4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Skills</Heading4>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {profile.skills.map(skill => (
                            <span key={skill} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary/20">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};
