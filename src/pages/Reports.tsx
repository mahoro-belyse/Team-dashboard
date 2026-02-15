import React from "react";
import { useFakeApi } from "@/hooks/useFakeApi";
import * as api from "@/services/fakeApi";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "hsl(var(--color-chart-2))",
  "hsl(var(--color-chart-1))",
  "hsl(var(--color-chart-3))",
];

const Reports: React.FC = () => {
  const { data, loading, error, retry } = useFakeApi(api.getReportData);

  if (loading)
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

  if (!data) return null;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analytics and insights
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Productivity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">
            Weekly Productivity
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.productivity}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--color-border))"
              />

              <XAxis
                dataKey="week"
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--color-muted-foreground))",
                }}
              />

              <YAxis
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--color-muted-foreground))",
                }}
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

              <Line
                type="monotone"
                dataKey="tasks"
                stroke="hsl(var(--color-chart-1))"
                name="Tasks"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--color-chart-2))"
                name="Hours"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Completion */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">
            Task Completion
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.completion}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.completion.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Progress */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">
          Project Progress vs Target
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.projectProgress} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--color-border))"
            />

            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{
                fontSize: 12,
                fill: "hsl(var(--color-muted-foreground))",
              }}
            />

            <YAxis
              dataKey="name"
              type="category"
              width={130}
              tick={{
                fontSize: 12,
                fill: "hsl(var(--color-muted-foreground))",
              }}
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
              dataKey="progress"
              fill="hsl(var(--color-chart-1))"
              name="Progress"
              radius={[0, 4, 4, 0]}
            />

            <Bar
              dataKey="target"
              fill="hsl(var(--color-chart-4))"
              name="Target"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
