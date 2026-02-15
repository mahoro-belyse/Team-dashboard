export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "manager" | "member";
  avatar: string;
  department: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  priority: "high" | "medium" | "low";
  deadline: string;
  progress: number;
  members: string[];
  tags: string[];
  milestones: Milestone[];
  tasks: string[];
  activities: Activity[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "high" | "medium" | "low";
  deadline: string;
  assignee: string;
  projectId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Channel {
  id: string;
  name: string;
  unread: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "deadline" | "meeting" | "event";
  description: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  type: "info" | "warning" | "success";
  icon: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  target: string;
}
