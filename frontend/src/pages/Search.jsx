import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import TaskRow from '../components/tasks/TaskRow';
import { useTaskStore } from '../store/taskStore';

export default function Search() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial = params.get('q') || '';
  const [query, setQuery] = useState(initial);
  const results = useTaskStore((state) => state.results);
  const searching = useTaskStore((state) => state.searching);
  const error = useTaskStore((state) => state.error);
  const search = useTaskStore((state) => state.search);
  const setStatus = useTaskStore((state) => state.setStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [submitted, setSubmitted] = useState(Boolean(initial));

  useEffect(() => {
    if (initial) search(initial);
  }, [initial, search]);

  async function onSubmit(value) {
    setSubmitted(true);
    await search(value.trim());
  }

  return (
    <>
      <div className="flex items-center gap-2 px-3 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="grid h-10 w-10 place-items-center text-[#3a4150]">
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1 pr-2">
          <Header value={query} onChange={setQuery} onSubmit={onSubmit} />
        </div>
      </div>
      <main className="flex-1 px-5 pb-8">
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {searching ? <p className="text-sm text-[#9aa1ad]">Searching…</p> : null}
        {submitted && !searching && results.length === 0 ? (
          <p className="text-sm text-[#9aa1ad]">No matching tasks.</p>
        ) : null}
        {results.map((task) => (
          <TaskRow key={task._id} task={task} onStatus={setStatus} onDelete={deleteTask} />
        ))}
      </main>
    </>
  );
}
