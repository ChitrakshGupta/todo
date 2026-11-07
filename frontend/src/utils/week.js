export function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function addDays(value, amount) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

export function daysOfWeek(anchor) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function startOfWeek(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

export function endOfWeek(start) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

export function formatWeekLabel(start) {
  const end = endOfWeek(start);
  const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function weekKey(start) {
  return startOfWeek(start).getTime();
}

export function groupTasksByWeek(tasks) {
  const map = new Map();

  for (const task of tasks) {
    const start = startOfWeek(task.dueAt);
    const key = start.getTime();
    if (!map.has(key)) map.set(key, { key, start, tasks: [] });
    map.get(key).tasks.push(task);
  }

  const current = startOfWeek(new Date());
  if (!map.has(current.getTime())) {
    map.set(current.getTime(), { key: current.getTime(), start: current, tasks: [] });
  }

  return [...map.values()]
    .map((week) => ({
      ...week,
      tasks: [...week.tasks].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)),
      open: week.tasks.filter((task) => task.status !== 'completed').length,
      completed: week.tasks.filter((task) => task.status === 'completed').length,
    }))
    .sort((a, b) => b.start - a.start);
}

export function formatTaskTime(value) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function toDateTimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
