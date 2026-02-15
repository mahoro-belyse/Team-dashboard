import React, { useState } from "react";
import { useFakeApi } from "@/hooks/useFakeApi";
import * as api from "@/services/fakeApi";
import type { Project } from "../types/index";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  "on-hold": "bg-warning/10 text-warning border-warning/20",
};

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
};

const Projects: React.FC = () => {
  const {
    data: projects,
    loading,
    error,
    retry,
    execute: reloadProjects,
  } = useFakeApi(api.getProjects);
  const usersApi = useFakeApi(api.getUsers);
  const tasksApi = useFakeApi(api.getTasks);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Add/Edit form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState<
    "active" | "completed" | "on-hold"
  >("active");
  const [formPriority, setFormPriority] = useState<"high" | "medium" | "low">(
    "medium",
  );
  const [formDeadline, setFormDeadline] = useState("");

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">(
    "medium",
  );
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskStatus, setTaskStatus] = useState<"todo" | "in-progress" | "done">(
    "todo",
  );

  const userMap = new Map((usersApi.data || []).map((u) => [u.id, u]));
  const allTasks = tasksApi.data || [];

  if (loading || usersApi.loading || tasksApi.loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-destructive text-sm">{error}</p>
        <Button onClick={retry}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  const projectList = projects || [];

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.addProject({
        title: formTitle,
        description: formDesc,
        status: formStatus,
        priority: formPriority,
        deadline: formDeadline,
        progress: 0,
        members: ["1"],
        tags: [],
        milestones: [],
        tasks: [],
      });
      await reloadProjects();
      setShowAddForm(false);
      setFormTitle("");
      setFormDesc("");
      setFormDeadline("");
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      const updated = await api.updateProject(selectedProject.id, {
        title: formTitle,
        description: formDesc,
        status: formStatus,
        priority: formPriority,
        deadline: formDeadline,
      });
      setSelectedProject(updated);
      await reloadProjects();
      setShowEditModal(false);
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      await api.deleteProject(selectedProject.id);
      setSelectedProject(null);
      setShowDeleteConfirm(false);
      await reloadProjects();
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      await api.addTask({
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        priority: taskPriority,
        deadline: taskDeadline,
        assignee: "1",
        projectId: selectedProject.id,
      });
      await tasksApi.execute();
      setShowAddTaskModal(false);
      setTaskTitle("");
      setTaskDesc("");
      setTaskDeadline("");
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = () => {
    if (!selectedProject) return;
    setFormTitle(selectedProject.title);
    setFormDesc(selectedProject.description);
    setFormStatus(selectedProject.status);
    setFormPriority(selectedProject.priority);
    setFormDeadline(selectedProject.deadline);
    setShowEditModal(true);
  };

  // ===================== PROJECT DETAILS VIEW =====================
  if (selectedProject) {
    const projectTasks = allTasks.filter(
      (t) => t.projectId === selectedProject.id,
    );
    const completedCount = projectTasks.filter(
      (t) => t.status === "done",
    ).length;
    const inProgressCount = projectTasks.filter(
      (t) => t.status === "in-progress",
    ).length;

    return (
      <div className="p-6 lg:p-8 space-y-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button variant="ghost" onClick={() => setSelectedProject(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={openEdit}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedProject.title}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[selectedProject.status]}`}
                >
                  {selectedProject.status}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[selectedProject.priority]}`}
                >
                  {selectedProject.priority}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Deadline:{" "}
                  {selectedProject.deadline}
                </span>
              </div>
            </div>
            <div className="flex -space-x-2">
              {selectedProject.members.map((mId) => {
                const u = userMap.get(mId);
                return (
                  <div
                    key={mId}
                    className="h-9 w-9 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-xs font-semibold text-primary"
                    title={u ? `${u.name} - ${u.role}` : mId}
                  >
                    {u?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {selectedProject.progress}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${selectedProject.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Description, Tags, Milestones */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Description</h2>
            <p className="text-sm text-muted-foreground">
              {selectedProject.description}
            </p>
            {selectedProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    <Tag className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-semibold text-foreground">Milestones</h2>
            {selectedProject.milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-2 text-sm">
                <CheckCircle
                  className={`h-4 w-4 ${m.completed ? "text-success" : "text-muted-foreground/40"}`}
                />
                <span
                  className={
                    m.completed ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {m.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Overview */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">
              Tasks ({projectTasks.length})
            </h2>
            <Button size="sm" onClick={() => setShowAddTaskModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </div>
          <div className="flex gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1 text-success">
              <CheckCircle className="h-4 w-4" /> {completedCount} Done
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Clock className="h-4 w-4" /> {inProgressCount} In Progress
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />{" "}
              {projectTasks.length - completedCount - inProgressCount} To Do
            </span>
          </div>
          <div className="space-y-2">
            {projectTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${t.status === "done" ? "text-success" : "text-muted-foreground/40"}`}
                  />
                  <span className="text-foreground">{t.title}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[t.priority]}`}
                >
                  {t.priority}
                </span>
              </div>
            ))}
            {projectTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No tasks yet.</p>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">
            Activity Timeline
          </h2>
          <div className="space-y-4">
            {selectedProject.activities.map((a) => {
              const u = userMap.get(a.userId);
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 border-l-2 border-border pl-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold -ml-[1.125rem]">
                    {u?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">
                        {u?.name || "Unknown"}
                      </span>{" "}
                      {a.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {selectedProject.activities.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <Modal title="Edit Project" onClose={() => setShowEditModal(false)}>
            <form onSubmit={handleEditProject} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirm */}
        {showDeleteConfirm && (
          <Modal
            title="Delete Project"
            onClose={() => setShowDeleteConfirm(false)}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete "{selectedProject.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
                disabled={actionLoading}
              >
                {actionLoading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </Modal>
        )}

        {/* Add Task Modal */}
        {showAddTaskModal && (
          <Modal title="Add Task" onClose={() => setShowAddTaskModal(false)}>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
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
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
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
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddTaskModal(false)}
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
          </Modal>
        )}
      </div>
    );
  }

  // ===================== PROJECT LIST VIEW =====================
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projectList.length} projects total
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectList.map((p) => (
          <div
            key={p.id}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[p.status]}`}
              >
                {p.status}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[p.priority]}`}
              >
                {p.priority}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {p.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {p.deadline}
              </span>
              <div className="flex -space-x-1.5">
                {p.members.slice(0, 3).map((mId) => {
                  const u = userMap.get(mId);
                  return (
                    <div
                      key={mId}
                      className="h-6 w-6 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[10px] font-semibold text-primary"
                    >
                      {u?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "?"}
                    </div>
                  );
                })}
                {p.members.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground">
                    +{p.members.length - 3}
                  </div>
                )}
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${p.progress}%` }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedProject(p)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddForm && (
        <Modal title="Add New Project" onClose={() => setShowAddForm(false)}>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as any)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Create Project
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Reusable Modal component within this file
const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Projects;
