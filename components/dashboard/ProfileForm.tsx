"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateProfileAction } from "@/actions/user.actions";
import { toast } from "sonner";
import { User, Mail, Shield } from "lucide-react";

export const ProfileForm = ({ user }: { user: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
    };

    const res = await updateProfileAction(data);
    if (res.success) {
      toast.success("Profile updated");
    } else {
      toast.error(res.error || "Failed to update");
    }
    setIsLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 border-none bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details and public display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" defaultValue={user.name} className="pl-10" required />
                </div>
              </div>
              <div className="grid gap-2 opacity-60">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" value={user.email} className="pl-10 bg-muted cursor-not-allowed" disabled />
                </div>
                <p className="text-xs text-muted-foreground italic">Email cannot be changed contact support for help.</p>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
         <Card className="border-none bg-primary/5 shadow-none ring-1 ring-primary/10">
           <CardHeader>
             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-primary" />
             </div>
             <CardTitle className="text-lg">Subscription</CardTitle>
             <CardDescription>You are currently on the free plan.</CardDescription>
           </CardHeader>
           <CardContent>
              <Button variant="default" className="w-full">Upgrade to Pro</Button>
           </CardContent>
         </Card>

         <Card className="border-none bg-card/60 backdrop-blur-sm shadow-sm">
            <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground opacity-70">Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                    Two-Factor Auth
                    <Badge variant="secondary" className="ml-auto text-[10px]">Off</Badge>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                    Change Password
                </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

import { Badge } from "@/components/ui/badge";
