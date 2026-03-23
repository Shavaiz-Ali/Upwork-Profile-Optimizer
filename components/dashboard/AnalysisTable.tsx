import React from "react";
import { IAnalysis } from "@/lib/models/analysis.model";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Types } from "mongoose";

interface AnalysisTableProps {
  analyses: (IAnalysis & { _id: Types.ObjectId })[];
}

export const AnalysisTable = ({ analyses }: AnalysisTableProps) => {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((item) => (
            <TableRow key={item._id.toString()}>
              <TableCell className="font-medium">{item.profileName}</TableCell>
              <TableCell>{item.profileTitle}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    item.overallScore >= 80 ? 'bg-green-500' : 
                    item.overallScore >= 60 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} />
                  <span className="font-bold">{item.overallScore}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/analysis/${item._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
