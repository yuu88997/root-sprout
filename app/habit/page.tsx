"use client";

import { useEffect, useMemo, useState } from "react";

type Habit = { id: string; name: string; daysOfWeek: number[] };
type HabitMap = Record<string, boolean>;

const LS_HABITS = "habit:list:v2";
const LS_DONE = "habit:done";

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}
function domToMon0(d: Date) {
  const js = d.getDay();
  return (js + 6) % 7;
}

export default function HabitPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [done, setDone] = useState<HabitMap>({});
  const [newName, setNewName] = useState("");
  const [selectDOW, setSelectDOW] = useState<boolean[]>([true, true, true, true, true, false, false]);

  useEffect(() => {
    const h = localStorage.getItem(LS_HABITS);
    const d = localStorage.getItem(LS_DONE);
    if (h) setHabits(JSON.parse(h));
    if (d) setDone(JSON.parse(d));
  }, []);
  useEffect(() => localStorage.setItem(LS_HABITS, JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem(LS_DONE, JSON.stringify(done)), [done]);

  const matrix = useMemo(() => monthMatrix(year, month), [year, month]);
  const ymLabel = `${year} 年 ${month + 1} 月`;

  const addHabit = () => {
    const name = newName.trim();
    if (!name) return;
    const daysOfWeek = selectDOW.map((on, i) => (on ? i : -1)).filter((x) => x >= 0);
    setHabits([{ id: String(Date.now()), name, daysOfWeek }, ...habits]);
    setNewName("");
  };
  const delHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id));
    const copy = { ...done };
    Object.keys(copy).forEach((k) => { if (k.startsWith(id + "|")) delete copy[k]; });
    setDone(copy);
  };
  const toggle = (habitId: string, date: string) => {
    const key = `${habitId}|${date}`;
    setDone(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className="space-y-6 text-gray-900">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-teal-700">📅 打卡</h1>

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2">
            <input
              className="border rounded px-3 py-2 flex-1 text-gray-900"
              placeholder="例如：早起、阅读、运动…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              onClick={addHabit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
            >
              添加
            </button>
          </div>

          <div className="text-sm text-gray-600">选择需要打卡的星期几：</div>
          <div className="flex flex-wrap gap-2">
            {WEEK_LABELS.map((lab, i) => (
              <button
                key={i}
                onClick={() => {
                  const arr = [...selectDOW];
                  arr[i] = !arr[i];
                  setSelectDOW(arr);
                }}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  selectDOW[i]
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white hover:bg-green-50 border-gray-300"
                }`}
              >
                周{lab}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 mb-2">
          {habits.map((h) => (
            <li
              key={h.id}
              className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-2"
            >
              {h.name}
              <button
                onClick={() => delHabit(h.id)}
                className="text-red-500 hover:underline text-xs"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 月视图 */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => shiftMonth(-1)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">← 上一月</button>
          <div className="font-semibold">{ymLabel}</div>
          <button onClick={() => shiftMonth(1)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">下一月 →</button>
        </div>

        <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
          <div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div><div>日</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {matrix.flat().map((d, idx) => {
            const inMonth = d.getMonth() === month;
            const date = fmtDate(d);
            const mon0 = domToMon0(d);
            return (
              <div
                key={idx}
                className={`border rounded-lg p-2 ${inMonth ? "bg-white" : "bg-gray-50 text-gray-400"}`}
              >
                <div className="text-xs mb-1">{d.getDate()}</div>
                <div className="flex flex-col gap-1">
                  {habits.map(h => {
                    const scheduled = h.daysOfWeek.includes(mon0);
                    if (!scheduled) {
                      return (
                        <div
                          key={`${h.id}|${date}|off`}
                          className="text-xs rounded px-1 py-0.5 border bg-gray-50 text-gray-400 cursor-not-allowed"
                        >
                          {h.name}
                        </div>
                      );
                    }
                    const key = `${h.id}|${date}`;
                    const on = !!done[key];
                    return (
                      <button
                        key={key}
                        onClick={() => toggle(h.id, date)}
                        className={`text-xs rounded px-1 py-0.5 border ${
                          on
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white hover:bg-green-50"
                        }`}
                      >
                        {on ? "✔ " : ""}{h.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
