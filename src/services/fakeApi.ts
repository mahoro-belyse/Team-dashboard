import type {
  User,
  Project,
  Task,
  Message,
  Channel,
  CalendarEvent,
  Notification,
  Activity,
} from "../types/index";

const delay = (ms?: number) =>
  new Promise((r) => setTimeout(r, ms ?? 1000 + Math.random() * 1000));

const maybeError = (rate = 0.05) => {
  if (Math.random() < rate) throw new Error("Network error. Please try again.");
};

function getLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function setLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed data
const seedUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@teamcollab.com",
    password: "password123",
    role: "admin",
    avatar: "",
    department: "Engineering",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@teamcollab.com",
    password: "password123",
    role: "manager",
    avatar: "",
    department: "Design",
    joinedAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike@teamcollab.com",
    password: "password123",
    role: "member",
    avatar: "",
    department: "Marketing",
    joinedAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Emily Park",
    email: "emily@teamcollab.com",
    password: "password123",
    role: "member",
    avatar: "",
    department: "Engineering",
    joinedAt: "2024-04-05",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@teamcollab.com",
    password: "password123",
    role: "manager",
    avatar: "",
    department: "Product",
    joinedAt: "2024-05-20",
  },
];

const seedProjects: Project[] = [
  {
    id: "p1",
    title: "Website Redesign",
    description:
      "Complete overhaul of the company website with modern design patterns and improved UX.",
    status: "active",
    priority: "high",
    deadline: "2026-04-15",
    progress: 65,
    members: ["1", "2", "4"],
    tags: ["design", "frontend", "ux"],
    milestones: [
      { id: "m1", title: "Wireframes Complete", completed: true },
      { id: "m2", title: "Design System", completed: true },
      { id: "m3", title: "Development", completed: false },
      { id: "m4", title: "QA & Launch", completed: false },
    ],
    tasks: ["t1", "t2", "t3"],
    activities: [
      {
        id: "a1",
        userId: "1",
        action: "updated project status",
        timestamp: "2026-02-13T10:30:00Z",
        target: "Website Redesign",
      },
      {
        id: "a2",
        userId: "2",
        action: "added new milestone",
        timestamp: "2026-02-12T14:00:00Z",
        target: "Design System",
      },
    ],
    createdAt: "2025-11-01",
  },
  {
    id: "p2",
    title: "Mobile App v2",
    description:
      "Second major version of the mobile application with offline support and push notifications.",
    status: "active",
    priority: "high",
    deadline: "2026-06-30",
    progress: 35,
    members: ["1", "3", "5"],
    tags: ["mobile", "react-native"],
    milestones: [
      { id: "m5", title: "Architecture Review", completed: true },
      { id: "m6", title: "Core Features", completed: false },
      { id: "m7", title: "Beta Testing", completed: false },
    ],
    tasks: ["t4", "t5"],
    activities: [
      {
        id: "a3",
        userId: "3",
        action: "completed task",
        timestamp: "2026-02-11T09:00:00Z",
        target: "Push Notification Setup",
      },
    ],
    createdAt: "2025-12-15",
  },
  {
    id: "p3",
    title: "Q1 Marketing Campaign",
    description:
      "Multi-channel marketing campaign targeting enterprise clients.",
    status: "completed",
    priority: "medium",
    deadline: "2026-03-31",
    progress: 100,
    members: ["3", "5"],
    tags: ["marketing", "campaign"],
    milestones: [
      { id: "m8", title: "Strategy Defined", completed: true },
      { id: "m9", title: "Content Created", completed: true },
      { id: "m10", title: "Campaign Launched", completed: true },
    ],
    tasks: ["t6"],
    activities: [
      {
        id: "a4",
        userId: "5",
        action: "marked project as completed",
        timestamp: "2026-02-10T16:00:00Z",
        target: "Q1 Marketing Campaign",
      },
    ],
    createdAt: "2025-10-01",
  },
  {
    id: "p4",
    title: "Data Analytics Platform",
    description:
      "Internal analytics platform for tracking KPIs and generating automated reports.",
    status: "on-hold",
    priority: "low",
    deadline: "2026-08-01",
    progress: 15,
    members: ["1", "4"],
    tags: ["data", "analytics", "backend"],
    milestones: [
      { id: "m11", title: "Requirements Gathering", completed: true },
      { id: "m12", title: "Data Pipeline", completed: false },
    ],
    tasks: ["t7"],
    activities: [],
    createdAt: "2026-01-10",
  },
];

const seedTasks: Task[] = [
  {
    id: "t1",
    title: "Implement responsive navigation",
    description:
      "Build a fully responsive navigation with mobile hamburger menu.",
    status: "done",
    priority: "high",
    deadline: "2026-03-01",
    assignee: "1",
    projectId: "p1",
    createdAt: "2026-01-15",
  },
  {
    id: "t2",
    title: "Design landing page mockups",
    description: "Create high-fidelity mockups for the new landing page.",
    status: "in-progress",
    priority: "high",
    deadline: "2026-03-10",
    assignee: "2",
    projectId: "p1",
    createdAt: "2026-01-20",
  },
  {
    id: "t3",
    title: "Set up CI/CD pipeline",
    description: "Configure automated deployment pipeline with testing.",
    status: "todo",
    priority: "medium",
    deadline: "2026-03-20",
    assignee: "4",
    projectId: "p1",
    createdAt: "2026-02-01",
  },
  {
    id: "t4",
    title: "Implement offline mode",
    description: "Add offline data caching and sync when back online.",
    status: "in-progress",
    priority: "high",
    deadline: "2026-04-15",
    assignee: "1",
    projectId: "p2",
    createdAt: "2026-01-10",
  },
  {
    id: "t5",
    title: "Push notification integration",
    description: "Integrate push notifications with Firebase Cloud Messaging.",
    status: "todo",
    priority: "medium",
    deadline: "2026-05-01",
    assignee: "3",
    projectId: "p2",
    createdAt: "2026-01-25",
  },
  {
    id: "t6",
    title: "Create social media content",
    description: "Design and write content for all social media channels.",
    status: "done",
    priority: "medium",
    deadline: "2026-02-15",
    assignee: "3",
    projectId: "p3",
    createdAt: "2025-12-01",
  },
  {
    id: "t7",
    title: "Define data schema",
    description: "Design the database schema for the analytics platform.",
    status: "todo",
    priority: "low",
    deadline: "2026-06-01",
    assignee: "4",
    projectId: "p4",
    createdAt: "2026-01-20",
  },
];

const seedChannels: Channel[] = [
  { id: "ch1", name: "General", unread: 3 },
  { id: "ch2", name: "Engineering", unread: 1 },
  { id: "ch3", name: "Design", unread: 0 },
  { id: "ch4", name: "Marketing", unread: 5 },
];

const seedMessages: Message[] = [
  {
    id: "msg1",
    channelId: "ch1",
    senderId: "1",
    content: "Hey team, the sprint review is tomorrow at 10 AM.",
    timestamp: "2026-02-13T09:00:00Z",
  },
  {
    id: "msg2",
    channelId: "ch1",
    senderId: "2",
    content: "Thanks Alex! I'll have the design updates ready.",
    timestamp: "2026-02-13T09:15:00Z",
  },
  {
    id: "msg3",
    channelId: "ch1",
    senderId: "3",
    content: "I'll prepare the marketing metrics report.",
    timestamp: "2026-02-13T09:30:00Z",
  },
  {
    id: "msg4",
    channelId: "ch2",
    senderId: "1",
    content: "The new API endpoint is deployed to staging.",
    timestamp: "2026-02-13T11:00:00Z",
  },
  {
    id: "msg5",
    channelId: "ch2",
    senderId: "4",
    content: "Running tests now, will report back.",
    timestamp: "2026-02-13T11:15:00Z",
  },
];

const seedEvents: CalendarEvent[] = [
  {
    id: "ev1",
    title: "Sprint Review",
    date: "2026-02-14",
    type: "meeting",
    description: "Bi-weekly sprint review with stakeholders",
  },
  {
    id: "ev2",
    title: "Website Redesign Deadline",
    date: "2026-04-15",
    type: "deadline",
    description: "Final delivery of redesigned website",
  },
  {
    id: "ev3",
    title: "Team Building",
    date: "2026-02-20",
    type: "event",
    description: "Team outing and activities",
  },
  {
    id: "ev4",
    title: "Design Review",
    date: "2026-02-18",
    type: "meeting",
    description: "Review new design system components",
  },
];

const seedNotifications: Notification[] = [
  {
    id: "n1",
    message: "New task assigned: Implement responsive navigation",
    timestamp: "2026-02-13T10:00:00Z",
    read: false,
    archived: false,
    type: "info",
    icon: "ClipboardList",
  },
  {
    id: "n2",
    message: 'Project "Website Redesign" updated to 65% progress',
    timestamp: "2026-02-12T15:00:00Z",
    read: false,
    archived: false,
    type: "success",
    icon: "TrendingUp",
  },
  {
    id: "n3",
    message: "Deadline approaching: Mobile App v2 milestone",
    timestamp: "2026-02-11T08:00:00Z",
    read: true,
    archived: false,
    type: "warning",
    icon: "AlertTriangle",
  },
  {
    id: "n4",
    message: "Sarah Chen commented on your task",
    timestamp: "2026-02-10T14:00:00Z",
    read: true,
    archived: false,
    type: "info",
    icon: "MessageSquare",
  },
  {
    id: "n5",
    message: "Q1 Marketing Campaign marked as completed",
    timestamp: "2026-02-10T16:00:00Z",
    read: false,
    archived: false,
    type: "success",
    icon: "CheckCircle",
  },
];

function initData() {
  if (!localStorage.getItem("users")) setLS("users", seedUsers);
  if (!localStorage.getItem("projects")) setLS("projects", seedProjects);
  if (!localStorage.getItem("tasks")) setLS("tasks", seedTasks);
  if (!localStorage.getItem("channels")) setLS("channels", seedChannels);
  if (!localStorage.getItem("messages")) setLS("messages", seedMessages);
  if (!localStorage.getItem("events")) setLS("events", seedEvents);
  if (!localStorage.getItem("notifications"))
    setLS("notifications", seedNotifications);
}

initData();

// Auth
export async function login(email: string, password: string): Promise<User> {
  await delay();
  maybeError();
  const users = getLS<User[]>("users", seedUsers);
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password.");
  const { password: _, ...safe } = user;
  setLS("currentUser", safe);
  return safe as User;
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  await delay();
  maybeError();
  const users = getLS<User[]>("users", seedUsers);
  if (users.find((u) => u.email === email))
    throw new Error("Email already in use.");
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role: "member",
    avatar: "",
    department: "General",
    joinedAt: new Date().toISOString().slice(0, 10),
  };
  users.push(newUser);
  setLS("users", users);
  const { password: _, ...safe } = newUser;
  setLS("currentUser", safe);
  return safe as User;
}

export async function forgotPassword(email: string): Promise<string> {
  await delay();
  maybeError();
  const users = getLS<User[]>("users", seedUsers);
  if (!users.find((u) => u.email === email))
    throw new Error("Email not found.");
  return "Password reset link sent to your email.";
}

export async function logout(): Promise<void> {
  localStorage.removeItem("currentUser");
}

export function getCurrentUser(): User | null {
  return getLS<User | null>("currentUser", null);
}

// Users
export async function getUsers(): Promise<User[]> {
  await delay();
  maybeError();
  return getLS<User[]>("users", seedUsers).map(
    ({ password: _, ...u }) => u as User,
  );
}

export async function updateUser(
  id: string,
  data: Partial<User>,
): Promise<User> {
  await delay();
  maybeError();
  const users = getLS<User[]>("users", seedUsers);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found.");
  users[idx] = { ...users[idx], ...data };
  setLS("users", users);
  if (getCurrentUser()?.id === id) {
    const { password: _, ...safe } = users[idx];
    setLS("currentUser", safe);
  }
  return users[idx];
}

export async function deleteUser(id: string): Promise<void> {
  await delay();
  maybeError();
  const users = getLS<User[]>("users", seedUsers).filter((u) => u.id !== id);
  setLS("users", users);
}

// Projects
export async function getProjects(): Promise<Project[]> {
  await delay();
  maybeError();
  return getLS<Project[]>("projects", seedProjects);
}

export async function addProject(
  project: Omit<Project, "id" | "createdAt" | "activities">,
): Promise<Project> {
  await delay();
  maybeError();
  const projects = getLS<Project[]>("projects", seedProjects);
  const newP: Project = {
    ...project,
    id: "p" + Date.now(),
    createdAt: new Date().toISOString().slice(0, 10),
    activities: [],
  };
  projects.push(newP);
  setLS("projects", projects);
  return newP;
}

export async function updateProject(
  id: string,
  data: Partial<Project>,
): Promise<Project> {
  await delay();
  maybeError();
  const projects = getLS<Project[]>("projects", seedProjects);
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Project not found.");
  projects[idx] = { ...projects[idx], ...data };
  setLS("projects", projects);
  return projects[idx];
}

export async function deleteProject(id: string): Promise<void> {
  await delay();
  maybeError();
  const projects = getLS<Project[]>("projects", seedProjects).filter(
    (p) => p.id !== id,
  );
  setLS("projects", projects);
}

// Tasks
export async function getTasks(): Promise<Task[]> {
  await delay();
  maybeError();
  return getLS<Task[]>("tasks", seedTasks);
}

export async function addTask(
  task: Omit<Task, "id" | "createdAt">,
): Promise<Task> {
  await delay();
  maybeError();
  const tasks = getLS<Task[]>("tasks", seedTasks);
  const newT: Task = {
    ...task,
    id: "t" + Date.now(),
    createdAt: new Date().toISOString().slice(0, 10),
  };
  tasks.push(newT);
  setLS("tasks", tasks);
  return newT;
}

export async function updateTask(
  id: string,
  data: Partial<Task>,
): Promise<Task> {
  await delay();
  maybeError();
  const tasks = getLS<Task[]>("tasks", seedTasks);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found.");
  tasks[idx] = { ...tasks[idx], ...data };
  setLS("tasks", tasks);
  return tasks[idx];
}

// Messages & Channels
export async function getChannels(): Promise<Channel[]> {
  await delay(500);
  return getLS<Channel[]>("channels", seedChannels);
}

export async function getMessages(channelId: string): Promise<Message[]> {
  await delay(500);
  return getLS<Message[]>("messages", seedMessages).filter(
    (m) => m.channelId === channelId,
  );
}

export async function sendMessage(
  msg: Omit<Message, "id" | "timestamp">,
): Promise<Message> {
  await delay(300);
  const messages = getLS<Message[]>("messages", seedMessages);
  const newM: Message = {
    ...msg,
    id: "msg" + Date.now(),
    timestamp: new Date().toISOString(),
  };
  messages.push(newM);
  setLS("messages", messages);
  return newM;
}

export async function markChannelRead(channelId: string): Promise<void> {
  const channels = getLS<Channel[]>("channels", seedChannels);
  const idx = channels.findIndex((c) => c.id === channelId);
  if (idx !== -1) {
    channels[idx].unread = 0;
    setLS("channels", channels);
  }
}

// Calendar Events
export async function getEvents(): Promise<CalendarEvent[]> {
  await delay();
  maybeError();
  return getLS<CalendarEvent[]>("events", seedEvents);
}

export async function addEvent(
  event: Omit<CalendarEvent, "id">,
): Promise<CalendarEvent> {
  await delay();
  maybeError();
  const events = getLS<CalendarEvent[]>("events", seedEvents);
  const newE: CalendarEvent = { ...event, id: "ev" + Date.now() };
  events.push(newE);
  setLS("events", events);
  return newE;
}

// Notifications
export async function getNotifications(): Promise<Notification[]> {
  await delay();
  maybeError();
  return getLS<Notification[]>("notifications", seedNotifications);
}

export async function markNotificationRead(id: string): Promise<void> {
  const notifs = getLS<Notification[]>("notifications", seedNotifications);
  const idx = notifs.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifs[idx].read = true;
    setLS("notifications", notifs);
  }
}

export async function archiveNotification(id: string): Promise<void> {
  const notifs = getLS<Notification[]>("notifications", seedNotifications);
  const idx = notifs.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifs[idx].archived = true;
    setLS("notifications", notifs);
  }
}

// Dashboard stats
export async function getDashboardStats(): Promise<{
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  teamMembers: number;
  tasksByMonth: {
    month: string;
    completed: number;
    inProgress: number;
    todo: number;
  }[];
  recentActivity: Activity[];
}> {
  await delay();
  maybeError();
  const projects = getLS<Project[]>("projects", seedProjects);
  const tasks = getLS<Task[]>("tasks", seedTasks);
  const users = getLS<User[]>("users", seedUsers);
  return {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "done").length,
    teamMembers: users.length,
    tasksByMonth: [
      { month: "Sep", completed: 8, inProgress: 5, todo: 3 },
      { month: "Oct", completed: 12, inProgress: 7, todo: 4 },
      { month: "Nov", completed: 15, inProgress: 6, todo: 2 },
      { month: "Dec", completed: 10, inProgress: 8, todo: 5 },
      { month: "Jan", completed: 18, inProgress: 4, todo: 3 },
      { month: "Feb", completed: 14, inProgress: 9, todo: 6 },
    ],
    recentActivity: [
      {
        id: "ra1",
        userId: "1",
        action: "deployed staging build",
        timestamp: "2026-02-14T08:30:00Z",
        target: "Website Redesign",
      },
      {
        id: "ra2",
        userId: "2",
        action: "uploaded new design assets",
        timestamp: "2026-02-13T16:45:00Z",
        target: "Design System",
      },
      {
        id: "ra3",
        userId: "3",
        action: "published blog post",
        timestamp: "2026-02-13T14:20:00Z",
        target: "Q1 Campaign",
      },
      {
        id: "ra4",
        userId: "4",
        action: "fixed critical bug",
        timestamp: "2026-02-13T11:10:00Z",
        target: "Mobile App v2",
      },
      {
        id: "ra5",
        userId: "5",
        action: "reviewed pull request",
        timestamp: "2026-02-12T17:00:00Z",
        target: "Data Pipeline",
      },
    ],
  };
}

// Reports
export async function getReportData(): Promise<{
  productivity: { week: string; tasks: number; hours: number }[];
  completion: { name: string; value: number }[];
  projectProgress: { name: string; progress: number; target: number }[];
}> {
  await delay();
  maybeError();
  return {
    productivity: [
      { week: "W1", tasks: 12, hours: 38 },
      { week: "W2", tasks: 15, hours: 42 },
      { week: "W3", tasks: 10, hours: 35 },
      { week: "W4", tasks: 18, hours: 45 },
      { week: "W5", tasks: 22, hours: 48 },
      { week: "W6", tasks: 16, hours: 40 },
    ],
    completion: [
      { name: "Completed", value: 45 },
      { name: "In Progress", value: 30 },
      { name: "To Do", value: 25 },
    ],
    projectProgress: [
      { name: "Website Redesign", progress: 65, target: 80 },
      { name: "Mobile App v2", progress: 35, target: 50 },
      { name: "Q1 Campaign", progress: 100, target: 100 },
      { name: "Analytics Platform", progress: 15, target: 30 },
    ],
  };
}

// Settings
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string,
): Promise<string> {
  await delay();
  maybeError();
  const users = getLS<User[]>("users", seedUsers);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found.");
  if (user.password !== oldPassword)
    throw new Error("Current password is incorrect.");
  user.password = newPassword;
  setLS("users", users);
  return "Password changed successfully.";
}
