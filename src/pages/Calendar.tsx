import React, { useState, useMemo } from "react";
import { useFakeApi } from "@/hooks/useFakeApi";
import * as api from "@/services/fakeApi";
import type { CalendarEvent } from "../types/index";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const typeColors: Record<string, string> = {
  deadline: "bg-destructive/80 text-white",
  meeting: "bg-primary/80 text-white",
  event: "bg-success/80 text-white",
};

const CalendarPage: React.FC = () => {
  const {
    data: events,
    loading,
    error,
    retry,
    execute: reload,
  } = useFakeApi(api.getEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"deadline" | "meeting" | "event">("meeting");
  const [date, setDate] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    (events || []).forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.addEvent({ title, date, type, description: desc });
      await reload();
      setShowAdd(false);
      setTitle("");
      setDesc("");
      setDate("");
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

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

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {monthName} {year}
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Event
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button onClick={prevMonth} className="p-2 rounded-md hover:bg-muted">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-semibold text-foreground">
            {monthName} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-md hover:bg-muted">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-3">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const dateStr = d
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
              : "";
            const dayEvents = d ? eventsByDate[dateStr] || [] : [];
            const isToday =
              d && dateStr === new Date().toISOString().slice(0, 10);
            const isSelected = dateStr === selectedDate;
            return (
              <div
                key={i}
                className={`min-h-[80px] p-1.5 border-b border-r border-border cursor-pointer transition-colors ${!d ? "bg-muted/30" : "hover:bg-accent/50"} ${isSelected ? "bg-primary/5" : ""}`}
                onClick={() => d && setSelectedDate(dateStr)}
              >
                {d && (
                  <>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground"}`}
                    >
                      {d}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`rounded px-1 py-0.5 text-[10px] truncate ${typeColors[ev.type]}`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-[10px] text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Events on {selectedDate}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events scheduled.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div
                    className={`h-3 w-3 rounded-full mt-1 ${ev.type === "deadline" ? "bg-destructive" : ev.type === "meeting" ? "bg-primary" : "bg-success"}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {ev.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ev.description}
                    </p>
                    <span className="text-xs text-muted-foreground capitalize">
                      {ev.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                Add Event
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
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="event">Event</option>
                  </select>
                </div>
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
                  Add Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
