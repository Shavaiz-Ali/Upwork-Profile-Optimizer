"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Key, Plus, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { saveApiKeyAction, deleteApiKeyAction } from "@/actions/settings.actions";
import { toast } from "sonner";

export const ApiKeySettings = ({ initialKeys }: { initialKeys: any[] }) => {
  const [keys, setKeys] = useState(initialKeys);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will also deactivate models using this key.")) return;

    const res = await deleteApiKeyAction(id);
    if (res.success) {
      setKeys(keys.filter((k) => k._id !== id));
      toast.success("API Key deleted");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      provider: formData.get("provider"),
      label: formData.get("label"),
      key: formData.get("key"),
    };

    const res = await saveApiKeyAction(data);
    if (res.success) {
      toast.success("API Key saved");
      setIsDialogOpen(false);
      window.location.reload(); // Simple refresh to get new data
    } else {
      toast.error(res.error || "Failed to save");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">API Keys</h2>
          <p className="text-sm text-muted-foreground">Manage your AI provider credentials safely</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add API Key</DialogTitle>
                <DialogDescription>
                  Choose a provider and enter your API key label and value.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select name="provider" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="label">Label</Label>
                  <Input id="label" name="label" placeholder="e.g. My Personal Key" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key">API Key Value</Label>
                  <Input id="key" name="key" type="password" placeholder="sk-..." required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Key"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {keys.map((k) => (
          <Card key={k._id} className="border-none bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${k.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                  <Key className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold uppercase tracking-tight">{k.provider}</CardTitle>
              </div>
              {k.isActive ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-yellow-500" />}
            </CardHeader>
            <CardContent>
              <div className="mt-2 text-lg font-bold">{k.label}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                ••••••••••••••••
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(k._id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {keys.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-card/40">
            <Key className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No API keys added yet</p>
            <p className="text-sm text-muted-foreground">Add a key to start configuring AI models</p>
          </div>
        )}
      </div>
    </div>
  );
};
