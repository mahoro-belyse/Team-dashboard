import React, { useState, useEffect, useRef } from "react";
import { useFakeApi } from "@/hooks/useFakeApi";
import * as api from "@/services/fakeApi";
import { useAuth } from "@/hooks/useAuth";
import type { Message } from "../types/index";
import { Loader2, Send, Hash, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

const Communication: React.FC = () => {
  const { user } = useAuth();
  const {
    data: channels,
    loading: chLoading,
    execute: reloadChannels,
  } = useFakeApi(api.getChannels);
  const usersApi = useFakeApi(api.getUsers);
  const [activeChannel, setActiveChannel] = useState<string>("ch1");
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  const userMap = new Map((usersApi.data || []).map((u) => [u.id, u]));

  useEffect(() => {
    loadMessages(activeChannel);
  }, [activeChannel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (chId: string) => {
    setMsgLoading(true);
    try {
      const msgs = await api.getMessages(chId);
      setMessages(msgs);
      await api.markChannelRead(chId);
      await reloadChannels();
    } catch {
    } finally {
      setMsgLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const msg = await api.sendMessage({
      channelId: activeChannel,
      senderId: user.id,
      content: input.trim(),
    });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (chLoading || usersApi.loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Channel sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-56 border-r border-border bg-card overflow-y-auto transform lg:static lg:translate-x-0 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-foreground text-sm">Channels</h2>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <div className="p-2 space-y-0.5">
          {(channels || []).map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChannel(ch.id);
                setSidebarOpen(false); // close sidebar on mobile after selecting
              }}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                activeChannel === ch.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {ch.name}
              </span>
              {ch.unread > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5">
                  {ch.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar with hamburger for mobile */}
        <div className="border-b border-border px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            {(channels || []).find((c) => c.id === activeChannel)?.name ||
              "Channel"}
          </h3>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex border-b border-border px-6 py-3">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            {(channels || []).find((c) => c.id === activeChannel)?.name ||
              "Channel"}
          </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {msgLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            messages.map((msg) => {
              const sender = userMap.get(msg.senderId);
              const isMine = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {sender?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </div>
                  <div className={`max-w-[70%] ${isMine ? "text-right" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">
                        {sender?.name || "Unknown"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`rounded-xl px-4 py-2.5 text-sm ${
                        isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1"
            />
            <button
              onClick={handleSend}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
