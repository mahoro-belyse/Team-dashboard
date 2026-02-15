import React, { useState } from "react";
import { useFakeApi } from "@/hooks/useFakeApi";
import * as api from "@/services/fakeApi";

import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
};
const columnConfig = [
  { key: "todo" as const, label: "To Do", color: "border-muted-foreground/30" },
  {
    key: "in-progress" as const,
    label: "In Progress",
    color: "border-primary/50",
  },
  { key: "done" as const, label: "Done", color: "border-success/50" },
];

const Tasks: React.FC = () => {
  const {
    data: tasks,
    loading,
    error,
    retry,
    execute: reload,
  } = useFakeApi(api.getTasks);
  const usersApi = useFakeApi(api.getUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<"todo" | "in-progress" | "done">("todo");

  const userMap = new Map((usersApi.data || []).map((u) => [u.id, u]));

  if (loading || usersApi.loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (error)
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
        <Button onClick={retry}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );

  const allTasks = tasks || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.addTask({
        title,
        description: desc,
        status,
        priority,
        deadline,
        assignee: "1",
        projectId: "p1",
      });
      await reload();
      setShowAdd(false);
      setTitle("");
      setDesc("");
      setDeadline("");
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Kanban board</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {columnConfig.map((col) => {
          const colTasks = allTasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className={`rounded-xl border-t-4 ${col.color} border border-border bg-card`}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">
                  {col.label}
                </h3>
                <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                  {colTasks.length}
                </span>
              </div>
              <div className="p-3 space-y-3 min-h-[200px]">
                {colTasks.map((t) => {
                  const u = userMap.get(t.assignee);
                  return (
                    <div
                      key={t.id}
                      className="rounded-lg border border-border bg-background p-3 space-y-2 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-foreground">
                          {t.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${priorityColors[t.priority]}`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {t.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {t.deadline}
                        </span>
                        <div
                          className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary"
                          title={u?.name}
                        >
                          {u?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "?"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Add Task
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
