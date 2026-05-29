import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";

export type AuthBuckets = {
  total: number;
  last_24h: number;
  last_7d: number;
  last_30d: number;
  distinct_devices_7d: number;
  most_recent_at: string | null;
};

export type TourFunnel = {
  started: number;          // any row in tour_progress
  completed: number;        // completed_at is not null
  current_distribution: Array<{ step: number; count: number }>; // current_step counts
};

export type ChatUsage = {
  total: number;
  last_24h: number;
  last_7d: number;
  by_topic: Record<"finance" | "bylaws" | "both" | "other", number>;
  recent_7d_avg_length: number | null;
};

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export async function fetchAuthBuckets(): Promise<AuthBuckets> {
  const supabase = await getSupabaseServer();
  const sevenDaysAgo = isoDaysAgo(7);
  const { data, error } = await supabase
    .from("auth_events")
    .select("occurred_at, user_agent_hash")
    .eq("event_type", "signin")
    .order("occurred_at", { ascending: false })
    .limit(5000);

  if (error || !data) {
    return {
      total: 0,
      last_24h: 0,
      last_7d: 0,
      last_30d: 0,
      distinct_devices_7d: 0,
      most_recent_at: null,
    };
  }

  const now = Date.now();
  const cutoff24h = now - 24 * 60 * 60 * 1000;
  const cutoff7d = now - 7 * 24 * 60 * 60 * 1000;
  const cutoff30d = now - 30 * 24 * 60 * 60 * 1000;
  let last_24h = 0;
  let last_7d = 0;
  let last_30d = 0;
  const devices7d = new Set<string>();
  for (const row of data as Array<{ occurred_at: string; user_agent_hash: string | null }>) {
    const t = new Date(row.occurred_at).getTime();
    if (t >= cutoff24h) last_24h++;
    if (t >= cutoff7d) {
      last_7d++;
      if (row.user_agent_hash) devices7d.add(row.user_agent_hash);
    }
    if (t >= cutoff30d) last_30d++;
  }
  // sevenDaysAgo is used as the analytic anchor; kept for future
  // explicit filters but not currently emitted on the response.
  void sevenDaysAgo;

  return {
    total: data.length,
    last_24h,
    last_7d,
    last_30d,
    distinct_devices_7d: devices7d.size,
    most_recent_at: data[0]?.occurred_at ?? null,
  };
}

export async function fetchTourFunnel(): Promise<TourFunnel> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("tour_progress")
    .select("current_step, completed_at");

  if (error || !data) {
    return { started: 0, completed: 0, current_distribution: [] };
  }

  const stepCounts = new Map<number, number>();
  let completed = 0;
  for (const r of data as Array<{ current_step: number; completed_at: string | null }>) {
    stepCounts.set(r.current_step, (stepCounts.get(r.current_step) ?? 0) + 1);
    if (r.completed_at) completed++;
  }
  const current_distribution = Array.from({ length: 6 }, (_, i) => ({
    step: i + 1,
    count: stepCounts.get(i + 1) ?? 0,
  }));

  return { started: data.length, completed, current_distribution };
}

export async function fetchChatUsage(): Promise<ChatUsage> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("chat_queries")
    .select("occurred_at, topic_tag, question_length")
    .order("occurred_at", { ascending: false })
    .limit(5000);

  if (error || !data) {
    return {
      total: 0,
      last_24h: 0,
      last_7d: 0,
      by_topic: { finance: 0, bylaws: 0, both: 0, other: 0 },
      recent_7d_avg_length: null,
    };
  }

  const now = Date.now();
  const cutoff24h = now - 24 * 60 * 60 * 1000;
  const cutoff7d = now - 7 * 24 * 60 * 60 * 1000;
  let last_24h = 0;
  let last_7d = 0;
  let len7dSum = 0;
  let len7dCount = 0;
  const by_topic: ChatUsage["by_topic"] = {
    finance: 0,
    bylaws: 0,
    both: 0,
    other: 0,
  };
  for (const r of data as Array<{
    occurred_at: string;
    topic_tag: keyof ChatUsage["by_topic"];
    question_length: number | null;
  }>) {
    const t = new Date(r.occurred_at).getTime();
    if (t >= cutoff24h) last_24h++;
    if (t >= cutoff7d) {
      last_7d++;
      if (typeof r.question_length === "number") {
        len7dSum += r.question_length;
        len7dCount++;
      }
    }
    by_topic[r.topic_tag] = (by_topic[r.topic_tag] ?? 0) + 1;
  }
  return {
    total: data.length,
    last_24h,
    last_7d,
    by_topic,
    recent_7d_avg_length: len7dCount > 0 ? Math.round(len7dSum / len7dCount) : null,
  };
}
