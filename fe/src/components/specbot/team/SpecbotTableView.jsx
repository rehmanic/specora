"use client";

import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  ListChecks, 
  MessageSquare, 
  Calendar,
  ChevronRight,
  Bot
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SpecbotTableView({ 
  chats = [], 
  onAction, 
  onViewChat,
  actionLoading = false,
  downloadedChatIds = new Set()
}) {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[40%] px-6 py-4 font-bold text-foreground">Chat Title</TableHead>
            <TableHead className="px-6 py-4 font-bold text-foreground">Created Date</TableHead>
            <TableHead className="px-6 py-4 font-bold text-foreground">Status</TableHead>
            <TableHead className="px-6 py-4 text-right font-bold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chats.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                No chats found for this project.
              </TableCell>
            </TableRow>
          ) : (
            chats.map((chat) => {
              const isDownloaded = downloadedChatIds.has(chat.id);
              
              return (
                <TableRow key={chat.id} className="group hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-none">{chat.title || "Untitled Chat"}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">Chat ID: {chat.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {chat.created_at ? format(new Date(chat.created_at), "MMM d, yyyy") : "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {isDownloaded ? (
                      <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] h-5 px-1.5 uppercase tracking-wider font-bold">
                        Analyzable
                      </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 uppercase tracking-wider font-bold">
                        Chat Only
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:bg-primary/10"
                              onClick={() => onViewChat(chat)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">View Chat</TooltipContent>
                        </Tooltip>

                        <div className="w-px h-4 bg-border/50 mx-1" />

                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 hover:bg-accent disabled:opacity-50"
                              onClick={() => onAction("download", chat)}
                              disabled={actionLoading}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Download</TooltipContent>
                        </Tooltip>

                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 hover:bg-accent disabled:opacity-50"
                              onClick={() => onAction("summarize", chat)}
                              disabled={actionLoading || !isDownloaded}
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Summarize</TooltipContent>
                        </Tooltip>

                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 hover:bg-accent disabled:opacity-50"
                              onClick={() => onAction("extract", chat)}
                              disabled={actionLoading || !isDownloaded}
                            >
                              <ListChecks className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Extract Requirements</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
