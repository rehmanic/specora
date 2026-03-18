"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, ListChecks, MessageSquare, Calendar, ChevronRight, Bot } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SpecbotTableView({
  chats = [],
  onAction,
  onViewChat,
  actionLoading = false,
  downloadedChatIds = new Set(),
}) {
  return (
    <div className="bg-card/50 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-300">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-foreground w-[40%] px-6 py-4 font-bold">Chat Title</TableHead>
            <TableHead className="text-foreground px-6 py-4 font-bold">Created Date</TableHead>
            <TableHead className="text-foreground px-6 py-4 font-bold">Status</TableHead>
            <TableHead className="text-foreground px-6 py-4 text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chats.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground h-32 text-center italic">
                No chats found for this project.
              </TableCell>
            </TableRow>
          ) : (
            chats.map((chat) => {
              const isUpToDate =
                chat.last_downloaded_at &&
                chat.updated_at &&
                new Date(chat.last_downloaded_at) >= new Date(chat.updated_at);
              const isDownloaded = isUpToDate || downloadedChatIds.has(chat.id);

              return (
                <TableRow key={chat.id} className="group hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm leading-none font-semibold">{chat.title || "Untitled Chat"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      {chat.created_at ? format(new Date(chat.created_at), "MMM d, yyyy") : "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {isDownloaded ? (
                      <Badge
                        variant="success"
                        className="h-5 border-emerald-500/20 bg-emerald-500/10 px-1.5 text-[10px] font-bold tracking-wider text-emerald-500 uppercase"
                      >
                        Analyzable
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase">
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
                              className="text-primary hover:bg-primary/10 h-8 w-8"
                              onClick={() => onViewChat(chat)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">View Chat</TooltipContent>
                        </Tooltip>

                        <div className="bg-border/50 mx-1 h-4 w-px" />

                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:bg-accent h-8 w-8 disabled:opacity-50"
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
                              className="hover:bg-accent h-8 w-8 disabled:opacity-50"
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
                              className="hover:bg-accent h-8 w-8 disabled:opacity-50"
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
