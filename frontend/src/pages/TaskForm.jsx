import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskFields from '../components/tasks/TaskFields';
import { useTaskStore } from '../store/taskStore';

function pad(value) {
  return String(value).padStart(2, '0');
}

function splitDate(value) {
  const date = value ? new Date(value) : new Date();
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function combine(date, time) {
  if (!date || !time) return null;
  return new Date(`${date}T${time}`).toISOString();
}

const blank = () => {
  const now = splitDate();
  return {
    title: '',
    description: '',
    date: now.date,
    start: '',
    end: '',
    priority: '',
    status: 'in_progress',
  };
};

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [values, setValues] = useState(blank);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const editing = Boolean(id);

  useEffect(() => {
    if (!editing) return undefined;
    let cancelled = false;

    async function load() {
      let list = [...useTaskStore.getState().tasks, ...useTaskStore.getState().results];
      if (!list.some((task) => task._id === id)) {
        await fetchTasks();
        list = useTaskStore.getState().tasks;
      }
      const existing = list.find((task) => task._id === id);
      if (!cancelled && existing) {
        const start = splitDate(existing.dueAt);
        const end = existing.endAt ? splitDate(existing.endAt) : { time: '' };
        setValues({
          title: existing.title,
          description: existing.description || '',
          date: start.date,
          start: start.time,
          end: end.time,
          priority: existing.priority || '',
          status: existing.status,
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [editing, id, fetchTasks]);

  async function onSubmit(event) {
    event.preventDefault();
    if (!values.start) {
      setError('Start time is required');
      return;
    }
    if (values.end && values.end <= values.start) {
      setError('End time must be after the start time');
      return;
    }

    setSaving(true);
    setError('');
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      dueAt: combine(values.date, values.start),
      endAt: values.end ? combine(values.date, values.end) : null,
      priority: values.priority || null,
      status: values.status,
    };
    try {
      if (editing) await updateTask(id, payload);
      else await createTask(payload);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save task');
      setSaving(false);
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      <button
        type="button"
        aria-label="Close"
        onClick={() => navigate(-1)}
        className="h-[40%] w-full shrink-0 bg-black/45"
      />
      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-[18px] font-semibold text-[#1c1c1c]">{editing ? 'Edit Task' : 'Add New Task'}</h1>
            <button type="button" aria-label="Close" onClick={() => navigate(-1)} className="text-[#9aa1ad]">
              <X size={20} />
            </button>
          </div>
          <TaskFields values={values} onChange={setValues} />
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        </div>
        <div className="px-5 pb-6 pt-3">
          <button
            type="submit"
            disabled={saving}
            className="h-12 w-full rounded-[10px] bg-[#5470F6] text-[15px] font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : editing ? 'Save task' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  );
}
