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
import { Cpu, Plus, Trash2, Settings2, Sparkles } from "lucide-react";
import { saveAiModelAction, deleteAiModelAction } from "@/actions/settings.actions";
import { toast } from "sonner";

export const ModelSettings = ({ initialModels, apiKeys }: { initialModels: any[], apiKeys: any[] }) => {
  const [models, setModels] = useState(initialModels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this model configuration?")) return;
    
    const res = await deleteAiModelAction(id);
    if (res.success) {
      setModels(models.filter((m) => m._id !== id));
      toast.success("AI Model deleted");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      apiKeyId: formData.get("apiKeyId"),
      name: formData.get("name"),
      modelId: formData.get("modelId"),
    };

    const res = await saveAiModelAction(data);
    if (res.success) {
      toast.success("AI Model configured");
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to save");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">AI Models</h2>
          <p className="text-sm text-muted-foreground">Configure which models to use for your analyses</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={apiKeys.length === 0}>
              <Plus className="h-4 w-4" />
              New Model Config
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Configure AI Model</DialogTitle>
                <DialogDescription>
                  Map a specific AI model to one of your active API keys.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="apiKeyId">API Key</Label>
                  <Select name="apiKeyId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an API key" />
                    </SelectTrigger>
                    <SelectContent>
                      {apiKeys.map(k => (
                        <SelectItem key={k._id} value={k._id}>{k.label} ({k.provider})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Config Name</Label>
                  <Input id="name" name="name" placeholder="e.g. My GPT-4 Optimization" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modelId">Model ID</Label>
                  <Select name="modelId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo (OpenAI)</SelectItem>
                      <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (Anthropic)</SelectItem>
                      <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Google)</SelectItem>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Google)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Configuring..." : "Save Config"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {apiKeys.length === 0 && (
         <Card className="border-yellow-500/20 bg-yellow-500/5">
           <CardContent className="pt-6">
             <div className="flex items-center gap-3 text-yellow-600">
               <ShieldAlert className="h-5 w-5" />
               <p className="text-sm font-medium">You need at least one API key to configure AI models.</p>
             </div>
             <Button variant="link" className="px-0 mt-2 text-yellow-700" asChild>
               <Link href="/dashboard/settings/api-keys">Go to API Keys</Link>
             </Button>
           </CardContent>
         </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {models.map((m) => (
          <Card key={m._id} className="border-none bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Cpu className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold tracking-tight">{m.name}</CardTitle>
              </div>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm font-medium">{m.modelId}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Settings2 className="h-3 w-3" />
                  Key: {m.apiKeyId?.label || "Unknown"}
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(m._id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {models.length === 0 && apiKeys.length > 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-card/40">
             <Cpu className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
             <p className="text-muted-foreground font-medium">No model configurations found</p>
             <p className="text-sm text-muted-foreground">Select a model and link it to an API key to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import { ShieldAlert } from "lucide-react";
import Link from "next/link";
