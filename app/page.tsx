"use client";

import { useEffect, useMemo, useState } from "react";

type Kind = "root" | "sprout";
type Task = { id: string; title: string; done: boolean; kind: Kind };

const LS_KEY = "tasks:v2";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Kind>("root");

  // 启动时加载
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try { setTasks(JSON.parse(raw)); } catch {}
    }
  }, []);

  // 变更时保存
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const roots = useMemo(() => tasks.filter(t => t.kind === "root"), [tasks]);
  const sprouts = useMemo(() => tasks.filter(t => t.kind === "sprout"), [tasks]);

  const addTask = () => {
    const t = title.trim();
    if (!t) return;
    setTasks([{ id: crypto.randomUUID(), title: t, done: false, kind }, ...tasks]);
    setTitle("");
  };
  const toggle = (id: string) =>
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks(tasks.filter(t => t.id !== id));
  const clearCompleted = (k?: Kind) => {
    if (!k) setTasks(tasks.filter(t => !t.done));
    else setTasks(tasks.filter(t => !(t.kind === k && t.done)));
  };

  const Section = ({
    label, data, color, kind,
  }: {
    label: string; data: Task[]; color: string; kind: Kind;
  }) => (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className={`text-xl font-semibold ${color}`}>{label}</h2>
        <button
          onClick={() => clearCompleted(kind)}
          className="text-sm text-gray-600 hover:underline"
        >
          清除已完成
        </button>
      </div>
      <ul className="space-y-2">
        {data.map((t) => (
          <li key={t.id} className="flex items-center gap-3 border rounded px-3 py-2 text-gray-900">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} className="h-4 w-4" />
            <span className={`flex-1 ${t.done ? "line-through text-gray-400" : ""}`}>{t.title}</span>
            <button onClick={() => remove(t.id)} className="text-red-500 text-sm hover:underline">删除</button>
          </li>
        ))}
        {data.length === 0 && <li className="text-gray-500 text-sm">暂无任务</li>}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6 text-gray-900">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-700">🌱 向下扎根 · 向上生长</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="border rounded px-3 py-2 flex-1 text-gray-900"
            placeholder="输入一条任务…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Kind)}
            className="border rounded px-3 py-2 md:w-44"
          >
            <option value="root">🪷 向下扎根（冥想/阅读/复盘…）</option>
            <option value="sprout">🌻 向上生长（工作/社交/学习…）</option>
          </select>
          <button
            onClick={addTask}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl md:w-28"
          >
            添加
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          共 {tasks.length} 项 · 已完成 {tasks.filter(t => t.done).length} 项
          <button onClick={() => clearCompleted()} className="ml-3 text-gray-600 hover:underline">
            清除所有已完成
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section label="🪷 向下扎根" data={roots} color="text-emerald-800" kind="root" />
        <Section label="🌻 向上生长" data={sprouts} color="text-amber-700" kind="sprout" />
      </div>
    </div>
  );
}
