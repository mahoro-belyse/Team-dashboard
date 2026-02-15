import React from "react";
import { useFakeApi } from "@/hooks/useFakeApi";
import * as api from "@/services/fakeApi";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const roleColors: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  manager: "bg-primary/10 text-primary",
  member: "bg-muted text-muted-foreground",
};

const Team: React.FC = () => {
  const { data: users, loading, error, retry } = useFakeApi(api.getUsers);
  const navigate = useNavigate();

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

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {(users || []).length} members
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(users || []).map((u) => (
          <div
            key={u.id}
            className="rounded-xl border border-border bg-card p-5 text-center hover:shadow-md transition-shadow"
          >
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
              {u.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h3 className="font-semibold text-foreground">{u.name}</h3>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role]}`}
            >
              {u.role}
            </span>
            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Mail className="h-3 w-3" />
              {u.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {u.department} · Joined {u.joinedAt}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
