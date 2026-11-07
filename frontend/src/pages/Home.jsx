import { useEffect, useMemo, useState } from 'react';
import { CheckSquare, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import TaskRow from '../components/tasks/TaskRow';
import { useTaskStore } from '../store/taskStore';
import { daysOfWeek, isSameDay, startOfDay } from '../utils/week';

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Home() {
  const navigate = useNavigate();
  const tasks = useTaskStore((state) => state.tasks);
  const loading = useTaskStore((state) => state.loading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const setStatus = useTaskStore((state) => state.setStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [selected, setSelected] = useState(() => new Date());
  const [query, setQuery] = useState('');
  const [showWeek, setShowWeek] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const days = useMemo(() => daysOfWeek(selected), [selected]);

  const weekTasks = useMemo(() => {
    const start = days[0].getTime();
    const end = days[6].getTime();
    return tasks.filter((task) => {
      const due = startOfDay(task.dueAt).getTime();
      return due >= start && due <= end;
    });
  }, [days, tasks]);

  const completed = weekTasks.filter((task) => task.status === 'completed').length;
  const pending = weekTasks.length - completed;
  const progress = weekTasks.length ? Math.round((completed / weekTasks.length) * 100) : 0;

  const visible = useMemo(() => {
    const source = showWeek ? weekTasks : weekTasks.filter((task) => isSameDay(task.dueAt, selected));
    const needle = query.trim().toLowerCase();
    const matched = needle
      ? source.filter((task) => `${task.title} ${task.description || ''}`.toLowerCase().includes(needle))
      : source;
    return [...matched].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  }, [query, selected, showWeek, weekTasks]);

  return (
    <>
      <div className="px-5 pt-5">
        <Header
          value={query}
          onChange={setQuery}
          onSubmit={(value) => navigate(value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : '/search')}
        />
      </div>
      <main className="flex-1 px-5 pb-28">
        <div className="mt-4 grid grid-cols-7">
          {days.map((day) => {
            const active = isSameDay(day, selected);
            return (
              <button
                key={day.getTime()}
                type="button"
                onClick={() => setSelected(day)}
                className={`flex h-[62px] min-w-0 flex-col items-center justify-center rounded-xl ${
                  active ? 'bg-[#5470F6] text-white' : 'text-[#b0b6c3]'
                }`}
              >
                <span className="text-[11px] leading-none">{weekday[day.getDay()]}</span>
                <span className={`mt-1 text-sm font-semibold leading-none ${active ? 'text-white' : 'text-[#4b5563]'}`}>
                  {String(day.getDate()).padStart(2, '0')}
                </span>
                <span className={`mt-1 h-1 w-1 rounded-full ${active ? 'bg-white' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <article className="min-w-0 rounded-2xl bg-[#eef1ff] px-3 py-4">
            <div className="flex items-center gap-2 text-[13px] text-[#8b93a7]">
              <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] bg-[#5470F6] text-white">
                <CheckSquare size={14} />
              </span>
              <span className="min-w-0 leading-4">Task Complete</span>
            </div>
            <p className="mt-3 text-[32px] font-semibold leading-none text-[#2a3142]">
              {String(completed).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs text-[#a0a7b8]">This Week</p>
          </article>
          <article className="min-w-0 rounded-2xl bg-[#fdeeee] px-3 py-4">
            <div className="flex items-center gap-2 text-[13px] text-[#8b93a7]">
              <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] bg-[#f7b4b4] text-white">
                <X size={14} strokeWidth={2.5} />
              </span>
              <span className="min-w-0 leading-4">Task Pending</span>
            </div>
            <p className="mt-3 text-[32px] font-semibold leading-none text-[#2a3142]">
              {String(pending).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs text-[#a0a7b8]">This Week</p>
          </article>
        </div>

        <h2 className="mt-6 text-base font-semibold">Weekly Progress</h2>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#eceefe]">
          <div className="h-full rounded-full bg-[#3e4ec4]" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold">{showWeek ? 'Tasks This Week' : 'Tasks Today'}</h2>
          <button type="button" onClick={() => setShowWeek((value) => !value)} className="text-sm font-medium text-[#5470F6]">
            {showWeek ? 'Today' : 'View All'}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        {loading && tasks.length === 0 ? <p className="mt-4 text-sm text-[#9aa1ad]">Loading tasks…</p> : null}
        {!loading && visible.length === 0 ? (
          <p className="mt-4 text-sm text-[#9aa1ad]">{showWeek ? 'No tasks this week.' : 'No tasks for this day.'}</p>
        ) : null}
        <div>
          {visible.map((task) => (
            <TaskRow key={task._id} task={task} onStatus={setStatus} onDelete={deleteTask} />
          ))}
        </div>
      </main>
      <button
        type="button"
        aria-label="Add Task"
        onClick={() => navigate('/tasks/new')}
        className="absolute bottom-6 left-1/2 z-10 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-[#5470F6] text-white shadow-[0_10px_24px_rgba(84,112,246,0.35)]"
      >
        <Plus size={30} />
      </button>
    </>
  );
}
