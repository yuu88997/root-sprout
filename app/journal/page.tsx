"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; date: string; text: string };

const LS_KEY = "journal:entries";

export default function JournalPage() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  // 初始化读取
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  // 持久化保存
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
  }, [entries]);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setEntries([{ id: String(Date.now()), date, text: t }, ...entries]);
    setText("");
  };

  const remove = (id: string) => setEntries(entries.filter(e => e.id !== id));

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4 text-gray-900">
      {/* 深色标题 */}
      <h1 className="text-2xl font-bold text-gray-900">📓 日记</h1>

      {/* 输入区 */}
      <textarea
        className="w-full border rounded p-3 min-h-[120px] text-gray-900 placeholder-gray-400"
        placeholder="写下今天的想法、感受或复盘..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          onClick={add}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
        >
          保存
        </button>
      </div>

      <hr />

      {/* 日记列表 */}
      <ul className="space-y-3">
        {entries.map((e) => (
          <li key={e.id} className="border rounded-lg p-3 text-gray-900">
            <div className="text-sm text-gray-600 mb-1">{e.date}</div>
            <div className="whitespace-pre-wrap">{e.text}</div>
            <div className="text-right mt-2">
              <button
                onClick={() => remove(e.id)}
                className="text-red-500 hover:underline text-sm"
              >
                删除
              </button>
            </div>
          </li>
        ))}
        {entries.length === 0 && (
          <div className="text-gray-500 text-sm">还没有日记，写一条试试～</div>
        )}
      </ul>
    </div>
  );
}
