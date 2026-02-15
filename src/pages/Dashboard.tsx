import React from "react";
import { useFakeApi } from "@/hooks/useFakeApi";
import * as api from "@/services/fakeApi";
import {
  FolderKanban,
  ClipboardList,
  CheckCircle,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard: React.FC = () => {
  const { data, loading, error, retry } = useFakeApi(api.getDashboardStats);

  const users = useFakeApi(api.getUsers);

  /* ================= LOADING ================= */

  if (loading || users.loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || users.error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-12">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-destructive">{error || users.error}</p>
        <Button
          onClick={() => {
            retry();
            users.retry();
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  /* ================= KPI CARDS ================= */

  const kpis = [
    {
      label: "Total Projects",
      value: data.totalProjects,
      icon: FolderKanban,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Total Tasks",
      value: data.totalTasks,
      icon: ClipboardList,
      color: "text-info bg-info/10",
    },
    {
      label: "Completed Tasks",
      value: data.completedTasks,
      icon: CheckCircle,
      color: "text-success bg-success/10",
    },
    {
      label: "Team Members",
      value: data.teamMembers,
      icon: Users,
      color: "text-warning bg-warning/10",
    },
  ];

  const userMap = new Map((users.data || []).map((u) => [u.id, u]));

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your team's performance.
        </p>
      </div>

      {/* ================= KPI GRID ================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {k.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.color}`}
              >
                <k.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= BAR CHART ================= */}

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Task Progress
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.tasksByMonth}>
            <CartesianGrid
              stroke="hsl(var(--color-border))"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 12,
                fill: "hsl(var(--color-muted-foreground))",
              }}
              axisLine={{ stroke: "hsl(var(--color-border))" }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 12,
                fill: "hsl(var(--color-muted-foreground))",
              }}
              axisLine={{ stroke: "hsl(var(--color-border))" }}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

            <Legend />

            <Bar
              dataKey="completed"
              name="Completed"
              fill="hsl(var(--color-chart-2))"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="inProgress"
              name="In Progress"
              fill="hsl(var(--color-chart-1))"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="todo"
              name="To Do"
              fill="hsl(var(--color-chart-3))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= RECENT ACTIVITY ================= */}

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Recent Activity
        </h2>

        <div className="space-y-4">
          {data.recentActivity.map((a) => {
            const u = userMap.get(a.userId);

            return (
              <div key={a.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {u?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "??"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{u?.name || "Unknown"}</span>{" "}
                    {a.action}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {a.target} · {new Date(a.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
